// =============================================
// API Routes Handler
// =============================================

export async function handleAPI(request, env, url) {
  const { pathname } = url;
  const method = request.method;
  const DB = env.DB;

  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  const getBody = async () => {
    try { return await request.json(); }
    catch { return {}; }
  };

  // ==================== EMPLOYEES ====================
  if (pathname === '/api/employees' && method === 'GET') {
    const { results } = await DB.prepare(
      'SELECT * FROM employees WHERE is_active = 1 ORDER BY role DESC, name'
    ).all();
    return json({ data: results });
  }

  if (pathname === '/api/employees' && method === 'POST') {
    const body = await getBody();
    const { name, nickname, role, department, default_shift, avatar, phone, line_id } = body;
    const result = await DB.prepare(
      `INSERT INTO employees (name, nickname, role, department, default_shift, avatar, phone, line_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(name, nickname || null, role || 'staff', department || 'general',
           default_shift || 'morning', avatar || '👤', phone || null, line_id || null).run();

    await logActivity(DB, 'employee_add', `เพิ่มพนักงาน: ${name}`, result.meta.last_row_id);
    return json({ data: { id: result.meta.last_row_id }, message: 'เพิ่มพนักงานสำเร็จ' }, 201);
  }

  if (pathname.match(/^\/api\/employees\/\d+$/) && method === 'PUT') {
    const id = pathname.split('/').pop();
    const body = await getBody();
    const fields = [];
    const values = [];
    for (const [key, val] of Object.entries(body)) {
      if (['name','nickname','role','department','default_shift','avatar','phone','line_id',
           'max_sick_leave','max_personal_leave','max_vacation_leave','max_maternity_leave','is_active'].includes(key)) {
        fields.push(`${key} = ?`);
        values.push(val);
      }
    }
    if (fields.length === 0) return json({ error: 'ไม่มีข้อมูลที่ต้องแก้ไข' }, 400);
    fields.push("updated_at = datetime('now')");
    values.push(id);
    await DB.prepare(`UPDATE employees SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run();
    await logActivity(DB, 'employee_update', `แก้ไขพนักงาน ID: ${id}`, id);
    return json({ message: 'แก้ไขสำเร็จ' });
  }

  if (pathname.match(/^\/api\/employees\/\d+$/) && method === 'DELETE') {
    const id = pathname.split('/').pop();
    await DB.prepare("UPDATE employees SET is_active = 0, updated_at = datetime('now') WHERE id = ?").bind(id).run();
    await logActivity(DB, 'employee_delete', `ลบพนักงาน ID: ${id}`, id);
    return json({ message: 'ลบสำเร็จ' });
  }

  // ==================== SHIFTS ====================
  if (pathname === '/api/shifts' && method === 'GET') {
    const month = url.searchParams.get('month'); // YYYY-MM
    const employeeId = url.searchParams.get('employee_id');
    let query = 'SELECT s.*, e.name as employee_name, e.avatar FROM shifts s JOIN employees e ON s.employee_id = e.id WHERE 1=1';
    const params = [];

    if (month) {
      query += " AND s.date LIKE ?";
      params.push(`${month}%`);
    }
    if (employeeId) {
      query += " AND s.employee_id = ?";
      params.push(employeeId);
    }
    query += ' ORDER BY s.date, s.employee_id';

    const stmt = DB.prepare(query);
    const { results } = params.length ? await stmt.bind(...params).all() : await stmt.all();
    return json({ data: results });
  }

  if (pathname === '/api/shifts' && method === 'POST') {
    const body = await getBody();
    const { employee_id, date, shift_type, note } = body;

    await DB.prepare(
      `INSERT INTO shifts (employee_id, date, shift_type, note)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(employee_id, date) DO UPDATE SET
         shift_type = excluded.shift_type,
         note = excluded.note,
         updated_at = datetime('now')`
    ).bind(employee_id, date, shift_type, note || null).run();

    await logActivity(DB, 'shift_change', `เปลี่ยนกะ: ${date} → ${shift_type}`, employee_id);
    return json({ message: 'บันทึกกะสำเร็จ' });
  }

  // Bulk set shifts (for generating a whole month)
  if (pathname === '/api/shifts/bulk' && method === 'POST') {
    const body = await getBody();
    const { shifts: shiftList } = body; // [{employee_id, date, shift_type}]
    if (!shiftList || !Array.isArray(shiftList)) return json({ error: 'ต้องส่ง shifts array' }, 400);

    const stmt = DB.prepare(
      `INSERT INTO shifts (employee_id, date, shift_type)
       VALUES (?, ?, ?)
       ON CONFLICT(employee_id, date) DO UPDATE SET
         shift_type = excluded.shift_type,
         updated_at = datetime('now')`
    );

    const batch = shiftList.map(s => stmt.bind(s.employee_id, s.date, s.shift_type));
    await DB.batch(batch);

    await logActivity(DB, 'shift_bulk', `บันทึกกะทั้งหมด ${shiftList.length} รายการ`);
    return json({ message: `บันทึก ${shiftList.length} กะสำเร็จ` });
  }

  // ==================== LEAVES ====================
  if (pathname === '/api/leaves' && method === 'GET') {
    const month = url.searchParams.get('month');
    const employeeId = url.searchParams.get('employee_id');
    const status = url.searchParams.get('status');
    const year = url.searchParams.get('year');

    let query = 'SELECT l.*, e.name as employee_name, e.avatar FROM leaves l JOIN employees e ON l.employee_id = e.id WHERE 1=1';
    const params = [];

    if (month) { query += " AND l.date LIKE ?"; params.push(`${month}%`); }
    if (employeeId) { query += " AND l.employee_id = ?"; params.push(employeeId); }
    if (status) { query += " AND l.status = ?"; params.push(status); }
    if (year) { query += " AND l.date LIKE ?"; params.push(`${year}%`); }
    query += ' ORDER BY l.date DESC';

    const stmt = DB.prepare(query);
    const { results } = params.length ? await stmt.bind(...params).all() : await stmt.all();
    return json({ data: results });
  }

  if (pathname === '/api/leaves' && method === 'POST') {
    const body = await getBody();
    const { employee_id, date, leave_type, reason } = body;

    // Check leave quota
    const year = date.substring(0, 4);
    const quota = await getLeaveQuota(DB, employee_id, leave_type, year);
    if (quota.used >= quota.max) {
      return json({ error: `วันลา${getLeaveLabel(leave_type)}ใช้หมดแล้ว (${quota.used}/${quota.max} วัน)` }, 400);
    }

    await DB.prepare(
      `INSERT INTO leaves (employee_id, date, leave_type, reason, status)
       VALUES (?, ?, ?, ?, 'pending')
       ON CONFLICT(employee_id, date) DO UPDATE SET
         leave_type = excluded.leave_type,
         reason = excluded.reason,
         status = 'pending',
         updated_at = datetime('now')`
    ).bind(employee_id, date, leave_type, reason || null).run();

    await logActivity(DB, 'leave_request', `ขอลา${getLeaveLabel(leave_type)}: ${date}`, employee_id);
    return json({ message: 'บันทึกวันลาสำเร็จ' }, 201);
  }

  // Multi-day leave
  if (pathname === '/api/leaves/range' && method === 'POST') {
    const body = await getBody();
    const { employee_id, start_date, end_date, leave_type, reason } = body;

    const dates = getDateRange(start_date, end_date);

    const year = start_date.substring(0, 4);
    const quota = await getLeaveQuota(DB, employee_id, leave_type, year);
    if (quota.used + dates.length > quota.max) {
      return json({
        error: `วันลา${getLeaveLabel(leave_type)}ไม่พอ (เหลือ ${quota.max - quota.used} วัน, ขอ ${dates.length} วัน)`
      }, 400);
    }

    const stmt = DB.prepare(
      `INSERT INTO leaves (employee_id, date, leave_type, reason, status)
       VALUES (?, ?, ?, ?, 'pending')
       ON CONFLICT(employee_id, date) DO UPDATE SET
         leave_type = excluded.leave_type,
         reason = excluded.reason,
         status = 'pending',
         updated_at = datetime('now')`
    );

    const batch = dates.map(d => stmt.bind(employee_id, d, leave_type, reason || null));
    await DB.batch(batch);

    await logActivity(DB, 'leave_range', `ขอลา${getLeaveLabel(leave_type)}: ${start_date} ถึง ${end_date} (${dates.length} วัน)`, employee_id);
    return json({ message: `บันทึกวันลา ${dates.length} วันสำเร็จ` }, 201);
  }

  if (pathname.match(/^\/api\/leaves\/\d+\/approve$/) && method === 'PUT') {
    const id = pathname.split('/')[3];
    const body = await getBody();
    await DB.prepare(
      `UPDATE leaves SET status = 'approved', approved_by = ?, approved_at = datetime('now'),
       updated_at = datetime('now') WHERE id = ?`
    ).bind(body.approved_by || null, id).run();
    await logActivity(DB, 'leave_approve', `อนุมัติวันลา ID: ${id}`, null, body.approved_by);
    return json({ message: 'อนุมัติสำเร็จ' });
  }

  if (pathname.match(/^\/api\/leaves\/\d+\/reject$/) && method === 'PUT') {
    const id = pathname.split('/')[3];
    const body = await getBody();
    await DB.prepare(
      `UPDATE leaves SET status = 'rejected', approved_by = ?, approved_at = datetime('now'),
       updated_at = datetime('now') WHERE id = ?`
    ).bind(body.approved_by || null, id).run();
    await logActivity(DB, 'leave_reject', `ปฏิเสธวันลา ID: ${id}`, null, body.approved_by);
    return json({ message: 'ปฏิเสธสำเร็จ' });
  }

  if (pathname.match(/^\/api\/leaves\/\d+$/) && method === 'DELETE') {
    const id = pathname.split('/').pop();
    await DB.prepare('DELETE FROM leaves WHERE id = ?').bind(id).run();
    await logActivity(DB, 'leave_cancel', `ยกเลิกวันลา ID: ${id}`);
    return json({ message: 'ยกเลิกวันลาสำเร็จ' });
  }

  // ==================== LEAVE QUOTA ====================
  if (pathname === '/api/leave-quota' && method === 'GET') {
    const employeeId = url.searchParams.get('employee_id');
    const year = url.searchParams.get('year') || new Date().getFullYear().toString();

    if (!employeeId) return json({ error: 'ต้องระบุ employee_id' }, 400);

    const quotas = {};
    for (const type of ['sick', 'personal', 'vacation', 'maternity']) {
      quotas[type] = await getLeaveQuota(DB, employeeId, type, year);
    }
    return json({ data: quotas });
  }

  // ==================== SWAP REQUESTS ====================
  if (pathname === '/api/swaps' && method === 'GET') {
    const status = url.searchParams.get('status');
    let query = `SELECT sr.*,
      e1.name as from_name, e1.avatar as from_avatar,
      e2.name as to_name, e2.avatar as to_avatar
      FROM swap_requests sr
      JOIN employees e1 ON sr.from_employee_id = e1.id
      JOIN employees e2 ON sr.to_employee_id = e2.id`;
    const params = [];
    if (status) { query += ' WHERE sr.status = ?'; params.push(status); }
    query += ' ORDER BY sr.created_at DESC';

    const stmt = DB.prepare(query);
    const { results } = params.length ? await stmt.bind(...params).all() : await stmt.all();
    return json({ data: results });
  }

  if (pathname === '/api/swaps' && method === 'POST') {
    const body = await getBody();
    const { date, from_employee_id, to_employee_id, reason } = body;

    // Get current shifts
    const fromShift = await DB.prepare(
      'SELECT shift_type FROM shifts WHERE employee_id = ? AND date = ?'
    ).bind(from_employee_id, date).first();
    const toShift = await DB.prepare(
      'SELECT shift_type FROM shifts WHERE employee_id = ? AND date = ?'
    ).bind(to_employee_id, date).first();

    const result = await DB.prepare(
      `INSERT INTO swap_requests (date, from_employee_id, to_employee_id, from_shift, to_shift, reason)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(date, from_employee_id, to_employee_id,
           fromShift?.shift_type || 'morning', toShift?.shift_type || 'morning',
           reason || null).run();

    await logActivity(DB, 'swap_request', `ขอสลับกะ: ${date}`, from_employee_id);
    return json({ data: { id: result.meta.last_row_id }, message: 'ส่งคำขอสลับกะสำเร็จ' }, 201);
  }

  if (pathname.match(/^\/api\/swaps\/\d+\/approve$/) && method === 'PUT') {
    const id = pathname.split('/')[3];
    const body = await getBody();

    // Get swap details
    const swap = await DB.prepare('SELECT * FROM swap_requests WHERE id = ?').bind(id).first();
    if (!swap) return json({ error: 'ไม่พบคำขอสลับกะ' }, 404);

    // Execute the swap
    await DB.batch([
      DB.prepare(
        `INSERT INTO shifts (employee_id, date, shift_type)
         VALUES (?, ?, ?)
         ON CONFLICT(employee_id, date) DO UPDATE SET shift_type = excluded.shift_type, updated_at = datetime('now')`
      ).bind(swap.from_employee_id, swap.date, swap.to_shift),
      DB.prepare(
        `INSERT INTO shifts (employee_id, date, shift_type)
         VALUES (?, ?, ?)
         ON CONFLICT(employee_id, date) DO UPDATE SET shift_type = excluded.shift_type, updated_at = datetime('now')`
      ).bind(swap.to_employee_id, swap.date, swap.from_shift),
      DB.prepare(
        `UPDATE swap_requests SET status = 'approved', approved_by = ?, approved_at = datetime('now') WHERE id = ?`
      ).bind(body.approved_by || null, id),
    ]);

    await logActivity(DB, 'swap_approve', `อนุมัติสลับกะ ID: ${id}`, null, body.approved_by);
    return json({ message: 'อนุมัติสลับกะสำเร็จ' });
  }

  if (pathname.match(/^\/api\/swaps\/\d+\/reject$/) && method === 'PUT') {
    const id = pathname.split('/')[3];
    const body = await getBody();
    await DB.prepare(
      `UPDATE swap_requests SET status = 'rejected', approved_by = ?, approved_at = datetime('now') WHERE id = ?`
    ).bind(body.approved_by || null, id).run();
    await logActivity(DB, 'swap_reject', `ปฏิเสธสลับกะ ID: ${id}`, null, body.approved_by);
    return json({ message: 'ปฏิเสธสำเร็จ' });
  }

  // ==================== HOLIDAYS ====================
  if (pathname === '/api/holidays' && method === 'GET') {
    const year = url.searchParams.get('year') || new Date().getFullYear().toString();
    const { results } = await DB.prepare(
      'SELECT * FROM holidays WHERE date LIKE ? ORDER BY date'
    ).bind(`${year}%`).all();
    return json({ data: results });
  }

  if (pathname === '/api/holidays' && method === 'POST') {
    const body = await getBody();
    await DB.prepare(
      'INSERT OR REPLACE INTO holidays (date, name, type) VALUES (?, ?, ?)'
    ).bind(body.date, body.name, body.type || 'company').run();
    return json({ message: 'เพิ่มวันหยุดสำเร็จ' }, 201);
  }

  if (pathname.match(/^\/api\/holidays\/\d+$/) && method === 'DELETE') {
    const id = pathname.split('/').pop();
    await DB.prepare('DELETE FROM holidays WHERE id = ?').bind(id).run();
    return json({ message: 'ลบวันหยุดสำเร็จ' });
  }

  // ==================== DASHBOARD / STATS ====================
  if (pathname === '/api/dashboard' && method === 'GET') {
    const month = url.searchParams.get('month'); // YYYY-MM
    const today = new Date().toISOString().split('T')[0];

    // Today's shifts
    const todayShifts = await DB.prepare(
      `SELECT s.*, e.name, e.avatar, e.nickname FROM shifts s
       JOIN employees e ON s.employee_id = e.id WHERE s.date = ? AND e.is_active = 1`
    ).bind(today).all();

    // Today's leaves
    const todayLeaves = await DB.prepare(
      `SELECT l.*, e.name, e.avatar, e.nickname FROM leaves l
       JOIN employees e ON l.employee_id = e.id WHERE l.date = ? AND l.status != 'rejected' AND e.is_active = 1`
    ).bind(today).all();

    // Pending requests
    const pendingLeaves = await DB.prepare(
      `SELECT COUNT(*) as count FROM leaves WHERE status = 'pending'`
    ).first();
    const pendingSwaps = await DB.prepare(
      `SELECT COUNT(*) as count FROM swap_requests WHERE status = 'pending'`
    ).first();

    // Employee count
    const empCount = await DB.prepare(
      'SELECT COUNT(*) as count FROM employees WHERE is_active = 1'
    ).first();

    return json({
      data: {
        today: today,
        today_shifts: todayShifts.results,
        today_leaves: todayLeaves.results,
        pending_leaves: pendingLeaves.count,
        pending_swaps: pendingSwaps.count,
        total_employees: empCount.count,
      }
    });
  }

  // ==================== MONTHLY OVERVIEW ====================
  if (pathname === '/api/overview' && method === 'GET') {
    const month = url.searchParams.get('month'); // YYYY-MM (required)
    if (!month) return json({ error: 'ต้องระบุ month (YYYY-MM)' }, 400);

    const [employees_r, shifts_r, leaves_r, holidays_r] = await Promise.all([
      DB.prepare('SELECT * FROM employees WHERE is_active = 1 ORDER BY role DESC, name').all(),
      DB.prepare('SELECT * FROM shifts WHERE date LIKE ? ORDER BY date').bind(`${month}%`).all(),
      DB.prepare("SELECT * FROM leaves WHERE date LIKE ? AND status != 'rejected' ORDER BY date").bind(`${month}%`).all(),
      DB.prepare('SELECT * FROM holidays WHERE date LIKE ? ORDER BY date').bind(`${month}%`).all(),
    ]);

    return json({
      data: {
        employees: employees_r.results,
        shifts: shifts_r.results,
        leaves: leaves_r.results,
        holidays: holidays_r.results,
      }
    });
  }

  // ==================== ACTIVITY LOGS ====================
  if (pathname === '/api/logs' && method === 'GET') {
    const limit = url.searchParams.get('limit') || 50;
    const { results } = await DB.prepare(
      `SELECT al.*, e.name as employee_name FROM activity_logs al
       LEFT JOIN employees e ON al.employee_id = e.id
       ORDER BY al.created_at DESC LIMIT ?`
    ).bind(limit).all();
    return json({ data: results });
  }

  // ==================== INIT DB ====================
  if (pathname === '/api/init' && method === 'POST') {
    // This endpoint is for first-time setup
    // Schema should be applied via wrangler d1 execute
    return json({ message: 'ใช้ wrangler d1 execute เพื่อ init database', hint: 'wrangler d1 execute shift-manager-db --file=schema.sql' });
  }

  return json({ error: 'Not found' }, 404);
}

// ==================== Helpers ====================

async function getLeaveQuota(DB, employeeId, leaveType, year) {
  const maxField = `max_${leaveType}_leave`;
  const emp = await DB.prepare(`SELECT ${maxField} FROM employees WHERE id = ?`).bind(employeeId).first();
  const used = await DB.prepare(
    `SELECT COUNT(*) as count FROM leaves
     WHERE employee_id = ? AND leave_type = ? AND date LIKE ? AND status != 'rejected'`
  ).bind(employeeId, leaveType, `${year}%`).first();

  return {
    type: leaveType,
    max: emp?.[maxField] || 0,
    used: used?.count || 0,
    remaining: (emp?.[maxField] || 0) - (used?.count || 0),
  };
}

function getLeaveLabel(type) {
  const labels = { sick: 'ป่วย', personal: 'กิจ', vacation: 'พักร้อน', maternity: 'คลอด' };
  return labels[type] || type;
}

function getDateRange(start, end) {
  const dates = [];
  const current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

async function logActivity(DB, action, description, employeeId = null, performedBy = null, metadata = null) {
  await DB.prepare(
    `INSERT INTO activity_logs (action, description, employee_id, performed_by, metadata)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(action, description, employeeId, performedBy, metadata ? JSON.stringify(metadata) : null).run();
}
