const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { supabase } = require('../db');
const { authenticateToken, requireRole } = require('../middleware');

// Apply guards: All routes under /api/teacher require authentication and teacher role
router.use(authenticateToken, requireRole(['teacher']));

// 1. Create a Batch in Supabase
router.post('/batches', async (req, res) => {
  const { batch_name, student_ids } = req.body;
  const teacherId = req.user.id;

  if (!batch_name || !Array.isArray(student_ids) || student_ids.length === 0) {
    return res.status(400).json({ error: 'Batch name and at least one student selection are required' });
  }

  try {
    // Check if batch name already exists in Supabase (case-insensitive)
    const { data: existingBatch } = await supabase
      .from('batches')
      .select('id')
      .ilike('batch_name', batch_name.trim())
      .maybeSingle();

    if (existingBatch) {
      return res.status(400).json({ error: 'A batch with this name already exists. Please choose a unique name.' });
    }

    const batchId = crypto.randomUUID();

    // Insert batch into Supabase
    const { error: batchErr } = await supabase.from('batches').insert({
      id: batchId,
      batch_name,
      teacher_id: teacherId,
      schedule_description: 'Schedule to be defined'
    });

    if (batchErr) throw batchErr;

    // Insert student links
    const BSLinks = student_ids.map((studentId) => ({
      batch_id: batchId,
      student_id: studentId
    }));

    const { error: linkErr } = await supabase.from('batch_students').insert(BSLinks);
    if (linkErr) throw linkErr;

    const wssBroadcast = req.app.get('wssBroadcast');
    if (wssBroadcast) {
      wssBroadcast({
        type: 'NEW_BATCH',
        batchId,
        batchName: batch_name,
        studentIds: student_ids,
        message: `You have been enrolled in a new batch: ${batch_name}.`
      });
    }

    return res.status(201).json({
      message: 'Batch created successfully',
      batch_id: batchId,
      batch_name,
    });
  } catch (error) {
    console.error('Error creating batch in Supabase:', error.message);
    return res.status(500).json({ error: 'Failed to create batch' });
  }
});

// 2. Fetch batches taught by current teacher
router.get('/batches', async (req, res) => {
  const teacherId = req.user.id;
  try {
    const { data: batches, error } = await supabase
      .from('batches')
      .select('id, batch_name, schedule_description')
      .eq('teacher_id', teacherId)
      .order('batch_name', { ascending: true });

    if (error) throw error;

    // Fetch enrolled students for each batch (mapping mobile_number)
    for (const b of batches) {
      const { data: BSData, error: linkErr } = await supabase
        .from('batch_students')
        .select('student_id, users(name, mobile_number)')
        .eq('batch_id', b.id);

      if (linkErr) throw linkErr;

      b.students = BSData.map((link) => ({
        id: link.student_id,
        name: link.users ? link.users.name : 'Unknown',
        mobile_number: link.users ? link.users.mobile_number : 'N/A'
      }));
    }

    return res.json(batches);
  } catch (error) {
    console.error('Error fetching batches from Supabase:', error.message);
    return res.status(500).json({ error: 'Failed to fetch batches' });
  }
});

