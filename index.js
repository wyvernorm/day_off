// =============================================
// Shift Manager - Main Worker with Google OAuth
// =============================================

import { handleAPI, ensureTables } from './api.js';
import { getLoginHTML, getHTML } from './frontend.js';

// Simple in-memory rate limiter (resets on worker restart)
const rateLimiter = new Map();
const RATE_LIMIT = 60; // requests per minute per session
const RATE_WINDOW = 60000; // 1 minute in ms

function checkRateLimit(token) {
  if (!token) return true;
  const now = Date.now();
  const key = token.substring(0, 16); // ใช้แค่ prefix เพื่อประหยัด memory
  let entry = rateLimiter.get(key);
  if (!entry || now - entry.start > RATE_WINDOW) {
    entry = { start: now, count: 1 };
    rateLimiter.set(key, entry);
    // Clean up old entries every 100 requests
    if (rateLimiter.size > 1000) {
      for (const [k, v] of rateLimiter) { if (now - v.start > RATE_WINDOW) rateLimiter.delete(k); }
    }
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // CORS — support React frontend on Pages (credentials for cookie auth)
    const origin = request.headers.get('Origin') || '*';
    const allowedOrigins = [env.APP_URL, env.PAGES_URL, url.origin].filter(Boolean);
    const corsOrigin = allowedOrigins.includes(origin) ? origin : (allowedOrigins[0] || '*');
    const corsHeaders = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

    try {
      const APP_URL = env.APP_URL || url.origin;

      // ==================== AUTH ROUTES ====================

      // Google OAuth - Start login
      if (url.pathname === '/auth/login') {
        const params = new URLSearchParams({
          client_id: env.GOOGLE_CLIENT_ID,
          redirect_uri: APP_URL + '/auth/callback',
          response_type: 'code',
          scope: 'openid email profile',
          access_type: 'offline',
          prompt: 'select_account',
        });
        return Response.redirect('https://accounts.google.com/o/oauth2/v2/auth?' + params.toString(), 302);
      }

      // Google OAuth - Callback
      if (url.pathname === '/auth/callback') {
        const code = url.searchParams.get('code');
        if (!code) return new Response('Missing code', { status: 400 });

        // Exchange code for tokens
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code,
            client_id: env.GOOGLE_CLIENT_ID,
            client_secret: env.GOOGLE_CLIENT_SECRET,
            redirect_uri: APP_URL + '/auth/callback',
            grant_type: 'authorization_code',
          }),
        });
        const tokens = await tokenRes.json();
        if (!tokens.access_token) return new Response('Token error: ' + JSON.stringify(tokens), { status: 400 });

        // Get user info
        const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: 'Bearer ' + tokens.access_token },
        });
        const user = await userRes.json();

        // Check if email is registered (case-insensitive)
        let employee = await env.DB.prepare(
          'SELECT * FROM employees WHERE LOWER(email) = LOWER(?) AND is_active = 1'
        ).bind(user.email).first();

        if (!employee) {
          // Check if this is the very first user (no employees exist) — auto-create as owner
          const { results: allEmps } = await env.DB.prepare('SELECT id FROM employees WHERE is_active=1').all();
          if (allEmps.length === 0) {
            await env.DB.prepare(
              `INSERT INTO employees (name, nickname, email, role, default_shift, shift_start, shift_end, default_off_day, avatar, show_in_calendar, is_active, max_leave_per_year)
               VALUES (?, ?, ?, 'owner', 'day', '09:00', '17:00', '0,6', '👑', 0, 1, 20)`
            ).bind(user.name || user.email.split('@')[0], user.name || user.email.split('@')[0], user.email).run();
            employee = await env.DB.prepare(
              'SELECT * FROM employees WHERE LOWER(email) = LOWER(?) AND is_active = 1'
            ).bind(user.email).first();
          }
        }

        if (!employee) {
          const safeEmail = user.email.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
          return new Response(getLoginHTML(APP_URL, 'อีเมล ' + safeEmail + ' ไม่มีสิทธิ์เข้าใช้ระบบ — กรุณาติดต่อแอดมินเพื่อเพิ่มบัญชี'), {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        }

        // Update profile image from Google
        if (user.picture && user.picture !== employee.profile_image) {
          await env.DB.prepare(
            "UPDATE employees SET profile_image = ?, updated_at = datetime('now') WHERE id = ?"
          ).bind(user.picture, employee.id).run();
        }

        // Create session
        const token = crypto.randomUUID() + '-' + crypto.randomUUID();
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        await env.DB.prepare(
          'INSERT INTO sessions (token, employee_id, email, expires_at) VALUES (?, ?, ?, ?)'
        ).bind(token, employee.id, user.email, expires.toISOString()).run();

        // Update last_login
        await env.DB.prepare("UPDATE employees SET last_login=datetime('now') WHERE id=?").bind(employee.id).run();

        // Set cookie and redirect
        return new Response(null, {
          status: 302,
          headers: {
            'Location': '/',
            'Set-Cookie': `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${expires.toUTCString()}`,
          },
        });
      }

      // Logout
      if (url.pathname === '/auth/logout') {
        const token = getSessionToken(request);
        if (token) {
          await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
        }
        return new Response(null, {
          status: 302,
          headers: {
            'Location': '/',
            'Set-Cookie': 'session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
          },
        });
      }

      // ==================== AUTH CHECK ====================
      const token = getSessionToken(request);
      let currentUser = null;

      if (token) {
        const session = await env.DB.prepare(
          "SELECT s.*, e.* FROM sessions s JOIN employees e ON s.employee_id = e.id WHERE s.token = ? AND s.expires_at > datetime('now')"
        ).bind(token).first();
        if (session) currentUser = session;
      }

      // API routes - require auth
      if (url.pathname.startsWith('/api/')) {
        if (!currentUser) {
          return new Response(JSON.stringify({ error: 'กรุณาเข้าสู่ระบบ' }), {
            status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
        // Rate limiting
        if (!checkRateLimit(token)) {
          return new Response(JSON.stringify({ error: 'คำขอมากเกินไป กรุณารอสักครู่' }), {
            status: 429, headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
        const response = await handleAPI(request, env, url, currentUser);
        const headers = new Headers(response.headers);
        Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));
        return new Response(response.body, { status: response.status, headers });
      }

      // Static assets (JS, CSS, images) — let Cloudflare [assets] handle
      // These are served automatically by wrangler [assets] config

      // Main page — not logged in → login page
      if (!currentUser) {
        return new Response(getLoginHTML(APP_URL), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      await ensureTables(env.DB);

      // React route — /new serves React SPA
      if (url.pathname === '/new' && env.ASSETS) {
        try {
          const assetUrl = new URL('/index.html', request.url);
          const assetReq = new Request(assetUrl, request);
          const assetRes = await env.ASSETS.fetch(assetReq);
          if (assetRes.ok) {
            let html = await assetRes.text();
            const userJson = JSON.stringify({
              id: currentUser.employee_id, name: currentUser.name, nickname: currentUser.nickname,
              email: currentUser.email, role: currentUser.role, avatar: currentUser.avatar,
              profile_image: currentUser.profile_image, show_in_calendar: currentUser.show_in_calendar,
            });
            html = html.replace('</head>', `<script>window.__USER__=${userJson};</script></head>`);
            return new Response(html, {
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
            });
          }
        } catch (e) { /* fallback */ }
      }

      // Main: legacy frontend (frontend.js) — full featured
      return new Response(getHTML(currentUser), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });

    } catch (err) {
      console.error('Worker error:', err.message, err.stack);
      return new Response(JSON.stringify({ error: 'เกิดข้อผิดพลาดภายในระบบ' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};

function getSessionToken(request) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/session=([^;]+)/);
  return match ? match[1] : null;
}
