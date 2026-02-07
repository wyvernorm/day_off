// =============================================
// 🔌 API Client — same origin as Workers
// =============================================

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, method = 'GET', body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(path, opts);
  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(data.error || 'เกิดข้อผิดพลาด', res.status);
  }
  return data;
}

export const apiGet = (path) => api(path);
export const apiPost = (path, body) => api(path, 'POST', body);
export const apiPut = (path, body) => api(path, 'PUT', body);
export const apiDel = (path) => api(path, 'DELETE');
