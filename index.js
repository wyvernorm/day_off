// =============================================
// Shift Manager - Main Worker with Google OAuth
// =============================================

import { handleAPI } from './api.js';
import { getLoginHTML, getHTML } from './frontend.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

        // Check if email is registered
        const employee = await env.DB.prepare(
          'SELECT * FROM employees WHERE email = ? AND is_active = 1'
        ).bind(user.email).first();

        if (!employee) {
          return new Response(getLoginHTML(APP_URL, 'อีเมล ' + user.email + ' ไม่มีสิทธิ์เข้าใช้ระบบ'), {
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
        const response = await handleAPI(request, env, url, currentUser);
        const headers = new Headers(response.headers);
        Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));
        return new Response(response.body, { status: response.status, headers });
      }

      // Main page - require auth
      if (!currentUser) {
        return new Response(getLoginHTML(APP_URL), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      return new Response(getHTML(currentUser), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
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
