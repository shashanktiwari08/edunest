const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { supabase, checkAndRefreshFinances } = require('../db');
const { authenticateToken, requireRole } = require('../middleware');

// Apply guards: All routes under /api/admin require authentication and admin role
router.use(authenticateToken, requireRole(['admin']));

// 1. Create a user (Teacher / Student) using mobile number
router.post('/users', async (req, res) => {
  const { name, mobile_number, role, password, financialAmount, subject, cycle_day } = req.body;

  if (!name || !mobile_number || !role || !password) {
    return res.status(400).json({ error: 'All primary fields (name, mobile_number, role, password) are required' });
  }

  if (!['teacher', 'student'].includes(role)) {
    return res.status(400).json({ error: 'Role must be either teacher or student' });
  }

  try {
    // Check if mobile number registered in Supabase
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('mobile_number', mobile_number)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ error: 'Mobile number already registered' });
    }

    const userId = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user into Supabase
    const { error: userErr } = await supabase.from('users').insert({
      id: userId,
      name,
      mobile_number,
      password_hash: passwordHash,
      role,
      subject: subject || (role === 'student' ? 'All Subjects' : 'General')
    });

    if (userErr) throw userErr;

    // Setup ledger records instantly in Supabase
    const parsedAmount = parseFloat(financialAmount) || (role === 'teacher' ? 3000.0 : 1200.0);
    const financeId = crypto.randomUUID();
    const type = role === 'teacher' ? 'salary' : 'fee';

    // Format target due date based on customizable cycle_day
    const today = new Date();
    const parsedCycleDay = parseInt(cycle_day) || 28;
    const safeDay = Math.min(Math.max(1, parsedCycleDay), 28); // Clamp to safe 1-28 monthly range
    
    let targetYear = today.getFullYear();
    let targetMonth = today.getMonth(); // 0-indexed
    
    if (today.getDate() > safeDay) {
      targetMonth += 1;
      if (targetMonth > 11) {
        targetMonth = 0;
        targetYear += 1;
      }
    }
    
    const dueDateStr = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`;

    const { error: finErr } = await supabase.from('finances').insert({
      id: financeId,
      user_id: userId,
      type,
      amount_total: parsedAmount,
      amount_paid: 0.0,
      amount_pending: parsedAmount,
      due_date: dueDateStr,
      status: 'pending'
    });

    if (finErr) throw finErr;

    return res.status(201).json({
      message: `User created successfully as ${role}`,
      user: { id: userId, name, mobile_number, role },
    });
  } catch (error) {
    console.error('Error creating user in Supabase:', error.message);
    return res.status(500).json({ error: 'Failed to create user' });
  }
});

// 2. Fetch users filtered by role
router.get('/users', async (req, res) => {
  const { role } = req.query;
  await checkAndRefreshFinances();
  try {
    let query = supabase.from('users').select('*');
    
    if (role) {
      query = query.eq('role', role);
    }
    
    const { data: users, error } = await query.order('name', { ascending: true });
    if (error) throw error;

    return res.json(users);
  } catch (error) {
    console.error('Error listing users from Supabase:', error.message);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// 3. Fetch finances by type (joining with users in Supabase)
router.get('/finances', async (req, res) => {
  const { type } = req.query;
  await checkAndRefreshFinances();
  if (!type || !['salary', 'fee'].includes(type)) {
    return res.status(400).json({ error: 'Valid query parameter type=salary or type=fee is required' });
  }

  try {
    const { data, error } = await supabase
      .from('finances')
      .select('*, users(name, mobile_number)')
      .eq('type', type)
      .order('due_date', { ascending: true });

    if (error) throw error;

    // Map join to flat object for frontend compatibility
    const finances = data.map((f) => ({
      id: f.id,
      user_id: f.user_id,
      type: f.type,
      amount_total: parseFloat(f.amount_total),
      amount_paid: parseFloat(f.amount_paid),
      amount_pending: parseFloat(f.amount_pending),
      due_date: f.due_date,
      status: f.status,
      name: f.users ? f.users.name : 'Unknown',
      mobile_number: f.users ? f.users.mobile_number : 'N/A'
    }));

    return res.json(finances);
  } catch (error) {
    console.error('Error fetching finances from Supabase:', error.message);
    return res.status(500).json({ error: 'Failed to fetch finances ledger' });
  }
});

// 4. Record payment (Pay salary or log fee payment)
router.post('/finances/pay', async (req, res) => {
  const { finance_id, amount_paid_now } = req.body;

  if (!finance_id || amount_paid_now === undefined || amount_paid_now <= 0) {
    return res.status(400).json({ error: 'Valid finance_id and positive payment amount are required' });
  }

  try {
    const { data: record, error: getErr } = await supabase
      .from('finances')
      .select('*')
      .eq('id', finance_id)
      .maybeSingle();

    if (getErr || !record) {
      return res.status(404).json({ error: 'Financial ledger record not found' });
    }

    const newPaid = parseFloat(record.amount_paid) + parseFloat(amount_paid_now);
    const newPending = Math.max(0, parseFloat(record.amount_total) - newPaid);
    const newStatus = newPending <= 0 ? 'paid' : 'pending';

    const { error: updErr } = await supabase
      .from('finances')
      .update({
        amount_paid: newPaid,
        amount_pending: newPending,
        status: newStatus
      })
      .eq('id', finance_id);

    if (updErr) throw updErr;

    // Real-Time Notification: Push finance update to the user
    const wssBroadcast = req.app.get('wssBroadcast');
    if (wssBroadcast) {
      wssBroadcast({
        type: 'FINANCE_UPDATE',
        studentIds: [record.user_id],
        message: `Payment registered: ₹${amount_paid_now} received. Remaining pending balance: ₹${newPending}.`,
        amount_paid: newPaid,
        amount_pending: newPending,
        status: newStatus
      });
    }

    return res.json({
      message: 'Payment recorded successfully',
      record: {
        id: finance_id,
        amount_total: parseFloat(record.amount_total),
        amount_paid: newPaid,
        amount_pending: newPending,
        status: newStatus,
      },
    });
  } catch (error) {
    console.error('Payment tracking error:', error.message);
    return res.status(500).json({ error: 'Failed to log financial payment' });
  }
});

// 5. Revert Payment (Undo Payment)
router.post('/finances/undo', async (req, res) => {
  const { finance_id } = req.body;

  if (!finance_id) {
    return res.status(400).json({ error: 'Finance ID is required for reversion' });
  }

  try {
    const { data: record, error: getErr } = await supabase
      .from('finances')
      .select('*')
      .eq('id', finance_id)
      .maybeSingle();

    if (getErr || !record) {
      return res.status(404).json({ error: 'Financial ledger record not found' });
    }

    const totalAmount = parseFloat(record.amount_total);
    const { error: updErr } = await supabase
      .from('finances')
      .update({
        amount_paid: 0.0,
        amount_pending: totalAmount,
        status: 'pending'
      })
      .eq('id', finance_id);

    if (updErr) throw updErr;

    const wssBroadcast = req.app.get('wssBroadcast');
    if (wssBroadcast) {
      wssBroadcast({
        type: 'FINANCE_UPDATE',
        studentIds: [record.user_id],
        message: `A payment transaction was reverted by the Admin. Your tuition fee balance is restored to ₹${totalAmount}.`,
        amount_paid: 0.0,
        amount_pending: totalAmount,
        status: 'pending'
      });
    }

    return res.json({
      message: 'Payment transaction reverted successfully',
      record: {
        id: finance_id,
        amount_total: totalAmount,
        amount_paid: 0.0,
        amount_pending: totalAmount,
        status: 'pending',
      },
    });
  } catch (error) {
    console.error('Payment undo error:', error.message);
    return res.status(500).json({ error: 'Failed to revert financial payment' });
  }
});

// 6. Get all leaves (joining with users in Supabase)
router.get('/leaves', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leaves')
      .select('*, users(name, mobile_number)')
      .order('start_date', { ascending: false });

    if (error) throw error;

    const leaves = data.map((l) => ({
      id: l.id,
      teacher_id: l.teacher_id,
      start_date: l.start_date,
      end_date: l.end_date,
      reason: l.reason,
      status: l.status,
      name: l.users ? l.users.name : 'Unknown',
      mobile_number: l.users ? l.users.mobile_number : 'N/A'
    }));

    return res.json(leaves);
  } catch (error) {
    console.error('Error fetching leaves from Supabase:', error.message);
    return res.status(500).json({ error: 'Failed to fetch leave list' });
  }
});

// 7. Approve / Reject Leave with payroll hook
router.patch('/leaves/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Valid status ("approved" or "rejected") is required' });
  }

  try {
    const { data: leave, error: getErr } = await supabase
      .from('leaves')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (getErr || !leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    const { error: updLeaveErr } = await supabase
      .from('leaves')
      .update({ status })
      .eq('id', id);

    if (updLeaveErr) throw updLeaveErr;

    if (status === 'approved') {
      const teacherId = leave.teacher_id;
      const { data: salaryRecord } = await supabase
        .from('finances')
        .select('*')
        .eq('user_id', teacherId)
        .eq('type', 'salary')
        .eq('status', 'pending')
        .maybeSingle();

      if (salaryRecord) {
        const baseTotal = parseFloat(salaryRecord.amount_total);
        const deduction = parseFloat((baseTotal * 0.05).toFixed(2));
        const newTotal = parseFloat((baseTotal - deduction).toFixed(2));
        const newPending = Math.max(0, parseFloat((newTotal - parseFloat(salaryRecord.amount_paid)).toFixed(2)));
        const newStatus = newPending <= 0 ? 'paid' : 'pending';

        await supabase
          .from('finances')
          .update({
            amount_total: newTotal,
            amount_pending: newPending,
            status: newStatus
          })
          .eq('id', salaryRecord.id);

        console.log(`Deducted 5% (₹${deduction}) from teacher ${teacherId}'s salary in Supabase.`);
      }
    }

    const wssBroadcast = req.app.get('wssBroadcast');
    if (wssBroadcast) {
      wssBroadcast({
        type: 'LEAVE_STATUS_UPDATE',
        studentIds: [leave.teacher_id],
        message: `Your filed leave application starting ${leave.start_date} was reviewed and is now ${status.toUpperCase()}.`,
        status,
        leave_id: id
      });
    }

    return res.json({
      message: `Leave request ${status} successfully.`,
      leave_id: id,
      status,
    });
  } catch (error) {
    console.error('Error updating leave state in Supabase:', error.message);
    return res.status(500).json({ error: 'Failed to update leave record' });
  }
});

