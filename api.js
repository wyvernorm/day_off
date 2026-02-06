// =============================================
// API Routes Handler v4
// =============================================

export async function handleAPI(request, env, url, currentUser) {
  const { pathname } = url;
  const method = request.method;
  const DB = env.DB;
  const isAdminOrOwner = currentUser.role === 'admin' || currentUser.role === 'owner';

  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
  const getBody = async () => { try { return await request.json(); } catch { return {}; } };

  // ==================== ME ====================
  if (pathname === '/api/me' && method === 'GET') {
    const emp = await DB.prepare('SELECT * FROM employees WHERE id = ?').bind(currentUser.employee_id).first();
    return json({ data: emp });
  }

  if (pathname === '/api/me' && method === 'PUT') {
    const body = await getBody();
    const allowed = ['nickname', 'avatar', 'phone', 'line_id'];
    const fields = [], values = [];
    for (const [k, v] of Object.entries(body)) {
      if (allowed.includes(k)) { fields.push(`${k} = ?`); values.push(v); }
    }
    if (!fields.length) return json({ error: 'ไม่มีข้อมูลที่ต้องแก้ไข' }, 400);
    fields.push("updated_at = datetime('now')"); values.push(currentUser.employee_id);
    await DB.prepare(`UPDATE employees SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run();
    return json({ message: 'อัพเดทโปรไฟล์สำเร็จ' });
  }

  // ==================== SETTINGS ====================
  if (pathname === '/api/settings' && method === 'GET') {
    const { results } = await DB.prepare('SELECT * FROM settings').all();
    const settings = {}; results.forEach(r => { settings[r.key] = r.value; });
    return json({ data: settings });
  }

  if (pathname === '/api/settings' && method === 'PUT') {
    if (!isAdminOrOwner) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    const body = await getBody();
    const stmt = DB.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')");
    const batch = Object.entries(body).map(([k, v]) => stmt.bind(k, String(v)));
    if (batch.length) await DB.batch(batch);
    return json({ message: 'บันทึกตั้งค่าสำเร็จ' });
  }

  // ==================== EMPLOYEES ====================
  if (pathname === '/api/employees' && method === 'GET') {
    const { results } = await DB.prepare('SELECT * FROM employees WHERE is_active = 1 ORDER BY show_in_calendar DESC, role DESC, name').all();
    return json({ data: results });
  }

  if (pathname === '/api/employees' && method === 'POST') {
    if (!isAdminOrOwner) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    const body = await getBody();
    const { name, nickname, email, role, default_shift, shift_start, shift_end, default_off_day, avatar, show_in_calendar } = body;
    const result = await DB.prepare(
      `INSERT INTO employees (name, nickname, email, role, default_shift, shift_start, shift_end, default_off_day, avatar, show_in_calendar)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(name, nickname || null, email || null, role || 'staff',
           default_shift || 'day', shift_start || '09:00', shift_end || '17:00',
           default_off_day ?? '6', avatar || '👤', show_in_calendar ?? 1).run();
    await logActivity(DB, 'employee_add', `เพิ่มพนักงาน: ${name}`, result.meta.last_row_id, currentUser.employee_id);
    return json({ data: { id: result.meta.last_row_id }, message: 'เพิ่มพนักงานสำเร็จ' }, 201);
  }

  if (pathname.match(/^\/api\/employees\/\d+$/) && method === 'PUT') {
    if (!isAdminOrOwner) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    const id = pathname.split('/').pop();
    const body = await getBody();
    const fields = [], values = [];
    const allowed = ['name','nickname','email','role','department','default_shift','shift_start','shift_end',
                     'default_off_day','avatar','phone','line_id','show_in_calendar',
                     'max_sick_leave','max_personal_leave','max_vacation_leave','max_maternity_leave','is_active'];
    for (const [key, val] of Object.entries(body)) {
      if (allowed.includes(key)) { fields.push(`${key} = ?`); values.push(val); }
    }
    if (!fields.length) return json({ error: 'ไม่มีข้อมูลที่ต้องแก้ไข' }, 400);
    fields.push("updated_at = datetime('now')"); values.push(id);
    await DB.prepare(`UPDATE employees SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run();
    await logActivity(DB, 'employee_update', `แก้ไขพนักงาน ID: ${id}`, id, currentUser.employee_id);
    return json({ message: 'แก้ไขสำเร็จ' });
  }

  if (pathname.match(/^\/api\/employees\/\d+$/) && method === 'DELETE') {
    if (!isAdminOrOwner) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    const id = pathname.split('/').pop();
    await DB.prepare("UPDATE employees SET is_active = 0, updated_at = datetime('now') WHERE id = ?").bind(id).run();
    return json({ message: 'ลบสำเร็จ' });
  }

  // ==================== SHIFTS ====================
  if (pathname === '/api/shifts' && method === 'POST') {
    const body = await getBody();
    await DB.prepare(
      `INSERT INTO shifts (employee_id, date, shift_type, note, created_by) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(employee_id, date) DO UPDATE SET shift_type=excluded.shift_type, note=excluded.note, created_by=excluded.created_by, updated_at=datetime('now')`
    ).bind(body.employee_id, body.date, body.shift_type, body.note || null, currentUser.employee_id).run();
    return json({ message: 'บันทึกกะสำเร็จ' });
  }

  if (pathname === '/api/shifts/bulk' && method === 'POST') {
    const { shifts: list } = await getBody();
    if (!list?.length) return json({ error: 'ต้องส่ง shifts array' }, 400);
    const stmt = DB.prepare(`INSERT INTO shifts (employee_id, date, shift_type) VALUES (?, ?, ?)
       ON CONFLICT(employee_id, date) DO UPDATE SET shift_type=excluded.shift_type, updated_at=datetime('now')`);
    await DB.batch(list.map(s => stmt.bind(s.employee_id, s.date, s.shift_type)));
    return json({ message: `บันทึก ${list.length} กะสำเร็จ` });
  }

  // ==================== LEAVES ====================
  if (pathname === '/api/leaves' && method === 'GET') {
    const month = url.searchParams.get('month'), empId = url.searchParams.get('employee_id'),
          status = url.searchParams.get('status'), year = url.searchParams.get('year');
    let q = 'SELECT l.*, e.name as employee_name, e.avatar, e.nickname FROM leaves l JOIN employees e ON l.employee_id = e.id WHERE 1=1';
    const p = [];
    if (month) { q += " AND l.date LIKE ?"; p.push(`${month}%`); }
    if (empId) { q += " AND l.employee_id = ?"; p.push(empId); }
    if (status) { q += " AND l.status = ?"; p.push(status); }
    if (year) { q += " AND l.date LIKE ?"; p.push(`${year}%`); }
    q += ' ORDER BY l.date DESC';
    const { results } = p.length ? await DB.prepare(q).bind(...p).all() : await DB.prepare(q).all();
    return json({ data: results });
  }

  if (pathname === '/api/leaves' && method === 'POST') {
    const body = await getBody();
    const year = body.date.substring(0, 4);
    const quota = await getLeaveQuota(DB, body.employee_id, body.leave_type, year);
    if (quota.used >= quota.max) return json({ error: `วันลา${lbl(body.leave_type)}ใช้หมดแล้ว (${quota.used}/${quota.max})` }, 400);
    await DB.prepare(
      `INSERT INTO leaves (employee_id, date, leave_type, reason, status) VALUES (?, ?, ?, ?, 'pending')
       ON CONFLICT(employee_id, date) DO UPDATE SET leave_type=excluded.leave_type, reason=excluded.reason, status='pending', updated_at=datetime('now')`
    ).bind(body.employee_id, body.date, body.leave_type, body.reason || null).run();
    return json({ message: 'บันทึกวันลาสำเร็จ' }, 201);
  }

  if (pathname === '/api/leaves/range' && method === 'POST') {
    const body = await getBody();
    const dates = getDateRange(body.start_date, body.end_date);
    const year = body.start_date.substring(0, 4);
    const quota = await getLeaveQuota(DB, body.employee_id, body.leave_type, year);
    if (quota.used + dates.length > quota.max) return json({ error: `วันลาไม่พอ (เหลือ ${quota.remaining} วัน)` }, 400);
    const stmt = DB.prepare(`INSERT INTO leaves (employee_id, date, leave_type, reason, status) VALUES (?, ?, ?, ?, 'pending')
       ON CONFLICT(employee_id, date) DO UPDATE SET leave_type=excluded.leave_type, reason=excluded.reason, status='pending', updated_at=datetime('now')`);
    await DB.batch(dates.map(d => stmt.bind(body.employee_id, d, body.leave_type, body.reason || null)));
    return json({ message: `บันทึก ${dates.length} วันสำเร็จ` }, 201);
  }

  if (pathname.match(/^\/api\/leaves\/\d+\/approve$/) && method === 'PUT') {
    if (!isAdminOrOwner) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    await DB.prepare("UPDATE leaves SET status='approved', approved_by=?, approved_at=datetime('now'), updated_at=datetime('now') WHERE id=?")
      .bind(currentUser.employee_id, pathname.split('/')[3]).run();
    return json({ message: 'อนุมัติสำเร็จ' });
  }

  if (pathname.match(/^\/api\/leaves\/\d+\/reject$/) && method === 'PUT') {
    if (!isAdminOrOwner) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    await DB.prepare("UPDATE leaves SET status='rejected', approved_by=?, approved_at=datetime('now'), updated_at=datetime('now') WHERE id=?")
      .bind(currentUser.employee_id, pathname.split('/')[3]).run();
    return json({ message: 'ปฏิเสธสำเร็จ' });
  }

  if (pathname.match(/^\/api\/leaves\/\d+$/) && method === 'DELETE') {
    await DB.prepare('DELETE FROM leaves WHERE id = ?').bind(pathname.split('/').pop()).run();
    return json({ message: 'ยกเลิกวันลาสำเร็จ' });
  }

  // ==================== SWAPS ====================
  if (pathname === '/api/swaps' && method === 'GET') {
    const status = url.searchParams.get('status');
    let q = `SELECT sr.*, e1.name as from_name, e1.avatar as from_avatar, e1.nickname as from_nickname,
      e2.name as to_name, e2.avatar as to_avatar, e2.nickname as to_nickname
      FROM swap_requests sr JOIN employees e1 ON sr.from_employee_id=e1.id JOIN employees e2 ON sr.to_employee_id=e2.id`;
    const p = [];
    if (status) { q += ' WHERE sr.status = ?'; p.push(status); }
    q += ' ORDER BY sr.created_at DESC';
    const { results } = p.length ? await DB.prepare(q).bind(...p).all() : await DB.prepare(q).all();
    return json({ data: results });
  }

  if (pathname === '/api/swaps' && method === 'POST') {
    const body = await getBody();
    const fs = await DB.prepare('SELECT shift_type FROM shifts WHERE employee_id=? AND date=?').bind(body.from_employee_id, body.date).first();
    const ts = await DB.prepare('SELECT shift_type FROM shifts WHERE employee_id=? AND date=?').bind(body.to_employee_id, body.date).first();
    await DB.prepare('INSERT INTO swap_requests (date, from_employee_id, to_employee_id, from_shift, to_shift, reason) VALUES (?,?,?,?,?,?)')
      .bind(body.date, body.from_employee_id, body.to_employee_id, fs?.shift_type||'day', ts?.shift_type||'day', body.reason||null).run();
    return json({ message: 'ส่งคำขอสลับกะสำเร็จ' }, 201);
  }

  if (pathname.match(/^\/api\/swaps\/\d+\/approve$/) && method === 'PUT') {
    if (!isAdminOrOwner) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    const id = pathname.split('/')[3];
    const sw = await DB.prepare('SELECT * FROM swap_requests WHERE id=?').bind(id).first();
    if (!sw) return json({ error: 'ไม่พบคำขอ' }, 404);
    await DB.batch([
      DB.prepare(`INSERT INTO shifts (employee_id,date,shift_type) VALUES (?,?,?) ON CONFLICT(employee_id,date) DO UPDATE SET shift_type=excluded.shift_type,updated_at=datetime('now')`)
        .bind(sw.from_employee_id, sw.date, sw.to_shift),
      DB.prepare(`INSERT INTO shifts (employee_id,date,shift_type) VALUES (?,?,?) ON CONFLICT(employee_id,date) DO UPDATE SET shift_type=excluded.shift_type,updated_at=datetime('now')`)
        .bind(sw.to_employee_id, sw.date, sw.from_shift),
      DB.prepare("UPDATE swap_requests SET status='approved',approved_by=?,approved_at=datetime('now') WHERE id=?").bind(currentUser.employee_id, id),
    ]);
    return json({ message: 'อนุมัติสลับกะสำเร็จ' });
  }

  if (pathname.match(/^\/api\/swaps\/\d+\/reject$/) && method === 'PUT') {
    if (!isAdminOrOwner) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    await DB.prepare("UPDATE swap_requests SET status='rejected',approved_by=?,approved_at=datetime('now') WHERE id=?")
      .bind(currentUser.employee_id, pathname.split('/')[3]).run();
    return json({ message: 'ปฏิเสธสำเร็จ' });
  }

  // ==================== HOLIDAYS ====================
  if (pathname === '/api/holidays' && method === 'GET') {
    const year = url.searchParams.get('year') || new Date().getFullYear().toString();
    const { results } = await DB.prepare('SELECT * FROM holidays WHERE date LIKE ? ORDER BY date').bind(`${year}%`).all();
    return json({ data: results });
  }
  if (pathname === '/api/holidays' && method === 'POST') {
    if (!isAdminOrOwner) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    const body = await getBody();
    await DB.prepare('INSERT OR REPLACE INTO holidays (date, name, type) VALUES (?,?,?)').bind(body.date, body.name, body.type||'company').run();
    return json({ message: 'เพิ่มวันหยุดสำเร็จ' }, 201);
  }
  if (pathname.match(/^\/api\/holidays\/\d+$/) && method === 'DELETE') {
    if (!isAdminOrOwner) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    await DB.prepare('DELETE FROM holidays WHERE id=?').bind(pathname.split('/').pop()).run();
    return json({ message: 'ลบวันหยุดสำเร็จ' });
  }

  // ==================== OVERVIEW ====================
  if (pathname === '/api/overview' && method === 'GET') {
    const month = url.searchParams.get('month');
    if (!month) return json({ error: 'ต้องระบุ month' }, 400);
    const [e, s, l, h, st] = await Promise.all([
      DB.prepare('SELECT * FROM employees WHERE is_active=1 ORDER BY show_in_calendar DESC, role DESC, name').all(),
      DB.prepare('SELECT * FROM shifts WHERE date LIKE ? ORDER BY date').bind(`${month}%`).all(),
      DB.prepare("SELECT * FROM leaves WHERE date LIKE ? AND status!='rejected' ORDER BY date").bind(`${month}%`).all(),
      DB.prepare('SELECT * FROM holidays WHERE date LIKE ? ORDER BY date').bind(`${month}%`).all(),
      DB.prepare('SELECT * FROM settings').all(),
    ]);
    const settings = {}; st.results.forEach(r => { settings[r.key] = r.value; });
    return json({ data: { employees: e.results, shifts: s.results, leaves: l.results, holidays: h.results, settings } });
  }

  // ==================== LOGS ====================
  if (pathname === '/api/logs' && method === 'GET') {
    const { results } = await DB.prepare('SELECT al.*, e.name as employee_name FROM activity_logs al LEFT JOIN employees e ON al.employee_id=e.id ORDER BY al.created_at DESC LIMIT 50').all();
    return json({ data: results });
  }

  return json({ error: 'Not found' }, 404);
}

async function getLeaveQuota(DB, empId, type, year) {
  const f = `max_${type}_leave`;
  const emp = await DB.prepare(`SELECT ${f} FROM employees WHERE id=?`).bind(empId).first();
  const used = await DB.prepare("SELECT COUNT(*) as c FROM leaves WHERE employee_id=? AND leave_type=? AND date LIKE ? AND status!='rejected'").bind(empId, type, `${year}%`).first();
  const max = emp?.[f]||0, u = used?.c||0;
  return { type, max, used: u, remaining: max - u };
}
function lbl(t) { return { sick:'ป่วย', personal:'กิจ', vacation:'พักร้อน', maternity:'คลอด' }[t]||t; }
function getDateRange(s, e) { const d=[],c=new Date(s),ed=new Date(e); while(c<=ed){d.push(c.toISOString().split('T')[0]);c.setDate(c.getDate()+1);} return d; }
async function logActivity(DB, action, desc, empId=null, by=null) {
  await DB.prepare('INSERT INTO activity_logs (action,description,employee_id,performed_by) VALUES (?,?,?,?)').bind(action,desc,empId,by).run();
}
