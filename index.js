// =============================================
// Shift Manager - Cloudflare Worker
// =============================================

import { handleAPI } from './api.js';
import { getHTML } from './frontend.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // API routes
      if (url.pathname.startsWith('/api/')) {
        const response = await handleAPI(request, env, url);
        // Add CORS headers to API responses
        const headers = new Headers(response.headers);
        Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));
        return new Response(response.body, {
          status: response.status,
          headers,
        });
      }

      // Serve frontend
      return new Response(getHTML(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  },
};
