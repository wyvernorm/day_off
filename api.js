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
    tgSend(`📝 <b>คำขอลางาน</b>\n👤 ${empN?.nickname||empN?.name}\n📋 ${LT[b.leave_type]||b.leave_type}\n📅 ${fmtDateTH(b.date)}${b.reason ? '\n💬 '+b.reason : ''}\n⏳ รออนุมัติ`);
    return json({ message: 'บันทึกสำเร็จ' }, 201);
  }
  if (pathname === '/api/leaves/range' && method === 'POST') {
    const b = await getBody();
    const dates = dateRange(b.start_date, b.end_date), yr = b.start_date.substring(0, 4);
    if (b.leave_type !== 'sick') {
      const q = await getQuotaLeaveUsed(DB, b.employee_id, yr);
      const emp = await DB.prepare('SELECT max_leave_per_year FROM employees WHERE id=?').bind(b.employee_id).first();
      const max = emp?.max_leave_per_year || 20;
      if (q + dates.length > max) return json({ error: `โควต้าไม่พอ (เหลือ ${max - q} วัน, ขอ ${dates.length} วัน)` }, 400);
    }
    const stmt = DB.prepare(`INSERT INTO leaves (employee_id,date,leave_type,reason,status) VALUES (?,?,?,?,'pending')
       ON CONFLICT(employee_id,date) DO UPDATE SET leave_type=excluded.leave_type,reason=excluded.reason,status='pending',updated_at=datetime('now')`);
    await DB.batch(dates.map(d => stmt.bind(b.employee_id, d, b.leave_type, b.reason || null)));
    const LT2 = {sick:'ลาป่วย',personal:'ลากิจ',vacation:'ลาพักร้อน'};
    const empN2 = await DB.prepare('SELECT name,nickname FROM employees WHERE id=?').bind(b.employee_id).first();
    tgSend(`📝 <b>คำขอลางาน</b>\n👤 ${empN2?.nickname||empN2?.name}\n📋 ${LT2[b.leave_type]||b.leave_type}\n📅 ${fmtDateTH(b.start_date)} - ${fmtDateTH(b.end_date)} (${dates.length} วัน)${b.reason ? '\n💬 '+b.reason : ''}\n⏳ รออนุมัติ`);
    return json({ message: `บันทึก ${dates.length} วันสำเร็จ` }, 201);
  }
  if (pathname.match(/^\/api\/leaves\/\d+\/approve$/) && method === 'PUT') {
    const leaveId = pathname.split('/')[3];
    const leave = await DB.prepare('SELECT l.*, e.email as requester_email FROM leaves l JOIN employees e ON l.employee_id=e.id WHERE l.id=?').bind(leaveId).first();
    if (!leave) return json({ error: 'ไม่พบรายการ' }, 404);
    // ลาป่วย: ถ้าน้ำตาลลา → เฉพาะ ToP อนุมัติ, ถ้าคนอื่นลา → น้ำตาล+ToP อนุมัติ
    if (leave.leave_type === 'sick') {
      if (leave.requester_email === 'iiiiinamtaniiiii@gmail.com') {
        if (currentUser.email !== 'wyvernorm@gmail.com') return json({ error: 'เฉพาะ ToP เท่านั้นที่อนุมัติลาป่วยของน้ำตาลได้' }, 403);
      } else {
        const SICK_APPROVERS = ['iiiiinamtaniiiii@gmail.com', 'wyvernorm@gmail.com'];
        if (!SICK_APPROVERS.includes(currentUser.email)) return json({ error: 'เฉพาะผู้มีสิทธิ์เท่านั้นที่อนุมัติลาป่วยได้' }, 403);
      }
    } else {
      if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    }
    await DB.prepare("UPDATE leaves SET status='approved',approved_by=?,approved_at=datetime('now'),updated_at=datetime('now') WHERE id=?")
      .bind(currentUser.employee_id, leaveId).run();
    const LTA = {sick:'ลาป่วย',personal:'ลากิจ',vacation:'ลาพักร้อน'};
    const reqEmpA = await DB.prepare('SELECT name,nickname FROM employees WHERE id=?').bind(leave.employee_id).first();
    tgSend(`✅ <b>อนุมัติวันลา</b>\n👤 ${reqEmpA?.nickname||reqEmpA?.name}\n📋 ${LTA[leave.leave_type]||leave.leave_type}\n📅 ${fmtDateTH(leave.date)}\n✍️ อนุมัติโดย: ${currentUser.nickname||currentUser.name}`);
    return json({ message: 'อนุมัติสำเร็จ' });
  }
  if (pathname.match(/^\/api\/leaves\/\d+\/reject$/) && method === 'PUT') {
    const leaveId = pathname.split('/')[3];
    const leave = await DB.prepare('SELECT l.*, e.email as requester_email FROM leaves l JOIN employees e ON l.employee_id=e.id WHERE l.id=?').bind(leaveId).first();
    if (!leave) return json({ error: 'ไม่พบรายการ' }, 404);
    if (leave.leave_type === 'sick') {
      if (leave.requester_email === 'iiiiinamtaniiiii@gmail.com') {
        if (currentUser.email !== 'wyvernorm@gmail.com') return json({ error: 'เฉพาะ ToP เท่านั้นที่ปฏิเสธลาป่วยของน้ำตาลได้' }, 403);
      } else {
        const SICK_APPROVERS = ['iiiiinamtaniiiii@gmail.com', 'wyvernorm@gmail.com'];
        if (!SICK_APPROVERS.includes(currentUser.email)) return json({ error: 'เฉพาะผู้มีสิทธิ์เท่านั้นที่ปฏิเสธลาป่วยได้' }, 403);
      }
    } else {
      if (!isO) return json({ error: 'ไม่มีสิทธิ์' }, 403);
    }
    await DB.prepare("UPDATE leaves SET status='rejected',approved_by=?,approved_at=datetime('now'),updated_at=datetime('now') WHERE id=?")
      .bind(currentUser.employee_id, leaveId).run();
    const LTR = {sick:'ลาป่วย',personal:'ลากิจ',vacation:'ลาพักร้อน'};
    const reqEmpR = await DB.prepare('SELECT name,nickname FROM employees WHERE id=?').bind(leave.employee_id).first();
    tgSend(`❌ <b>ปฏิเสธวันลา</b>\n👤 ${reqEmpR?.nickname||reqEmpR?.name}\n📋 ${LTR[leave.leave_type]||leave.leave_type}\n📅 ${fmtDateTH(leave.date)}\n✍️ โดย: ${currentUser.nickname||currentUser.name}`);
    return json({ message: 'ปฏิเสธสำเร็จ' });
  }
  if (pathname.match(/^\/api\/leaves\/\d+$/) && method === 'DELETE') {
    await DB.prepare('DELETE FROM leaves WHERE id=?').bind(pathname.split('/').pop()).run();
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

    // นับครั้งสลับกะ
    await DB.prepare('UPDATE employees SET swap_count=COALESCE(swap_count,0)+1 WHERE id=?').bind(b.from_employee_id).run();

    tgSend(`🔄 <b>คำขอสลับกะ</b>\n👤 ${fromEmp.nickname||fromEmp.name} ↔ ${toEmp.nickname||toEmp.name}\n📅 ${fmtDateTH(b.date)}${b.reason ? '\n💬 '+b.reason : ''}\n⏳ รอ ${toEmp.nickname||toEmp.name} อนุมัติ`);
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
    await DB.prepare('UPDATE employees SET swap_count=COALESCE(swap_count,0)+1 WHERE id=?').bind(b.from_employee_id).run();

    tgSend(`📅 <b>คำขอสลับวันหยุด</b>\n👤 ${fromEmp.nickname||fromEmp.name} ↔ ${toEmp.nickname||toEmp.name}\n📅 ${fmtDateTH(b.date1)} ↔ ${fmtDateTH(b.date2)}${b.reason ? '\n💬 '+b.reason : ''}\n⏳ รอ ${toEmp.nickname||toEmp.name} อนุมัติ`);
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
      ]);
    } else {
      // สลับกะปกติ
      await DB.batch([
        DB.prepare(`INSERT INTO shifts (employee_id,date,shift_type) VALUES (?,?,?) ON CONFLICT(employee_id,date) DO UPDATE SET shift_type=excluded.shift_type,updated_at=datetime('now')`)
          .bind(sw.from_employee_id, sw.date, sw.to_shift),
        DB.prepare(`INSERT INTO shifts (employee_id,date,shift_type) VALUES (?,?,?) ON CONFLICT(employee_id,date) DO UPDATE SET shift_type=excluded.shift_type,updated_at=datetime('now')`)
          .bind(sw.to_employee_id, sw.date, sw.from_shift),
        DB.prepare("UPDATE swap_requests SET status='approved',approved_by=?,approved_at=datetime('now') WHERE id=?").bind(currentUser.employee_id, id),
      ]);
    }
    const sa1 = await DB.prepare('SELECT name,nickname FROM employees WHERE id=?').bind(sw.from_employee_id).first();
    const sa2 = await DB.prepare('SELECT name,nickname FROM employees WHERE id=?').bind(sw.to_employee_id).first();
    const swType = sw.swap_type === 'dayoff' ? 'สลับวันหยุด' : 'สลับกะ';
    tgSend(`✅ <b>อนุมัติ${swType}</b>\n👤 ${sa1?.nickname||sa1?.name} ↔ ${sa2?.nickname||sa2?.name}\n📅 ${fmtDateTH(sw.date)}${sw.date2 ? ' ↔ '+fmtDateTH(sw.date2) : ''}\n✍️ อนุมัติโดย: ${currentUser.nickname||currentUser.name}`);
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
    tgSend(`❌ <b>ปฏิเสธ${sw.swap_type==='dayoff'?'สลับวันหยุด':'สลับกะ'}</b>\n👤 ${sr1?.nickname||sr1?.name} ↔ ${sr2?.nickname||sr2?.name}\n📅 ${fmtDateTH(sw.date)}\n✍️ โดย: ${currentUser.nickname||currentUser.name}`);
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
    q += ' ORDER BY ke.date DESC, ke.id DESC';
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
    tgSend(`⚠️ <b>บันทึกข้อผิดพลาด</b>\n👤 ${emp?.nickname||emp?.name}\n📂 ${cat?.name}\n📅 ${fmtDateTH(b.date)}\n🔢 ${b.points||1} แต้ม${b.damage_cost > 0 ? '\n💰 ค่าเสียหาย: '+b.damage_cost+' ฿' : ''}${b.note ? '\n📝 '+b.note : ''}`);
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

// Telegram notification
const TG_BOT = '8491422431:AAGXw5Fv5WeQApYeGSNB1-3OP7yrKBazJ4w';
const TG_CHAT = '-5134064630';
async function tgSend(msg) {
  try {
    await fetch(`https://api.telegram.org/bot${TG_BOT}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT, text: msg, parse_mode: 'HTML' }),
    });
  } catch (e) { /* ignore telegram errors */ }
}
function fmtDateTH(iso) { if (!iso) return ''; const [y,m,d] = iso.split('-'); return d+'/'+m+'/'+(+y+543); }