// 8. Credentials Override (Admin Tab)
router.post('/users/credentials', async (req, res) => {
  const { user_id, mobile_number, password } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const updatePayload = {};
    if (mobile_number) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('mobile_number', mobile_number)
        .neq('id', user_id)
        .maybeSingle();

      if (existingUser) {
        return res.status(400).json({ error: 'Mobile number already registered' });
      }
      updatePayload.mobile_number = mobile_number;
    }

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      updatePayload.password_hash = passwordHash;
    }

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ error: 'Provide at least a mobile number or password to update.' });
    }

    const { error: updErr } = await supabase
      .from('users')
      .update(updatePayload)
      .eq('id', user_id);

    if (updErr) throw updErr;

    const wssBroadcast = req.app.get('wssBroadcast');
    if (wssBroadcast) {
      wssBroadcast({
        type: 'CREDENTIALS_UPDATE',
        studentIds: [user_id],
        message: `Your login mobile number or password has been altered by the Admin.`
      });
    }

    return res.json({ message: 'Credentials updated successfully' });
  } catch (error) {
    console.error('Credentials override error:', error.message);
    return res.status(500).json({ error: 'Failed to update credentials' });
  }
});

// 9. Fetch Teacher Detail Aggregations
router.get('/teachers/:id/details', async (req, res) => {
  const teacherId = req.params.id;
  const currentMonthStr = new Date().toISOString().substring(0, 7);

  try {
    const { data: batches, error: batchErr } = await supabase
      .from('batches')
      .select('id, batch_name')
      .eq('teacher_id', teacherId);

    if (batchErr) throw batchErr;
    const batchIds = batches.map((b) => b.id);

    let lectures = [];
    let attendance = [];

    if (batchIds.length > 0) {
      const { data: lectData, error: lectErr } = await supabase
        .from('lectures')
        .select('*, batches(batch_name)')
        .in('batch_id', batchIds)
        .order('date', { ascending: false });

      if (lectErr) throw lectErr;
      
      lectures = lectData.map((l) => ({
        id: l.id,
        batch_id: l.batch_id,
        date: l.date,
        start_time: l.start_time,
        end_time: l.end_time,
        topic: l.topic,
        batch_name: l.batches ? l.batches.batch_name : 'Unknown Batch'
      }));

      const lectureIds = lectures.map((l) => l.id);

      if (lectureIds.length > 0) {
        const { data: attData, error: attErr } = await supabase
          .from('attendance')
          .select('*, lectures(topic, date), users(name, mobile_number)')
          .in('lecture_id', lectureIds);

        if (attErr) throw attErr;

        attendance = attData.map((a) => ({
          id: a.id,
          lecture_id: a.lecture_id,
          student_id: a.student_id,
          status: a.status,
          topic: a.lectures ? a.lectures.topic : 'N/A',
          date: a.lectures ? a.lectures.date : 'N/A',
          student_name: a.users ? a.users.name : 'Unknown Student',
          student_mobile: a.users ? a.users.mobile_number : 'N/A'
        }));
      }
    }

    const { data: leavesData, error: leaveErr } = await supabase
      .from('leaves')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('start_date', { ascending: false });

    if (leaveErr) throw leaveErr;

    const currentMonthLeaves = leavesData.filter((leave) => 
      leave.start_date.startsWith(currentMonthStr)
    );

    return res.json({
      lectures,
      attendance,
      leaves: currentMonthLeaves,
      totalLeavesCount: currentMonthLeaves.length
    });
  } catch (error) {
    console.error('Error fetching teacher aggregates from Supabase:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve teacher monitoring statistics.' });
  }
});