// 3. Schedule Lecture with WebSocket real-time triggers
router.post('/lectures', async (req, res) => {
  const { batch_id, date, start_time, end_time, topic } = req.body;

  if (!batch_id || !date || !start_time || !end_time || !topic) {
    return res.status(400).json({ error: 'All fields (batch_id, date, start_time, end_time, topic) are required' });
  }

  try {
    const lectureId = crypto.randomUUID();

    const { data: batch, error: getBatchErr } = await supabase
      .from('batches')
      .select('*')
      .eq('id', batch_id)
      .maybeSingle();

    if (getBatchErr || !batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    const { error: insertErr } = await supabase.from('lectures').insert({
      id: lectureId,
      batch_id,
      date,
      start_time: start_time + ':00',
      end_time: end_time + ':00',
      topic
    });

    if (insertErr) throw insertErr;

    const { data: students, error: linkErr } = await supabase
      .from('batch_students')
      .select('student_id')
      .eq('batch_id', batch_id);

    if (linkErr) throw linkErr;
    const studentIds = students.map((s) => s.student_id);

    const alertPayload = {
      type: 'NEW_LECTURE',
      lectureId,
      batchId: batch_id,
      batchName: batch.batch_name,
      date,
      start_time,
      end_time,
      topic,
      studentIds,
    };

    const wssBroadcast = req.app.get('wssBroadcast');
    if (wssBroadcast) {
      wssBroadcast(alertPayload);
    }

    return res.status(201).json({
      message: 'Lecture scheduled successfully',
      lecture: { id: lectureId, batch_id, date, start_time, end_time, topic },
    });
  } catch (error) {
    console.error('Error scheduling lecture in Supabase:', error.message);
    return res.status(500).json({ error: 'Failed to schedule lecture' });
  }
});

// 4. Fetch scheduled lectures
router.get('/lectures', async (req, res) => {
  const { batch_id } = req.query;

  try {
    if (batch_id) {
      const { data, error } = await supabase
        .from('lectures')
        .select('*')
        .eq('batch_id', batch_id)
        .order('date', { ascending: false })
        .order('start_time', { ascending: false });

      if (error) throw error;
      return res.json(data);
    } else {
      const teacherId = req.user.id;
      const { data: batches, error: batchErr } = await supabase
        .from('batches')
        .select('id, batch_name')
        .eq('teacher_id', teacherId);

      if (batchErr) throw batchErr;
      const batchIds = batches.map((b) => b.id);

      if (batchIds.length === 0) {
        return res.json([]);
      }

      const { data, error } = await supabase
        .from('lectures')
        .select('*, batches(batch_name)')
        .in('batch_id', batchIds)
        .order('date', { ascending: false })
        .order('start_time', { ascending: false });

      if (error) throw error;

      const lectures = data.map((l) => ({
        id: l.id,
        batch_id: l.batch_id,
        date: l.date,
        start_time: l.start_time,
        end_time: l.end_time,
        topic: l.topic,
        batch_name: l.batches ? l.batches.batch_name : 'Unknown'
      }));

      return res.json(lectures);
    }
  } catch (error) {
    console.error('Error fetching lectures from Supabase:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve lectures' });
  }
});

// 5. Submit Attendance Records (with override capability)
router.post('/attendance', async (req, res) => {
  const { lecture_id, records } = req.body;

  if (!lecture_id || !Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ error: 'Lecture ID and records checklist are required' });
  }

  try {
    const { error: delErr } = await supabase
      .from('attendance')
      .delete()
      .eq('lecture_id', lecture_id);

    if (delErr) throw delErr;

    const attInserts = records.map((record) => ({
      id: crypto.randomUUID(),
      lecture_id,
      student_id: record.student_id,
      status: record.status
    }));

    const { error: insErr } = await supabase.from('attendance').insert(attInserts);
    if (insErr) throw insErr;

    return res.json({ message: 'Attendance records updated successfully.' });
  } catch (error) {
    console.error('Error registering attendance in Supabase:', error.message);
    return res.status(500).json({ error: 'Failed to save attendance ledger.' });
  }
});

// 6. View Attendance Records for a Lecture
router.get('/attendance', async (req, res) => {
  const { lecture_id } = req.query;

  if (!lecture_id) {
    return res.status(400).json({ error: 'Lecture ID parameter is required' });
  }

  try {
    const { data, error } = await supabase
      .from('attendance')
      .select('*, users(name, mobile_number)')
      .eq('lecture_id', lecture_id);

    if (error) throw error;

    const attendance = data.map((a) => ({
      id: a.id,
      lecture_id: a.lecture_id,
      student_id: a.student_id,
      status: a.status,
      name: a.users ? a.users.name : 'Unknown',
      mobile_number: a.users ? a.users.mobile_number : 'N/A'
    }));

    return res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance from Supabase:', error.message);
    return res.status(500).json({ error: 'Failed to fetch attendance data' });
  }
});

