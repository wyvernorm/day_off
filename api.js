// =============================================
// API v7 - swap rules, leave rules, swap_count
// =============================================

export async function handleAPI(request, env, url, currentUser) {
  const { pathname } = url;
  const method = request.method;
  const DB = env.DB;
  const isO = currentUser.role === 'admin' || currentUser.role === 'owner';
  const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'Content-Type': 'application/json' } });
  const getBody = async () => { try { return await request.json(); } catch { return {}; } };

  // Initialize Telegram env
  setTgEnv(env);

  // ==================== ME ====================
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

  // ==================== SETTINGS ====================
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

  // ==================== EMPLOYEES ====================
  if (pathname === '/api/employees' && method === 'GET') {
    const { results } = await DB.prepare('SELECT * FROM employees WHERE is_active=1 ORDER BY show_in_calendar DESC,role DESC,name').all();
    return json({ data: results });
  }
  if (pathname === '/api/employees' && method === 'POST') {
    if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    const b = await getBody();
    // เช็ค email ซ้ำ
    if (b.email) {
      const existing = await DB.prepare('SELECT id, is_active FROM employees WHERE email=?').bind(b.email).first();
      if (existing) {
        if (existing.is_active === 0) {
          // เปิดใช้งานอีกครั้ง
          await DB.prepare("UPDATE employees SET is_active=1, name=?, nickname=?, default_shift=?, shift_start=?, shift_end=?, default_off_day=?, updated_at=datetime('now') WHERE id=?")
            .bind(b.name, b.nickname || b.name, b.default_shift || 'day', b.shift_start || '09:00', b.shift_end || '17:00', b.default_off_day ?? '6', existing.id).run();
          return json({ data: { id: existing.id }, message: 'เปิดใช้งานพนักงานอีกครั้งสำเร็จ' }, 201);
        }
        return json({ error: 'อีเมลนี้มีในระบบแล้ว' }, 400);
      }
    }
    const r = await DB.prepare(
      `INSERT INTO employees (name,nickname,email,role,default_shift,shift_start,shift_end,default_off_day,avatar,show_in_calendar,max_leave_per_year) VALUES (?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(b.name, b.nickname || null, b.email || null, b.role || 'staff', b.default_shift || 'day',
           b.shift_start || '09:00', b.shift_end || '17:00', b.default_off_day ?? '6', b.avatar || '👤',
           b.show_in_calendar ?? 1, b.max_leave_per_year ?? 20).run();
    return json({ data: { id: r.meta.last_row_id }, message: 'เพิ่มสำเร็จ' }, 201);
  }
  if (pathname.match(/^\/api\/employees\/\d+$/) && method === 'PUT') {
    const id = pathname.split('/').pop(), b = await getBody();
    const isSelf = String(currentUser.employee_id) === String(id);
    // ตัวเองแก้ได้เฉพาะ phone, line_id
    const selfFields = ['phone','line_id'];
    if (!isO && !isSelf) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    const al = isO ? ['name','nickname','email','role','department','default_shift','shift_start','shift_end',
                'default_off_day','avatar','phone','line_id','show_in_calendar','max_leave_per_year','is_active'] : selfFields;
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

  // ==================== SHIFTS ====================
  if (pathname === '/api/shifts' && method === 'POST') {
    const b = await getBody();
    await DB.prepare(`INSERT INTO shifts (employee_id,date,shift_type,note,created_by) VALUES (?,?,?,?,?)
       ON CONFLICT(employee_id,date) DO UPDATE SET shift_type=excluded.shift_type,note=excluded.note,created_by=excluded.created_by,updated_at=datetime('now')`)
      .bind(b.employee_id, b.date, b.shift_type, b.note || null, currentUser.employee_id).run();
    return json({ message: 'บันทึกกะสำเร็จ' });
  }

  // ==================== LEAVES ====================
  if (pathname === '/api/leaves' && method === 'GET') {
    const mo = url.searchParams.get('month'), ei = url.searchParams.get('employee_id'),
          st = url.searchParams.get('status'), yr = url.searchParams.get('year');
    const limit = Math.min(parseInt(url.searchParams.get('limit')) || 200, 500);
    const offset = parseInt(url.searchParams.get('offset')) || 0;
    let q = 'SELECT l.*,e.name as employee_name,e.avatar,e.nickname FROM leaves l JOIN employees e ON l.employee_id=e.id WHERE 1=1';
    const p = [];
    if (mo) { q += " AND l.date LIKE ?"; p.push(`${mo}%`); }
    if (ei) { q += " AND l.employee_id=?"; p.push(ei); }
    if (st) { q += " AND l.status=?"; p.push(st); }
    if (yr) { q += " AND l.date LIKE ?"; p.push(`${yr}%`); }
    q += ' ORDER BY l.date DESC LIMIT ? OFFSET ?';
    p.push(limit, offset);
    const { results } = await DB.prepare(q).bind(...p).all();
    return json({ data: results });
  }
  if (pathname === '/api/leaves' && method === 'POST') {
    const b = await getBody();
    // ตรวจสอบว่าวันที่ไม่ใช่วันหยุดของพนักงาน
    const empChk = await DB.prepare('SELECT default_off_day FROM employees WHERE id=?').bind(b.employee_id).first();
    if (empChk) {
      const empOffs = (empChk.default_off_day || '6').split(',').map(Number);
      const dow = new Date(b.date).getDay();
      if (empOffs.includes(dow)) return json({ error: 'วันนี้เป็นวันหยุดของคุณอยู่แล้ว ไม่ต้องลา' }, 400);
    }
    const yr = b.date.substring(0, 4);
    if (b.leave_type !== 'sick') {
      const q = await getQuotaLeaveUsed(DB, b.employee_id, yr);
      const emp = await DB.prepare('SELECT max_leave_per_year FROM employees WHERE id=?').bind(b.employee_id).first();
      const max = emp?.max_leave_per_year || 20;
      if (q >= max) return json({ error: `โควต้าลากิจ+ลาพักร้อนเต็มแล้ว (${q}/${max} วัน)` }, 400);
    }
    await DB.prepare(`INSERT INTO leaves (employee_id,date,leave_type,reason,status) VALUES (?,?,?,?,'pending')
       ON CONFLICT(employee_id,date) DO UPDATE SET leave_type=excluded.leave_type,reason=excluded.reason,status='pending',updated_at=datetime('now')`)
      .bind(b.employee_id, b.date, b.leave_type, b.reason || null).run();
    const LT = {sick:'ลาป่วย',personal:'ลากิจ',vacation:'ลาพักร้อน'};
    const empN = await DB.prepare('SELECT name,nickname FROM employees WHERE id=?').bind(b.employee_id).first();
    await tgSend(tgLeaveRequest(empN?.nickname||empN?.name, b.leave_type, b.date, null, 1, b.reason));
    return json({ message: 'บันทึกสำเร็จ' }, 201);
  }
  if (pathname === '/api/leaves/range' && method === 'POST') {
    const b = await getBody();
    const emp = await DB.prepare('SELECT * FROM employees WHERE id=?').bind(b.employee_id).first();
    if (!emp) return json({ error: 'ไม่พบพนักงาน' }, 404);
    const empOffs = (emp.default_off_day || '6').split(',').map(Number);

    // กรองเฉพาะวันทำงาน (ข้ามวันหยุดของพนักงาน)
    const allDates = dateRange(b.start_date, b.end_date);
    const workDates = allDates.filter(d => !empOffs.includes(new Date(d).getDay()));
    if (!workDates.length) return json({ error: 'ทุกวันที่เลือกเป็นวันหยุดของคุณ ไม่ต้องลา' }, 400);

    const yr = b.start_date.substring(0, 4);
    if (b.leave_type !== 'sick') {
      const q = await getQuotaLeaveUsed(DB, b.employee_id, yr);
      const max = emp?.max_leave_per_year || 20;
      if (q + workDates.length > max) return json({ error: `โควต้าไม่พอ (เหลือ ${max - q} วัน, ขอ ${workDates.length} วัน)` }, 400);
    }
    const stmt = DB.prepare(`INSERT INTO leaves (employee_id,date,leave_type,reason,status) VALUES (?,?,?,?,'pending')
       ON CONFLICT(employee_id,date) DO UPDATE SET leave_type=excluded.leave_type,reason=excluded.reason,status='pending',updated_at=datetime('now')`);
    await DB.batch(workDates.map(d => stmt.bind(b.employee_id, d, b.leave_type, b.reason || null)));
    const empN2 = await DB.prepare('SELECT name,nickname FROM employees WHERE id=?').bind(b.employee_id).first();
    const skipped = allDates.length - workDates.length;
    await tgSend(tgLeaveRequest(empN2?.nickname||empN2?.name, b.leave_type, b.start_date, b.end_date, workDates.length, b.reason ? b.reason + (skipped > 0 ? ' (ข้ามวันหยุด ' + skipped + ' วัน)' : '') : (skipped > 0 ? 'ข้ามวันหยุด ' + skipped + ' วัน' : null)));
    return json({ message: `บันทึก ${workDates.length} วันสำเร็จ${skipped > 0 ? ' (ข้ามวันหยุด ' + skipped + ' วัน)' : ''}` }, 201);
  }
  if (pathname.match(/^\/api\/leaves\/\d+\/approve$/) && method === 'PUT') {
    const leaveId = pathname.split('/')[3];
    const leave = await DB.prepare('SELECT l.*, e.email as requester_email FROM leaves l JOIN employees e ON l.employee_id=e.id WHERE l.id=?').bind(leaveId).first();
    if (!leave) return json({ error: 'ไม่พบรายการ' }, 404);
    // ลาป่วย: ตรวจสิทธิ์จาก settings (sick_approvers) แทน hardcode
    if (leave.leave_type === 'sick') {
      const approversSetting = await DB.prepare("SELECT value FROM settings WHERE key='sick_approvers'").first();
      const sickApprovers = approversSetting ? approversSetting.value.split(',').map(s => s.trim()) : [];
      // ถ้าไม่มี setting → ใช้ admin/owner ปกติ
      if (sickApprovers.length > 0) {
        if (!sickApprovers.includes(currentUser.email) && !isO) {
          return json({ error: 'เฉพาะผู้มีสิทธิ์เท่านั้นที่อนุมัติลาป่วยได้' }, 403);
        }
      } else if (!isO) {
        return json({ error: 'ไม่มีสิทธิ์' }, 403);
      }
    } else {
      if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    }
    await DB.prepare("UPDATE leaves SET status='approved',approved_by=?,approved_at=datetime('now'),updated_at=datetime('now') WHERE id=?")
      .bind(currentUser.employee_id, leaveId).run();
    const reqEmpA = await DB.prepare('SELECT name,nickname FROM employees WHERE id=?').bind(leave.employee_id).first();
    await tgSend(tgLeaveApproved(reqEmpA?.nickname||reqEmpA?.name, leave.leave_type, leave.date, currentUser.nickname||currentUser.name));
    return json({ message: 'อนุมัติสำเร็จ' });
  }
  if (pathname.match(/^\/api\/leaves\/\d+\/reject$/) && method === 'PUT') {
    const leaveId = pathname.split('/')[3];
    const leave = await DB.prepare('SELECT l.*, e.email as requester_email FROM leaves l JOIN employees e ON l.employee_id=e.id WHERE l.id=?').bind(leaveId).first();
    if (!leave) return json({ error: 'ไม่พบรายการ' }, 404);
    if (leave.leave_type === 'sick') {
      const approversSetting = await DB.prepare("SELECT value FROM settings WHERE key='sick_approvers'").first();
      const sickApprovers = approversSetting ? approversSetting.value.split(',').map(s => s.trim()) : [];
      if (sickApprovers.length > 0) {
        if (!sickApprovers.includes(currentUser.email) && !isO) {
          return json({ error: 'เฉพาะผู้มีสิทธิ์เท่านั้นที่ปฏิเสธลาป่วยได้' }, 403);
        }
      } else if (!isO) {
        return json({ error: 'ไม่มีสิทธิ์' }, 403);
      }
    } else {
      if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    }
    await DB.prepare("UPDATE leaves SET status='rejected',approved_by=?,approved_at=datetime('now'),updated_at=datetime('now') WHERE id=?")
      .bind(currentUser.employee_id, leaveId).run();
    const reqEmpR = await DB.prepare('SELECT name,nickname FROM employees WHERE id=?').bind(leave.employee_id).first();
    await tgSend(tgLeaveRejected(reqEmpR?.nickname||reqEmpR?.name, leave.leave_type, leave.date, currentUser.nickname||currentUser.name));
    return json({ message: 'ปฏิเสธสำเร็จ' });
  }
  if (pathname.match(/^\/api\/leaves\/\d+$/) && method === 'DELETE') {
    const leaveId = pathname.split('/').pop();
    const leave = await DB.prepare('SELECT * FROM leaves WHERE id=?').bind(leaveId).first();
    if (!leave) return json({ error: 'ไม่พบรายการ' }, 404);
    // เฉพาะเจ้าของวันลาหรือ admin/owner เท่านั้นที่ลบได้
    if (!isO && leave.employee_id !== currentUser.employee_id) {
      return json({ error: 'ไม่มีสิทธิ์ลบวันลาของคนอื่น' }, 403);
    }
    await DB.prepare('DELETE FROM leaves WHERE id=?').bind(leaveId).run();
    return json({ message: 'ยกเลิกสำเร็จ' });
  }

  // ==================== SWAPS ====================
  if (pathname === '/api/swaps' && method === 'GET') {
    const st = url.searchParams.get('status');
    let q = `SELECT sr.*,e1.name as from_name,e1.avatar as from_avatar,e1.nickname as from_nickname,COALESCE(e1.swap_count,0) as from_swap_count,
      e2.name as to_name,e2.avatar as to_avatar,e2.nickname as to_nickname,COALESCE(e2.swap_count,0) as to_swap_count
      FROM swap_requests sr JOIN employees e1 ON sr.from_employee_id=e1.id JOIN employees e2 ON sr.to_employee_id=e2.id`;
    const p = [];
    if (st) { q += ' WHERE sr.status=?'; p.push(st); }
    q += ' ORDER BY sr.created_at DESC';
    const { results } = p.length ? await DB.prepare(q).bind(...p).all() : await DB.prepare(q).all();
    return json({ data: results });
  }

  if (pathname === '/api/swaps' && method === 'POST') {
    const b = await getBody();

    // ดึงข้อมูลพนักงานทุกคน + กะในวันนั้น
    const allEmp = await DB.prepare('SELECT * FROM employees WHERE is_active=1 AND show_in_calendar=1').all();
    const allShifts = await DB.prepare('SELECT * FROM shifts WHERE date=?').bind(b.date).all();
    const shiftMap = {}; allShifts.results.forEach(s => { shiftMap[s.employee_id] = s.shift_type; });

    const dayOfWeek = new Date(b.date).getDay();
    function getShift(emp) {
      if (shiftMap[emp.id]) return shiftMap[emp.id];
      const offs = (emp.default_off_day || '6').split(',').map(Number);
      if (offs.includes(dayOfWeek)) return 'off';
      return emp.default_shift;
    }

    const fromEmp = allEmp.results.find(e => e.id === b.from_employee_id);
    const toEmp = allEmp.results.find(e => e.id === b.to_employee_id);
    if (!fromEmp || !toEmp) return json({ error: 'ไม่พบพนักงาน' }, 404);

    const fromShift = getShift(fromEmp);
    const toShift = getShift(toEmp);

    // จำลองหลังสลับ — ตรวจสอบว่าทุกช่วงเวลายังมีคนทำงาน
    const afterSwap = {};
    allEmp.results.forEach(emp => {
      if (emp.id === b.from_employee_id) afterSwap[emp.id] = toShift;
      else if (emp.id === b.to_employee_id) afterSwap[emp.id] = fromShift;
      else afterSwap[emp.id] = getShift(emp);
    });

    const origDay = allEmp.results.filter(e => getShift(e) === 'day').length;
    const origEvening = allEmp.results.filter(e => getShift(e) === 'evening').length;
    const newDay = Object.values(afterSwap).filter(s => s === 'day').length;
    const newEvening = Object.values(afterSwap).filter(s => s === 'evening').length;

    if (origDay > 0 && newDay === 0) return json({ error: 'ไม่สามารถสลับได้ — ต้องมีคนทำงานกะกลางวันอย่างน้อย 1 คน' }, 400);
    if (origEvening > 0 && newEvening === 0) return json({ error: 'ไม่สามารถสลับได้ — ต้องมีคนทำงานกะกลางคืนอย่างน้อย 1 คน' }, 400);

    await DB.prepare('INSERT INTO swap_requests (date,from_employee_id,to_employee_id,from_shift,to_shift,reason) VALUES (?,?,?,?,?,?)')
      .bind(b.date, b.from_employee_id, b.to_employee_id, fromShift, toShift, b.reason || null).run();

    // swap_count จะเพิ่มตอนอนุมัติเท่านั้น (ไม่นับตอนขอ)

    await tgSend(tgSwapRequest(fromEmp.nickname||fromEmp.name, toEmp.nickname||toEmp.name, b.date, b.reason, false, null));
    return json({ message: 'ส่งคำขอสำเร็จ — รอคู่สลับอนุมัติ' }, 201);
  }

  // สลับวันหยุด (dayoff swap) — เลือก 2 วัน สลับวันหยุดกับวันทำงาน
  if (pathname === '/api/swaps/dayoff' && method === 'POST') {
    const b = await getBody();
    // date1 = วันหยุดของคนขอ (จะมาทำงานแทน), date2 = วันหยุดของคู่สลับ (จะหยุดแทน)
    if (!b.date1 || !b.date2 || !b.from_employee_id || !b.to_employee_id)
      return json({ error: 'ข้อมูลไม่ครบ' }, 400);
    if (b.from_employee_id === b.to_employee_id)
      return json({ error: 'ต้องคนละคน' }, 400);

    const allEmp = await DB.prepare('SELECT * FROM employees WHERE is_active=1 AND show_in_calendar=1').all();
    const fromEmp = allEmp.results.find(e => e.id === b.from_employee_id);
    const toEmp = allEmp.results.find(e => e.id === b.to_employee_id);
    if (!fromEmp || !toEmp) return json({ error: 'ไม่พบพนักงาน' }, 404);

    // ตรวจสอบว่า date1 เป็นวันหยุดของผู้ขอ
    const d1ShiftRow = await DB.prepare('SELECT shift_type FROM shifts WHERE date=? AND employee_id=?').bind(b.date1, b.from_employee_id).first();
    const d1Dow = new Date(b.date1).getDay();
    const fromOffs = (fromEmp.default_off_day || '6').split(',').map(Number);
    const d1IsOff = d1ShiftRow ? d1ShiftRow.shift_type === 'off' : fromOffs.includes(d1Dow);
    if (!d1IsOff) return json({ error: 'วันที่ ' + b.date1 + ' ไม่ใช่วันหยุดของผู้ขอ ไม่สามารถสลับได้' }, 400);

    // ตรวจสอบว่า date2 ต้องเป็นวันหยุดของคู่สลับ
    const d2ShiftRow = await DB.prepare('SELECT shift_type FROM shifts WHERE date=? AND employee_id=?').bind(b.date2, b.to_employee_id).first();
    const d2Dow = new Date(b.date2).getDay();
    const toOffs = (toEmp.default_off_day || '6').split(',').map(Number);
    const d2IsOff = d2ShiftRow ? d2ShiftRow.shift_type === 'off' : toOffs.includes(d2Dow);
    if (!d2IsOff) return json({ error: 'วันที่ ' + b.date2 + ' ไม่ใช่วันหยุดของคู่สลับ — เลือกได้เฉพาะวันที่คู่สลับหยุดเท่านั้น' }, 400);

    // ดึงกะของทั้ง 2 วัน
    function getShiftForDate(emp, date, shiftsMap) {
      if (shiftsMap[emp.id]) return shiftsMap[emp.id];
      const dow = new Date(date).getDay();
      const offs = (emp.default_off_day || '6').split(',').map(Number);
      if (offs.includes(dow)) return 'off';
      return emp.default_shift;
    }

    // ตรวจสอบ coverage ทั้ง 2 วัน หลังสลับ
    for (const checkDate of [b.date1, b.date2]) {
      const shifts = await DB.prepare('SELECT * FROM shifts WHERE date=?').bind(checkDate).all();
      const sMap = {}; shifts.results.forEach(s => { sMap[s.employee_id] = s.shift_type; });

      const afterSwap = {};
      allEmp.results.forEach(emp => {
        const orig = getShiftForDate(emp, checkDate, sMap);
        if (emp.id === b.from_employee_id) {
          // date1: คนขอจะมาทำงาน (ทำแทนวันหยุดตัวเอง), date2: คนขอจะหยุด
          afterSwap[emp.id] = checkDate === b.date1 ? fromEmp.default_shift : 'off';
        } else if (emp.id === b.to_employee_id) {
          // date1: คู่สลับจะหยุด, date2: คู่สลับจะมาทำงาน (ทำแทนวันหยุดตัวเอง)
          afterSwap[emp.id] = checkDate === b.date1 ? 'off' : toEmp.default_shift;
        } else {
          afterSwap[emp.id] = orig;
        }
      });

      const origDay = allEmp.results.filter(e => getShiftForDate(e, checkDate, sMap) === 'day').length;
      const origEvening = allEmp.results.filter(e => getShiftForDate(e, checkDate, sMap) === 'evening').length;
      const newDay = Object.values(afterSwap).filter(s => s === 'day').length;
      const newEvening = Object.values(afterSwap).filter(s => s === 'evening').length;

      if (origDay > 0 && newDay === 0) return json({ error: 'ไม่สามารถสลับได้ — วันที่ ' + checkDate + ' ต้องมีคนกะกลางวันอย่างน้อย 1 คน' }, 400);
      if (origEvening > 0 && newEvening === 0) return json({ error: 'ไม่สามารถสลับได้ — วันที่ ' + checkDate + ' ต้องมีคนกะกลางคืนอย่างน้อย 1 คน' }, 400);
    }

    await DB.prepare('INSERT INTO swap_requests (date,date2,from_employee_id,to_employee_id,from_shift,to_shift,swap_type,reason) VALUES (?,?,?,?,?,?,?,?)')
      .bind(b.date1, b.date2, b.from_employee_id, b.to_employee_id, 'off', 'off', 'dayoff', b.reason || null).run();
    // swap_count จะเพิ่มตอนอนุมัติเท่านั้น

    await tgSend(tgSwapRequest(fromEmp.nickname||fromEmp.name, toEmp.nickname||toEmp.name, b.date1, b.reason, true, b.date2));
    return json({ message: 'ส่งคำขอสลับวันหยุดสำเร็จ — รอคู่สลับอนุมัติ' }, 201);
  }

  if (pathname.match(/^\/api\/swaps\/\d+\/approve$/) && method === 'PUT') {
    const id = pathname.split('/')[3];
    const sw = await DB.prepare('SELECT * FROM swap_requests WHERE id=?').bind(id).first();
    if (!sw) return json({ error: 'ไม่พบ' }, 404);
    if (currentUser.employee_id !== sw.to_employee_id && !isO) {
      return json({ error: 'เฉพาะคู่สลับหรือเจ้าของเท่านั้นที่อนุมัติได้' }, 403);
    }

    if (sw.swap_type === 'dayoff' && sw.date2) {
      // สลับวันหยุด: date1 = คนขอมาทำงาน + คู่หยุด, date2 = คนขอหยุด + คู่มาทำงาน
      const fromEmp = await DB.prepare('SELECT * FROM employees WHERE id=?').bind(sw.from_employee_id).first();
      const toEmp = await DB.prepare('SELECT * FROM employees WHERE id=?').bind(sw.to_employee_id).first();
      await DB.batch([
        // date1: คนขอ → มาทำงาน (กะปกติ), คู่สลับ → หยุด
        DB.prepare(`INSERT INTO shifts (employee_id,date,shift_type) VALUES (?,?,?) ON CONFLICT(employee_id,date) DO UPDATE SET shift_type=excluded.shift_type,updated_at=datetime('now')`)
          .bind(sw.from_employee_id, sw.date, fromEmp.default_shift),
        DB.prepare(`INSERT INTO shifts (employee_id,date,shift_type) VALUES (?,?,?) ON CONFLICT(employee_id,date) DO UPDATE SET shift_type=excluded.shift_type,updated_at=datetime('now')`)
          .bind(sw.to_employee_id, sw.date, 'off'),
        // date2: คนขอ → หยุด, คู่สลับ → มาทำงาน (กะปกติ)
        DB.prepare(`INSERT INTO shifts (employee_id,date,shift_type) VALUES (?,?,?) ON CONFLICT(employee_id,date) DO UPDATE SET shift_type=excluded.shift_type,updated_at=datetime('now')`)
          .bind(sw.from_employee_id, sw.date2, 'off'),
        DB.prepare(`INSERT INTO shifts (employee_id,date,shift_type) VALUES (?,?,?) ON CONFLICT(employee_id,date) DO UPDATE SET shift_type=excluded.shift_type,updated_at=datetime('now')`)
          .bind(sw.to_employee_id, sw.date2, toEmp.default_shift),
        DB.prepare("UPDATE swap_requests SET status='approved',approved_by=?,approved_at=datetime('now') WHERE id=?").bind(currentUser.employee_id, id),
        // นับครั้งสลับตอนอนุมัติ
        DB.prepare('UPDATE employees SET swap_count=COALESCE(swap_count,0)+1 WHERE id=?').bind(sw.from_employee_id),
      ]);
    } else {
      // สลับกะปกติ
      await DB.batch([
        DB.prepare(`INSERT INTO shifts (employee_id,date,shift_type) VALUES (?,?,?) ON CONFLICT(employee_id,date) DO UPDATE SET shift_type=excluded.shift_type,updated_at=datetime('now')`)
          .bind(sw.from_employee_id, sw.date, sw.to_shift),
        DB.prepare(`INSERT INTO shifts (employee_id,date,shift_type) VALUES (?,?,?) ON CONFLICT(employee_id,date) DO UPDATE SET shift_type=excluded.shift_type,updated_at=datetime('now')`)
          .bind(sw.to_employee_id, sw.date, sw.from_shift),
        DB.prepare("UPDATE swap_requests SET status='approved',approved_by=?,approved_at=datetime('now') WHERE id=?").bind(currentUser.employee_id, id),
        // นับครั้งสลับตอนอนุมัติ
        DB.prepare('UPDATE employees SET swap_count=COALESCE(swap_count,0)+1 WHERE id=?').bind(sw.from_employee_id),
      ]);
    }
    const sa1 = await DB.prepare('SELECT name,nickname FROM employees WHERE id=?').bind(sw.from_employee_id).first();
    const sa2 = await DB.prepare('SELECT name,nickname FROM employees WHERE id=?').bind(sw.to_employee_id).first();
    const swType = sw.swap_type === 'dayoff' ? 'สลับวันหยุด' : 'สลับกะ';
    await tgSend(tgSwapApproved(sa1?.nickname||sa1?.name, sa2?.nickname||sa2?.name, sw.date, sw.date2, currentUser.nickname||currentUser.name, sw.swap_type==='dayoff'));
    return json({ message: 'อนุมัติสำเร็จ' });
  }

  if (pathname.match(/^\/api\/swaps\/\d+\/reject$/) && method === 'PUT') {
    const id = pathname.split('/')[3];
    const sw = await DB.prepare('SELECT * FROM swap_requests WHERE id=?').bind(id).first();
    if (!sw) return json({ error: 'ไม่พบ' }, 404);
    if (currentUser.employee_id !== sw.to_employee_id && !isO) {
      return json({ error: 'เฉพาะคู่สลับหรือเจ้าของเท่านั้นที่ปฏิเสธได้' }, 403);
    }
    await DB.prepare("UPDATE swap_requests SET status='rejected',approved_by=?,approved_at=datetime('now') WHERE id=?")
      .bind(currentUser.employee_id, id).run();
    const sr1 = await DB.prepare('SELECT name,nickname FROM employees WHERE id=?').bind(sw.from_employee_id).first();
    const sr2 = await DB.prepare('SELECT name,nickname FROM employees WHERE id=?').bind(sw.to_employee_id).first();
    await tgSend(tgSwapRejected(sr1?.nickname||sr1?.name, sr2?.nickname||sr2?.name, sw.date, currentUser.nickname||currentUser.name, sw.swap_type==='dayoff'));
    return json({ message: 'ปฏิเสธสำเร็จ' });
  }

  // ==================== HOLIDAYS ====================
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

  // ==================== KPI ====================
  if (pathname === '/api/kpi/categories' && method === 'GET') {
    const { results } = await DB.prepare('SELECT c.*, (SELECT COUNT(*) FROM kpi_details WHERE category_id=c.id) as detail_count FROM kpi_categories c ORDER BY c.id').all();
    return json({ data: results });
  }
  if (pathname === '/api/kpi/details' && method === 'GET') {
    const catId = url.searchParams.get('category_id');
    let q = 'SELECT d.*, c.name as category_name, c.color as category_color FROM kpi_details d JOIN kpi_categories c ON d.category_id=c.id';
    const p = [];
    if (catId) { q += ' WHERE d.category_id=?'; p.push(catId); }
    q += ' ORDER BY d.category_id, d.id';
    const { results } = p.length ? await DB.prepare(q).bind(...p).all() : await DB.prepare(q).all();
    return json({ data: results });
  }
  if (pathname === '/api/kpi/errors' && method === 'GET') {
    const yr = url.searchParams.get('year') || String(new Date().getFullYear());
    const mo = url.searchParams.get('month');
    const empId = url.searchParams.get('employee_id');
    const limit = Math.min(parseInt(url.searchParams.get('limit')) || 200, 500);
    const offset = parseInt(url.searchParams.get('offset')) || 0;
    let q = `SELECT ke.*, e.name as emp_name, e.nickname as emp_nick, e.avatar as emp_avatar,
      c.name as cat_name, c.color as cat_color, d.description as detail_desc,
      cr.name as creator_name, cr.nickname as creator_nick
      FROM kpi_errors ke
      JOIN employees e ON ke.employee_id=e.id
      JOIN kpi_categories c ON ke.category_id=c.id
      LEFT JOIN kpi_details d ON ke.detail_id=d.id
      LEFT JOIN employees cr ON ke.created_by=cr.id
      WHERE ke.date LIKE ?`;
    const p = [mo ? `${yr}-${mo.padStart(2,'0')}%` : `${yr}%`];
    if (empId) { q += ' AND ke.employee_id=?'; p.push(empId); }
    q += ' ORDER BY ke.date DESC, ke.id DESC LIMIT ? OFFSET ?';
    p.push(limit, offset);
    const { results } = await DB.prepare(q).bind(...p).all();
    return json({ data: results });
  }
  if (pathname === '/api/kpi/errors' && method === 'POST') {
    if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    const b = await getBody();
    if (!b.date || !b.employee_id || !b.category_id) return json({ error: 'ข้อมูลไม่ครบ' }, 400);
    const r = await DB.prepare(
      'INSERT INTO kpi_errors (date,employee_id,category_id,detail_id,points,damage_cost,note,created_by) VALUES (?,?,?,?,?,?,?,?)'
    ).bind(b.date, b.employee_id, b.category_id, b.detail_id || null, b.points || 1, b.damage_cost || 0, b.note || null, currentUser.employee_id).run();
    // Telegram
    const emp = await DB.prepare('SELECT name,nickname FROM employees WHERE id=?').bind(b.employee_id).first();
    const cat = await DB.prepare('SELECT name FROM kpi_categories WHERE id=?').bind(b.category_id).first();
    await tgSend(tgKpiError(emp?.nickname||emp?.name, cat?.name, b.date, b.points||1, b.damage_cost||0, b.note));
    return json({ data: { id: r.meta.last_row_id }, message: 'บันทึกสำเร็จ' }, 201);
  }
  if (pathname.match(/^\/api\/kpi\/errors\/\d+$/) && method === 'DELETE') {
    if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    await DB.prepare('DELETE FROM kpi_errors WHERE id=?').bind(pathname.split('/').pop()).run();
    return json({ message: 'ลบสำเร็จ' });
  }
  if (pathname === '/api/kpi/details' && method === 'POST') {
    if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    const b = await getBody();
    await DB.prepare('INSERT INTO kpi_details (category_id,description,points,notes) VALUES (?,?,?,?)')
      .bind(b.category_id, b.description, b.points || 1, b.notes || null).run();
    return json({ message: 'เพิ่มสำเร็จ' }, 201);
  }
  if (pathname.match(/^\/api\/kpi\/details\/\d+$/) && method === 'PUT') {
    if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    const id = pathname.split('/').pop(), b = await getBody();
    const f = [], v = [];
    if (b.description !== undefined) { f.push('description=?'); v.push(b.description); }
    if (b.points !== undefined) { f.push('points=?'); v.push(b.points); }
    if (b.notes !== undefined) { f.push('notes=?'); v.push(b.notes); }
    if (!f.length) return json({ error: 'ไม่มีข้อมูล' }, 400);
    v.push(id);
    await DB.prepare('UPDATE kpi_details SET ' + f.join(',') + ' WHERE id=?').bind(...v).run();
    return json({ message: 'แก้ไขสำเร็จ' });
  }
  if (pathname.match(/^\/api\/kpi\/details\/\d+$/) && method === 'DELETE') {
    if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    await DB.prepare('DELETE FROM kpi_details WHERE id=?').bind(pathname.split('/').pop()).run();
    return json({ message: 'ลบสำเร็จ' });
  }
  if (pathname === '/api/settings' && method === 'POST') {
    if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    const b = await getBody();
    await DB.prepare('INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value')
      .bind(b.key, b.value).run();
    return json({ message: 'บันทึกสำเร็จ' });
  }
  if (pathname === '/api/kpi/summary' && method === 'GET') {
    const yr = url.searchParams.get('year') || String(new Date().getFullYear());
    const mo = url.searchParams.get('month');
    const dateLike = mo ? `${yr}-${mo.padStart(2,'0')}%` : `${yr}%`;
    // สรุปต่อคน
    const { results: byEmp } = await DB.prepare(`
      SELECT ke.employee_id, e.name, e.nickname, e.avatar, COUNT(*) as error_count, SUM(ke.points) as total_points, SUM(ke.damage_cost) as total_damage
      FROM kpi_errors ke JOIN employees e ON ke.employee_id=e.id WHERE ke.date LIKE ? GROUP BY ke.employee_id ORDER BY total_points DESC
    `).bind(dateLike).all();
    // สรุปต่อหมวด
    const { results: byCat } = await DB.prepare(`
      SELECT c.id, c.name, c.color, COUNT(*) as error_count, SUM(ke.points) as total_points
      FROM kpi_errors ke JOIN kpi_categories c ON ke.category_id=c.id WHERE ke.date LIKE ? GROUP BY ke.category_id ORDER BY total_points DESC
    `).bind(dateLike).all();
    // สรุปรวม
    const totals = await DB.prepare('SELECT COUNT(*) as c, SUM(points) as p, SUM(damage_cost) as d FROM kpi_errors WHERE date LIKE ?').bind(dateLike).first();
    return json({ data: { byEmployee: byEmp, byCategory: byCat, totals: { count: totals?.c || 0, points: totals?.p || 0, damage: totals?.d || 0 } } });
  }

  // ==================== APPROVAL HISTORY ====================
  if (pathname === '/api/history' && method === 'GET') {
    const yr = url.searchParams.get('year') || String(new Date().getFullYear());
    // ประวัติการอนุมัติวันลา
    const { results: leaves } = await DB.prepare(`
      SELECT l.*, e.name as emp_name, e.nickname as emp_nick, e.avatar as emp_avatar,
        a.name as approver_name, a.nickname as approver_nick
      FROM leaves l
      JOIN employees e ON l.employee_id=e.id
      LEFT JOIN employees a ON l.approved_by=a.id
      WHERE l.date LIKE ? AND l.status != 'pending'
      ORDER BY l.approved_at DESC
    `).bind(`${yr}%`).all();
    // ประวัติสลับกะ
    const { results: swaps } = await DB.prepare(`
      SELECT sr.*, e1.name as from_name, e1.nickname as from_nick, e1.avatar as from_avatar,
        e2.name as to_name, e2.nickname as to_nick, e2.avatar as to_avatar,
        a.name as approver_name, a.nickname as approver_nick
      FROM swap_requests sr
      JOIN employees e1 ON sr.from_employee_id=e1.id
      JOIN employees e2 ON sr.to_employee_id=e2.id
      LEFT JOIN employees a ON sr.approved_by=a.id
      WHERE sr.date LIKE ? AND sr.status != 'pending'
      ORDER BY sr.approved_at DESC
    `).bind(`${yr}%`).all();
    return json({ data: { leaves, swaps } });
  }

  // ==================== OVERVIEW ====================
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
    const yearlyLeaves = {};
    const { results: ylr } = await DB.prepare("SELECT employee_id, leave_type, COUNT(*) as c FROM leaves WHERE date LIKE ? AND status!='rejected' GROUP BY employee_id, leave_type").bind(`${yr}%`).all();
    ylr.forEach(r => { if (!yearlyLeaves[r.employee_id]) yearlyLeaves[r.employee_id] = {}; yearlyLeaves[r.employee_id][r.leave_type] = r.c; });
    const settings = {}; st.results.forEach(r => { settings[r.key] = r.value; });
    return json({ data: { employees: e.results, shifts: s.results, leaves: l.results, holidays: ho.results, settings, yearlyLeaves } });
  }

  return json({ error: 'Not found' }, 404);
}

async function getQuotaLeaveUsed(DB, empId, year) {
  const r = await DB.prepare("SELECT COUNT(*) as c FROM leaves WHERE employee_id=? AND date LIKE ? AND status!='rejected' AND leave_type IN ('personal','vacation')").bind(empId, `${year}%`).first();
  return r?.c || 0;
}
function dateRange(s, e) { const d = [], c = new Date(s), ed = new Date(e); while (c <= ed) { d.push(c.toISOString().split('T')[0]); c.setDate(c.getDate() + 1); } return d; }

// Telegram notification — ใช้ env secrets แทน hardcode
// ตั้งค่า: npx wrangler secret put TG_BOT_TOKEN
//         npx wrangler secret put TG_CHAT_ID
let _tgEnv = null;
function setTgEnv(env) { _tgEnv = env; }
async function tgSend(msg) {
  try {
    const token = _tgEnv?.TG_BOT_TOKEN;
    const chatId = _tgEnv?.TG_CHAT_ID;
    if (!token || !chatId) return; // skip if not configured
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'HTML' }),
    });
  } catch (e) { /* ignore telegram errors */ }
}
function fmtDateTH(iso) { if (!iso) return ''; const [y,m,d] = iso.split('-'); return d+'/'+m+'/'+(+y+543); }
function dayNameTH(iso) { if (!iso) return ''; const days = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์']; return days[new Date(iso).getDay()]; }

// === Telegram Message Templates ===
function tgLeaveRequest(empName, leaveType, date, endDate, count, reason) {
  const LT = {sick:'🏥 ลาป่วย',personal:'📋 ลากิจ',vacation:'✈️ ลาพักร้อน'};
  const type = LT[leaveType] || leaveType;
  const dateStr = endDate && endDate !== date
    ? `${fmtDateTH(date)} → ${fmtDateTH(endDate)} (${count} วัน)`
    : `${fmtDateTH(date)} (${dayNameTH(date)})`;
  return `━━━━━━━━━━━━━━━
📝 <b>คำขอลางาน</b>
━━━━━━━━━━━━━━━
👤 <b>${empName}</b>
📌 ${type}
🗓 ${dateStr}${reason ? `\n💬 <i>${reason}</i>` : ''}

⏳ <b>สถานะ:</b> รออนุมัติ
━━━━━━━━━━━━━━━`;
}

function tgLeaveApproved(empName, leaveType, date, approverName) {
  const LT = {sick:'🏥 ลาป่วย',personal:'📋 ลากิจ',vacation:'✈️ ลาพักร้อน'};
  return `━━━━━━━━━━━━━━━
✅ <b>อนุมัติวันลา</b>
━━━━━━━━━━━━━━━
👤 <b>${empName}</b>
📌 ${LT[leaveType] || leaveType}
🗓 ${fmtDateTH(date)} (${dayNameTH(date)})
✍️ โดย: ${approverName}

🟢 <b>อนุมัติแล้ว</b>
━━━━━━━━━━━━━━━`;
}

function tgLeaveRejected(empName, leaveType, date, approverName) {
  const LT = {sick:'🏥 ลาป่วย',personal:'📋 ลากิจ',vacation:'✈️ ลาพักร้อน'};
  return `━━━━━━━━━━━━━━━
❌ <b>ปฏิเสธวันลา</b>
━━━━━━━━━━━━━━━
👤 <b>${empName}</b>
📌 ${LT[leaveType] || leaveType}
🗓 ${fmtDateTH(date)} (${dayNameTH(date)})
✍️ โดย: ${approverName}

🔴 <b>ไม่อนุมัติ</b>
━━━━━━━━━━━━━━━`;
}

function tgSwapRequest(fromName, toName, date, reason, isDayoff, date2) {
  const icon = isDayoff ? '📅' : '🔄';
  const title = isDayoff ? 'สลับวันหยุด' : 'สลับกะ';
  const dateStr = isDayoff && date2
    ? `${fmtDateTH(date)} (${dayNameTH(date)}) ↔ ${fmtDateTH(date2)} (${dayNameTH(date2)})`
    : `${fmtDateTH(date)} (${dayNameTH(date)})`;
  return `━━━━━━━━━━━━━━━
${icon} <b>คำขอ${title}</b>
━━━━━━━━━━━━━━━
👤 <b>${fromName}</b> ↔ <b>${toName}</b>
🗓 ${dateStr}${reason ? `\n💬 <i>${reason}</i>` : ''}

⏳ รอ <b>${toName}</b> อนุมัติ
━━━━━━━━━━━━━━━`;
}

function tgSwapApproved(fromName, toName, date, date2, approverName, isDayoff) {
  const icon = isDayoff ? '📅' : '🔄';
  const title = isDayoff ? 'สลับวันหยุด' : 'สลับกะ';
  const dateStr = date2
    ? `${fmtDateTH(date)} ↔ ${fmtDateTH(date2)}`
    : fmtDateTH(date);
  return `━━━━━━━━━━━━━━━
✅ <b>อนุมัติ${title}</b>
━━━━━━━━━━━━━━━
${icon} <b>${fromName}</b> ↔ <b>${toName}</b>
🗓 ${dateStr}
✍️ โดย: ${approverName}

🟢 <b>สลับเรียบร้อย!</b>
━━━━━━━━━━━━━━━`;
}

function tgSwapRejected(fromName, toName, date, approverName, isDayoff) {
  const title = isDayoff ? 'สลับวันหยุด' : 'สลับกะ';
  return `━━━━━━━━━━━━━━━
❌ <b>ปฏิเสธ${title}</b>
━━━━━━━━━━━━━━━
👤 <b>${fromName}</b> ↔ <b>${toName}</b>
🗓 ${fmtDateTH(date)}
✍️ โดย: ${approverName}

🔴 <b>ไม่อนุมัติ</b>
━━━━━━━━━━━━━━━`;
}

function tgKpiError(empName, catName, date, points, damage, note) {
  return `━━━━━━━━━━━━━━━
⚡ <b>บันทึก KPI Error</b>
━━━━━━━━━━━━━━━
👤 <b>${empName}</b>
📂 ${catName}
🗓 ${fmtDateTH(date)}
🔢 ${points} แต้ม${damage > 0 ? `\n💰 ค่าเสียหาย: ${damage} ฿` : ''}${note ? `\n📝 <i>${note}</i>` : ''}
━━━━━━━━━━━━━━━`;
}