// 10. Edit Pending Amount / Mark Not Pending
router.post('/finances/edit-pending', async (req, res) => {
  const { finance_id, amount_pending, status } = req.body;

  if (!finance_id) {
    return res.status(400).json({ error: 'Finance ID is required' });
  }

  try {
    const { data: record, error: getErr } = await supabase
      .from('finances')
      .select('*')
      .eq('id', finance_id)
      .maybeSingle();

    if (getErr || !record) {
      return res.status(404).json({ error: 'Financial record not found' });
    }

    const updateData = {};
    if (amount_pending !== undefined) {
      updateData.amount_pending = parseFloat(amount_pending);
      if (parseFloat(amount_pending) === 0) {
        updateData.status = 'paid';
      } else {
        updateData.status = 'pending';
      }
    }

    if (status !== undefined) {
      updateData.status = status;
      if (status === 'not_pending') {
        updateData.amount_pending = 0.0;
      }
    }

    const { error: updErr } = await supabase
      .from('finances')
      .update(updateData)
      .eq('id', finance_id);

    if (updErr) throw updErr;

    const wssBroadcast = req.app.get('wssBroadcast');
    if (wssBroadcast) {
      wssBroadcast({
        type: 'FINANCE_UPDATE',
        studentIds: [record.user_id],
        message: `Your pending fee balance has been modified by the Admin.`,
        amount_pending: updateData.amount_pending !== undefined ? updateData.amount_pending : record.amount_pending,
        status: updateData.status !== undefined ? updateData.status : record.status
      });
    }

    return res.json({
      message: 'Financial ledger updated successfully',
      record: {
        id: finance_id,
        amount_pending: updateData.amount_pending !== undefined ? updateData.amount_pending : parseFloat(record.amount_pending),
        status: updateData.status !== undefined ? updateData.status : record.status
      }
    });
  } catch (error) {
    console.error('Error updating pending amount:', error.message);
    return res.status(500).json({ error: 'Failed to update pending amount' });
  }
});

module.exports = router;
