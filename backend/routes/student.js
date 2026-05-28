const express = require('express');
const router = express.Router();
const { supabase, checkAndRefreshFinances } = require('../db');
const { authenticateToken, requireRole } = require('../middleware');

// Apply guards: All routes under /api/student require authentication and student role
router.use(authenticateToken, requireRole(['student']));

// 1. Fetch Student Dashboard aggregates from Supabase
router.get('/dashboard', async (req, res) => {
  const studentId = req.user.id;
  await checkAndRefreshFinances();

  try {
    // A. Live Schedule Feed: Queries lectures in student's enrolled batches.
    const { data: enrolledLinks, error: linkErr } = await supabase
      .from('batch_students')
      .select('batch_id')
      .eq('student_id', studentId);

    if (linkErr) throw linkErr;
    const batchIds = enrolledLinks.map((link) => link.batch_id);

    let scheduleFeed = [];
    if (batchIds.length > 0) {
      const { data: lectData, error: lectErr } = await supabase
        .from('lectures')
        .select('*, batches(batch_name)')
        .in('batch_id', batchIds)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (lectErr) throw lectErr;
      
      scheduleFeed = lectData.map((l) => ({
        id: l.id,
        batch_id: l.batch_id,
        date: l.date,
        start_time: l.start_time,
        end_time: l.end_time,
        topic: l.topic,
        batch_name: l.batches ? l.batches.batch_name : 'Unknown Batch'
      }));
    }

    // B. Attendance Summary Metrics
    const { data: attRecords, error: attErr } = await supabase
      .from('attendance')
      .select('status')
      .eq('student_id', studentId);

    if (attErr) throw attErr;

    const totalClasses = attRecords ? attRecords.length : 0;
    const presentDays = attRecords ? attRecords.filter((a) => a.status === 'present').length : 0;
    const lateDays = attRecords ? attRecords.filter((a) => a.status === 'late').length : 0;
    const absentDays = attRecords ? attRecords.filter((a) => a.status === 'absent').length : 0;

    const presentTotal = presentDays + lateDays;
    const attendanceRate = totalClasses > 0 ? parseFloat(((presentTotal / totalClasses) * 100).toFixed(1)) : 100.0;

    // C. Financial Ledger Details (fee type records)
    const { data: financeCard, error: finErr } = await supabase
      .from('finances')
      .select('*')
      .eq('user_id', studentId)
      .eq('type', 'fee')
      .neq('status', 'archived')
      .order('due_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (finErr) throw finErr;

    // Convert decimal database return to float if parsed as string
    const finances = financeCard ? {
      id: financeCard.id,
      user_id: financeCard.user_id,
      type: financeCard.type,
      amount_total: parseFloat(financeCard.amount_total),
      amount_paid: parseFloat(financeCard.amount_paid),
      amount_pending: parseFloat(financeCard.amount_pending),
      due_date: financeCard.due_date,
      status: financeCard.status
    } : {
      amount_total: 0.0,
      amount_paid: 0.0,
      amount_pending: 0.0,
      due_date: 'N/A',
      status: 'paid',
    };

    // D. Query student's enrolled batches
    let studentBatches = [];
    if (batchIds.length > 0) {
      const { data: batchData, error: batchErr } = await supabase
        .from('batches')
        .select('id, batch_name, schedule_description, users(name)')
        .in('id', batchIds);
      if (!batchErr) {
        studentBatches = batchData.map((b) => ({
          id: b.id,
          batch_name: b.batch_name,
          schedule_description: b.schedule_description,
          teacher_name: b.users ? b.users.name : 'Unknown'
        }));
      }
    }

    // E. Query saved notifications/notices for the student's batches
    let notifications = [];
    if (batchIds.length > 0) {
      const { data: notifData, error: notifErr } = await supabase
        .from('notifications')
        .select('*, batches(batch_name)')
        .in('batch_id', batchIds)
        .order('created_at', { ascending: false });

      if (!notifErr) {
        notifications = notifData.map((n) => ({
          id: n.id,
          batch_id: n.batch_id,
          batch_name: n.batches ? n.batches.batch_name : 'General',
          message: n.message,
          created_at: n.created_at
        }));
      }
    }

    return res.json({
      scheduleFeed,
      attendance: {
        totalClasses,
        presentDays,
        lateDays,
        absentDays,
        attendanceRate,
      },
      finances,
      batches: studentBatches,
      notifications
    });
  } catch (error) {
    console.error('Error fetching student dashboard assets from Supabase:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve student dashboard details' });
  }
});

// 2. Fetch Student Enrolled Batches
router.get('/batches', async (req, res) => {
  const studentId = req.user.id;
  try {
    const { data: enrolledLinks, error: linkErr } = await supabase
      .from('batch_students')
      .select('batch_id')
      .eq('student_id', studentId);

    if (linkErr) throw linkErr;
    const batchIds = enrolledLinks.map((link) => link.batch_id);

    if (batchIds.length === 0) {
      return res.json([]);
    }

    const { data: batches, error } = await supabase
      .from('batches')
      .select('*')
      .in('id', batchIds)
      .order('batch_name', { ascending: true });

    if (error) throw error;
    return res.json(batches);
  } catch (error) {
    console.error('Error fetching student batches from Supabase:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve batches' });
  }
});

module.exports = router;