// 7. Batch Notice Broadcast via WebSocket
router.post('/broadcast', async (req, res) => {
  const { batch_id, message_text } = req.body;

  if (!batch_id || !message_text) {
    return res.status(400).json({ error: 'Batch selection and broadcast message text are required' });
  }

  try {
    const { data: batch, error: getBatchErr } = await supabase
      .from('batches')
      .select('*')
      .eq('id', batch_id)
      .maybeSingle();

    if (getBatchErr || !batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    const { data: students, error: linkErr } = await supabase
      .from('batch_students')
      .select('student_id')
      .eq('batch_id', batch_id);

    if (linkErr) throw linkErr;
    const studentIds = students.map((s) => s.student_id);

    // Save notice persistently in database
    const notifId = crypto.randomUUID();
    const { error: notifErr } = await supabase.from('notifications').insert({
      id: notifId,
      batch_id,
      message: message_text
    });
    if (notifErr) throw notifErr;

    const alertPayload = {
      type: 'BROADCAST_NOTICE',
      batchId: batch_id,
      batchName: batch.batch_name,
      message: message_text,
      studentIds,
      timestamp: new Date().toISOString(),
    };

    const wssBroadcast = req.app.get('wssBroadcast');
    if (wssBroadcast) {
      wssBroadcast(alertPayload);
    }

    return res.json({ message: 'Broadcast notice transmitted successfully' });
  } catch (error) {
    console.error('Error broadcasting batch message:', error.message);
    return res.status(500).json({ error: 'Failed to broadcast batch message' });
  }
});

// 8. Submit Leave Request
router.post('/leaves', async (req, res) => {
  const { start_date, end_date, reason } = req.body;
  const teacherId = req.user.id;

  if (!start_date || !end_date || !reason) {
    return res.status(400).json({ error: 'Start date, end date, and reason are required' });
  }

  try {
    const leaveId = crypto.randomUUID();
    const { error } = await supabase.from('leaves').insert({
      id: leaveId,
      teacher_id: teacherId,
      start_date,
      end_date,
      reason,
      status: 'pending'
    });

    if (error) throw error;

    return res.status(201).json({
      message: 'Leave requested successfully. Awaiting admin review.',
      leave_id: leaveId,
    });
  } catch (error) {
    console.error('Error requesting leave in Supabase:', error.message);
    return res.status(500).json({ error: 'Failed to submit leave request' });
  }
});

// 9. Fetch Teacher's requested leaves
router.get('/leaves', async (req, res) => {
  const teacherId = req.user.id;
  try {
    const { data, error } = await supabase
      .from('leaves')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return res.json(data);
  } catch (error) {
    console.error('Error fetching teacher leaves from Supabase:', error.message);
    return res.status(500).json({ error: 'Failed to fetch leaves' });
  }
});

// 10. Fetch all students in alphabetical order for batch selection
router.get('/students', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, mobile_number, role, subject')
      .eq('role', 'student')
      .order('name', { ascending: true });

    if (error) throw error;
    return res.json(data);
  } catch (error) {
    console.error('Error fetching student roster for teacher:', error.message);
    return res.status(500).json({ error: 'Failed to fetch student directory' });
  }
});

// 11. Add a single student to a batch roster
router.post('/batches/:batchId/students', async (req, res) => {
  const { student_id } = req.body;
  const { batchId } = req.params;

  if (!student_id) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  try {
    // Check if already in batch
    const { data: existing } = await supabase
      .from('batch_students')
      .select('*')
      .eq('batch_id', batchId)
      .eq('student_id', student_id)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ error: 'Student is already enrolled in this batch.' });
    }

    const { error } = await supabase
      .from('batch_students')
      .insert({ batch_id: batchId, student_id });

    if (error) throw error;
    
    return res.status(201).json({ message: 'Student successfully added to batch roster.' });
  } catch (error) {
    console.error('Error adding batch student:', error.message);
    return res.status(500).json({ error: 'Failed to add student to batch roster.' });
  }
});

// 12. Remove a student from a batch roster
router.delete('/batches/:batchId/students/:studentId', async (req, res) => {
  const { batchId, studentId } = req.params;

  try {
    const { error } = await supabase
      .from('batch_students')
      .delete()
      .eq('batch_id', batchId)
      .eq('student_id', studentId);

    if (error) throw error;
    
    return res.json({ message: 'Student successfully removed from batch roster.' });
  } catch (error) {
    console.error('Error removing batch student:', error.message);
    return res.status(500).json({ error: 'Failed to remove student from batch roster.' });
  }
});

module.exports = router;
