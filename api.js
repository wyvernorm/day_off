// =============================================
// API v5 - combined leave quota = 20/year
// =============================================

export async function handleAPI(request, env, url, currentUser) {
  const { pathname } = url;
  const method = request.method;
  const DB = env.DB;
  const isO = currentUser.role === 'admin' || currentUser.role === 'owner';
  const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'Content-Type': 'application/json' } });
  const getBody = async () => { try { return await request.json(); } catch { return {}; } };

  // ME
  if (pathname === '/api/me' && method === 'GET') {
    return json({ data: await DB.prepare('SELECT * FROM employees WHERE id=?').bind(currentUser.employee_id).first() });
  }
  if (pathname === '/api/me' && method === 'PUT') {
    const b = await getBody();
    const a = ['nickname', 'avatar', 'phone', 'line_id'], f = [], v = [];
    for (const [k, val] of Object.entries(b)) { if (a.includes(k)) { f.push(`${k}=?`); v.push(val); } }
    if (!f.length) return json({ error: 'ไม่มีข้อมูล' }, 400);
    f.push("updated_at=datetime('now')"); v.push(currentUser.employee_id);
    await DB.prepare(`UPDATE employees SET ${f.join(',')} WHERE id=?`).bind(...v).run();
    return json({ message: 'อัพเดทสำเร็จ' });
  }

  // SETTINGS
  if (pathname === '/api/settings' && method === 'GET') {
    const { results } = await DB.prepare('SELECT * FROM settings').all();
    const s = {}; results.forEach(r => { s[r.key] = r.value; }); return json({ data: s });
  }
  if (pathname === '/api/settings' && method === 'PUT') {
    if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    const b = await getBody();
    const stmt = DB.prepare("INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=datetime('now')");
    await DB.batch(Object.entries(b).map(([k, v]) => stmt.bind(k, String(v))));
    return json({ message: 'บันทึกสำเร็จ' });
  }

  // EMPLOYEES
  if (pathname === '/api/employees' && method === 'GET') {
    const { results } = await DB.prepare('SELECT * FROM employees WHERE is_active=1 ORDER BY show_in_calendar DESC,role DESC,name').all();
    return json({ data: results });
  }
  if (pathname === '/api/employees' && method === 'POST') {
    if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    const b = await getBody();
    const r = await DB.prepare(
      `INSERT INTO employees (name,nickname,email,role,default_shift,shift_start,shift_end,default_off_day,avatar,show_in_calendar,max_leave_per_year) VALUES (?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(b.name, b.nickname || null, b.email || null, b.role || 'staff', b.default_shift || 'day',
           b.shift_start || '09:00', b.shift_end || '17:00', b.default_off_day ?? '6', b.avatar || '👤',
           b.show_in_calendar ?? 1, b.max_leave_per_year ?? 20).run();
    return json({ data: { id: r.meta.last_row_id }, message: 'เพิ่มสำเร็จ' }, 201);
  }
  if (pathname.match(/^\/api\/employees\/\d+$/) && method === 'PUT') {
    if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    const id = pathname.split('/').pop(), b = await getBody();
    const al = ['name','nickname','email','role','department','default_shift','shift_start','shift_end',
                'default_off_day','avatar','phone','line_id','show_in_calendar','max_leave_per_year','is_active'];
    const f = [], v = [];
    for (const [k, val] of Object.entries(b)) { if (al.includes(k)) { f.push(`${k}=?`); v.push(val); } }
    if (!f.length) return json({ error: 'ไม่มีข้อมูล' }, 400);
    f.push("updated_at=datetime('now')"); v.push(id);
    await DB.prepare(`UPDATE employees SET ${f.join(',')} WHERE id=?`).bind(...v).run();
    return json({ message: 'แก้ไขสำเร็จ' });
  }
  if (pathname.match(/^\/api\/employees\/\d+$/) && method === 'DELETE') {
    if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    await DB.prepare("UPDATE employees SET is_active=0,updated_at=datetime('now') WHERE id=?").bind(pathname.split('/').pop()).run();
    return json({ message: 'ลบสำเร็จ' });
  }

  // SHIFTS
  if (pathname === '/api/shifts' && method === 'POST') {
    const b = await getBody();
    await DB.prepare(`INSERT INTO shifts (employee_id,date,shift_type,note,created_by) VALUES (?,?,?,?,?)
       ON CONFLICT(employee_id,date) DO UPDATE SET shift_type=excluded.shift_type,note=excluded.note,created_by=excluded.created_by,updated_at=datetime('now')`)
      .bind(b.employee_id, b.date, b.shift_type, b.note || null, currentUser.employee_id).run();
    return json({ message: 'บันทึกกะสำเร็จ' });
  }

  // LEAVES
  if (pathname === '/api/leaves' && method === 'GET') {
    const mo = url.searchParams.get('month'), ei = url.searchParams.get('employee_id'),
          st = url.searchParams.get('status'), yr = url.searchParams.get('year');
    let q = 'SELECT l.*,e.name as employee_name,e.avatar,e.nickname FROM leaves l JOIN employees e ON l.employee_id=e.id WHERE 1=1';
    const p = [];
    if (mo) { q += " AND l.date LIKE ?"; p.push(`${mo}%`); }
    if (ei) { q += " AND l.employee_id=?"; p.push(ei); }
    if (st) { q += " AND l.status=?"; p.push(st); }
    if (yr) { q += " AND l.date LIKE ?"; p.push(`${yr}%`); }
    q += ' ORDER BY l.date DESC';
    const { results } = p.length ? await DB.prepare(q).bind(...p).all() : await DB.prepare(q).all();
    return json({ data: results });
  }
  if (pathname === '/api/leaves' && method === 'POST') {
    const b = await getBody();
    const yr = b.date.substring(0, 4);
    // ลาป่วยไม่จำกัด, ลากิจ+ลาพักร้อน รวมกัน ≤ 20
    if (b.leave_type !== 'sick') {
      const q = await getQuotaLeaveUsed(DB, b.employee_id, yr);
      const emp = await DB.prepare('SELECT max_leave_per_year FROM employees WHERE id=?').bind(b.employee_id).first();
      const max = emp?.max_leave_per_year || 20;
      if (q >= max) return json({ error: `โควต้าลากิจ+ลาพักร้อนเต็มแล้ว (${q}/${max} วัน)` }, 400);
    }
    await DB.prepare(`INSERT INTO leaves (employee_id,date,leave_type,reason,status) VALUES (?,?,?,?,'pending')
       ON CONFLICT(employee_id,date) DO UPDATE SET leave_type=excluded.leave_type,reason=excluded.reason,status='pending',updated_at=datetime('now')`)
      .bind(b.employee_id, b.date, b.leave_type, b.reason || null).run();
    return json({ message: 'บันทึกสำเร็จ' }, 201);
  }
  if (pathname === '/api/leaves/range' && method === 'POST') {
    const b = await getBody();
    const dates = dateRange(b.start_date, b.end_date), yr = b.start_date.substring(0, 4);
    // ลาป่วยไม่จำกัด, ลากิจ+ลาพักร้อน รวมกัน ≤ 20
    if (b.leave_type !== 'sick') {
      const q = await getQuotaLeaveUsed(DB, b.employee_id, yr);
      const emp = await DB.prepare('SELECT max_leave_per_year FROM employees WHERE id=?').bind(b.employee_id).first();
      const max = emp?.max_leave_per_year || 20;
      if (q + dates.length > max) return json({ error: `โควต้าไม่พอ (เหลือ ${max - q} วัน, ขอ ${dates.length} วัน)` }, 400);
    }
    const stmt = DB.prepare(`INSERT INTO leaves (employee_id,date,leave_type,reason,status) VALUES (?,?,?,?,'pending')
       ON CONFLICT(employee_id,date) DO UPDATE SET leave_type=excluded.leave_type,reason=excluded.reason,status='pending',updated_at=datetime('now')`);
    await DB.batch(dates.map(d => stmt.bind(b.employee_id, d, b.leave_type, b.reason || null)));
    return json({ message: `บันทึก ${dates.length} วันสำเร็จ` }, 201);
  }
  if (pathname.match(/^\/api\/leaves\/\d+\/approve$/) && method === 'PUT') {
    if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    await DB.prepare("UPDATE leaves SET status='approved',approved_by=?,approved_at=datetime('now'),updated_at=datetime('now') WHERE id=?")
      .bind(currentUser.employee_id, pathname.split('/')[3]).run();
    return json({ message: 'อนุมัติสำเร็จ' });
  }
  if (pathname.match(/^\/api\/leaves\/\d+\/reject$/) && method === 'PUT') {
    if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    await DB.prepare("UPDATE leaves SET status='rejected',approved_by=?,approved_at=datetime('now'),updated_at=datetime('now') WHERE id=?")
      .bind(currentUser.employee_id, pathname.split('/')[3]).run();
    return json({ message: 'ปฏิเสธสำเร็จ' });
  }
  if (pathname.match(/^\/api\/leaves\/\d+$/) && method === 'DELETE') {
    await DB.prepare('DELETE FROM leaves WHERE id=?').bind(pathname.split('/').pop()).run();
    return json({ message: 'ยกเลิกสำเร็จ' });
  }

  // LEAVE QUOTA
  if (pathname === '/api/leave-quota' && method === 'GET') {
    const ei = url.searchParams.get('employee_id'), yr = url.searchParams.get('year') || String(new Date().getFullYear());
    if (!ei) return json({ error: 'ต้องระบุ employee_id' }, 400);
    const emp = await DB.prepare('SELECT max_leave_per_year FROM employees WHERE id=?').bind(ei).first();
    const max = emp?.max_leave_per_year || 20;
    const total = await getTotalLeaveUsed(DB, ei, yr);
    const { results } = await DB.prepare("SELECT leave_type, COUNT(*) as c FROM leaves WHERE employee_id=? AND date LIKE ? AND status!='rejected' GROUP BY leave_type").bind(ei, `${yr}%`).all();
    const byType = {}; results.forEach(r => { byType[r.leave_type] = r.c; });
    return json({ data: { max, used: total, remaining: max - total, byType } });
  }

  // SWAPS
  if (pathname === '/api/swaps' && method === 'GET') {
    const st = url.searchParams.get('status');
    let q = `SELECT sr.*,e1.name as from_name,e1.avatar as from_avatar,e1.nickname as from_nickname,
      e2.name as to_name,e2.avatar as to_avatar,e2.nickname as to_nickname
      FROM swap_requests sr JOIN employees e1 ON sr.from_employee_id=e1.id JOIN employees e2 ON sr.to_employee_id=e2.id`;
    const p = [];
    if (st) { q += ' WHERE sr.status=?'; p.push(st); }
    q += ' ORDER BY sr.created_at DESC';
    const { results } = p.length ? await DB.prepare(q).bind(...p).all() : await DB.prepare(q).all();
    return json({ data: results });
  }
  if (pathname === '/api/swaps' && method === 'POST') {
    const b = await getBody();
    const fs = await DB.prepare('SELECT shift_type FROM shifts WHERE employee_id=? AND date=?').bind(b.from_employee_id, b.date).first();
    const ts = await DB.prepare('SELECT shift_type FROM shifts WHERE employee_id=? AND date=?').bind(b.to_employee_id, b.date).first();
    await DB.prepare('INSERT INTO swap_requests (date,from_employee_id,to_employee_id,from_shift,to_shift,reason) VALUES (?,?,?,?,?,?)')
      .bind(b.date, b.from_employee_id, b.to_employee_id, fs?.shift_type || 'day', ts?.shift_type || 'day', b.reason || null).run();
    return json({ message: 'ส่งคำขอสำเร็จ' }, 201);
  }
  if (pathname.match(/^\/api\/swaps\/\d+\/approve$/) && method === 'PUT') {
    if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    const id = pathname.split('/')[3];
    const sw = await DB.prepare('SELECT * FROM swap_requests WHERE id=?').bind(id).first();
    if (!sw) return json({ error: 'ไม่พบ' }, 404);
    await DB.batch([
      DB.prepare(`INSERT INTO shifts (employee_id,date,shift_type) VALUES (?,?,?) ON CONFLICT(employee_id,date) DO UPDATE SET shift_type=excluded.shift_type,updated_at=datetime('now')`)
        .bind(sw.from_employee_id, sw.date, sw.to_shift),
      DB.prepare(`INSERT INTO shifts (employee_id,date,shift_type) VALUES (?,?,?) ON CONFLICT(employee_id,date) DO UPDATE SET shift_type=excluded.shift_type,updated_at=datetime('now')`)
        .bind(sw.to_employee_id, sw.date, sw.from_shift),
      DB.prepare("UPDATE swap_requests SET status='approved',approved_by=?,approved_at=datetime('now') WHERE id=?").bind(currentUser.employee_id, id),
    ]);
    return json({ message: 'อนุมัติสำเร็จ' });
  }
  if (pathname.match(/^\/api\/swaps\/\d+\/reject$/) && method === 'PUT') {
    if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    await DB.prepare("UPDATE swap_requests SET status='rejected',approved_by=?,approved_at=datetime('now') WHERE id=?")
      .bind(currentUser.employee_id, pathname.split('/')[3]).run();
    return json({ message: 'ปฏิเสธสำเร็จ' });
  }

  // HOLIDAYS
  if (pathname === '/api/holidays' && method === 'GET') {
    const yr = url.searchParams.get('year') || String(new Date().getFullYear());
    const { results } = await DB.prepare('SELECT * FROM holidays WHERE date LIKE ? ORDER BY date').bind(`${yr}%`).all();
    return json({ data: results });
  }
  if (pathname === '/api/holidays' && method === 'POST') {
    if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    const b = await getBody();
    await DB.prepare('INSERT OR REPLACE INTO holidays (date,name,type) VALUES (?,?,?)').bind(b.date, b.name, b.type || 'company').run();
    return json({ message: 'เพิ่มสำเร็จ' }, 201);
  }
  if (pathname.match(/^\/api\/holidays\/\d+$/) && method === 'DELETE') {
    if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    await DB.prepare('DELETE FROM holidays WHERE id=?').bind(pathname.split('/').pop()).run();
    return json({ message: 'ลบสำเร็จ' });
  }

  // OVERVIEW
  if (pathname === '/api/overview' && method === 'GET') {
    const mo = url.searchParams.get('month');
    if (!mo) return json({ error: 'ต้องระบุ month' }, 400);
    const yr = mo.split('-')[0];
    const [e, s, l, ho, st] = await Promise.all([
      DB.prepare('SELECT * FROM employees WHERE is_active=1 ORDER BY show_in_calendar DESC,role DESC,name').all(),
      DB.prepare('SELECT * FROM shifts WHERE date LIKE ?').bind(`${mo}%`).all(),
      DB.prepare("SELECT * FROM leaves WHERE date LIKE ? AND status!='rejected'").bind(`${mo}%`).all(),
      DB.prepare('SELECT * FROM holidays WHERE date LIKE ?').bind(`${mo}%`).all(),
      DB.prepare('SELECT * FROM settings').all(),
    ]);
    // Also get yearly leave totals per employee
    const yearlyLeaves = {};
    const { results: ylr } = await DB.prepare("SELECT employee_id, leave_type, COUNT(*) as c FROM leaves WHERE date LIKE ? AND status!='rejected' GROUP BY employee_id, leave_type").bind(`${yr}%`).all();
    ylr.forEach(r => {
      if (!yearlyLeaves[r.employee_id]) yearlyLeaves[r.employee_id] = {};
      yearlyLeaves[r.employee_id][r.leave_type] = r.c;
    });
    const settings = {}; st.results.forEach(r => { settings[r.key] = r.value; });
    return json({ data: { employees: e.results, shifts: s.results, leaves: l.results, holidays: ho.results, settings, yearlyLeaves } });
  }

  return json({ error: 'Not found' }, 404);
}

async function getQuotaLeaveUsed(DB, empId, year) {
  // นับเฉพาะ ลากิจ+ลาพักร้อน ที่นับรวมลิมิต 20 วัน (ลาป่วยไม่จำกัด)
  const r = await DB.prepare("SELECT COUNT(*) as c FROM leaves WHERE employee_id=? AND date LIKE ? AND status!='rejected' AND leave_type IN ('personal','vacation')").bind(empId, `${year}%`).first();
  return r?.c || 0;
}
function dateRange(s, e) { const d = [], c = new Date(s), ed = new Date(e); while (c <= ed) { d.push(c.toISOString().split('T')[0]); c.setDate(c.getDate() + 1); } return d; }
