const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const supabaseUrl = 'https://wmwqzedjuthfdkqwtsog.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtd3F6ZWRqdXRoZmRrcXd0c29nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NTY0NTUsImV4cCI6MjA5NTEzMjQ1NX0.BmaEllQe3nck2C01tRYEHTLAMWC6F4kw-XV5F0N-G4M';

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Supabase client initialized pointing to:', supabaseUrl);

// Seeding function for Cloud database with Mobile Number
const initDb = async () => {
  try {
    // Check if users exist in Supabase
    const { data: users, error } = await supabase.from('users').select('id');
    
    if (error) {
      console.error('Error connecting to Supabase tables:', error.message);
      console.log('💡 Reminder: Ensure you paste the SQL DDL schema script into the Supabase Dashboard SQL Editor!');
      return;
    }

    if (users && users.length > 0) {
      console.log('Cloud Supabase database already has rosters. Skipping seed.');
      return;
    }

    console.log('Seeding initial cloud data rosters into Supabase (using Mobile Numbers)...');

    // Generate unique IDs
    const adminId = crypto.randomUUID();
    const teacherId = crypto.randomUUID();
    const studentId = crypto.randomUUID();
    const studentId2 = crypto.randomUUID();

    const adminHash = await bcrypt.hash('admin123', 10);
    const teacherHash = await bcrypt.hash('teacher123', 10);
    const studentHash = await bcrypt.hash('student123', 10);

    // 1. Seed Users (using mobile_number instead of email)
    await supabase.from('users').insert([
      { id: adminId, name: 'System Admin', mobile_number: '9999999999', password_hash: adminHash, role: 'admin' },
      { id: teacherId, name: 'Prof. Jane Doe', mobile_number: '8888888888', password_hash: teacherHash, role: 'teacher' },
      { id: studentId, name: 'John Smith', mobile_number: '7777777777', password_hash: studentHash, role: 'student' },
      { id: studentId2, name: 'Alice Johnson', mobile_number: '7777777778', password_hash: studentHash, role: 'student' }
    ]);
    console.log('Seeded demo users (mobile numbers) into cloud.');

    // 2. Seed Batch
    const batchId = crypto.randomUUID();
    await supabase.from('batches').insert({
      id: batchId,
      batch_name: 'Advanced Calculus & Algebra',
      teacher_id: teacherId,
      schedule_description: 'Mon & Wed @ 4:00 PM'
    });

    // 3. Link students
    await supabase.from('batch_students').insert([
      { batch_id: batchId, student_id: studentId },
      { batch_id: batchId, student_id: studentId2 }
    ]);
    console.log('Seeded batches & junction links.');

    // 4. Seed Lectures
    const lectureId1 = crypto.randomUUID();
    const lectureId2 = crypto.randomUUID();
    await supabase.from('lectures').insert([
      { id: lectureId1, batch_id: batchId, date: '2026-05-25', start_time: '16:00:00', end_time: '17:30:00', topic: 'Limits & Continuity Intro' },
      { id: lectureId2, batch_id: batchId, date: '2026-05-27', start_time: '16:00:00', end_time: '17:30:00', topic: 'Derivatives & Chain Rule' }
    ]);

    // 5. Seed Attendance
    await supabase.from('attendance').insert([
      { id: crypto.randomUUID(), lecture_id: lectureId1, student_id: studentId, status: 'present' },
      { id: crypto.randomUUID(), lecture_id: lectureId1, student_id: studentId2, status: 'present' },
      { id: crypto.randomUUID(), lecture_id: lectureId2, student_id: studentId, status: 'present' },
      { id: crypto.randomUUID(), lecture_id: lectureId2, student_id: studentId2, status: 'absent' }
    ]);
    console.log('Seeded lectures & attendance records.');

    // 6. Seed Leaves
    await supabase.from('leaves').insert({
      id: crypto.randomUUID(),
      teacher_id: teacherId,
      start_date: '2026-06-01',
      end_date: '2026-06-02',
      reason: 'Attending academic research seminar.',
      status: 'pending'
    });

    // 7. Seed Finances
    await supabase.from('finances').insert([
      { id: crypto.randomUUID(), user_id: studentId, type: 'fee', amount_total: 1200.0, amount_paid: 400.0, amount_pending: 800.0, due_date: '2026-06-15', status: 'pending' },
      { id: crypto.randomUUID(), user_id: studentId2, type: 'fee', amount_total: 1200.0, amount_paid: 1200.0, amount_pending: 0.0, due_date: '2026-05-20', status: 'paid' },
      { id: crypto.randomUUID(), user_id: teacherId, type: 'salary', amount_total: 3500.0, amount_paid: 0.0, amount_pending: 3500.0, due_date: '2026-05-31', status: 'pending' }
    ]);

    console.log('Financial ledger tables populated.');
    console.log('Cloud database seeding finished successfully!');
  } catch (error) {
    console.error('Error seeding Cloud Supabase data:', error.message);
  }
};

// 30-Day automated cycle reset helper
const checkAndRefreshFinances = async () => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Select all active finance records where due_date is in the past
    const { data: records, error } = await supabase
      .from('finances')
      .select('*')
      .lt('due_date', todayStr)
      .neq('status', 'archived');

    if (error) throw error;

    if (records && records.length > 0) {
      for (const r of records) {
        const oldDueDate = new Date(r.due_date);
        const cycleDay = oldDueDate.getUTCDate();
        
        // Calculate the next month's due date on the same cycle day
        let nextYear = oldDueDate.getUTCFullYear();
        let nextMonth = oldDueDate.getUTCMonth() + 1; // Month is 0-indexed, +1 gets next month
        if (nextMonth > 11) {
          nextMonth = 0;
          nextYear += 1;
        }
        
        // Find safe day for next month (e.g., handles February or 30-day months)
        const maxDaysInNextMonth = new Date(Date.UTC(nextYear, nextMonth + 1, 0)).getUTCDate();
        const safeDay = Math.min(cycleDay, maxDaysInNextMonth);
        const newDueDateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`;

        // 1. Insert a NEW separate finance record for the next billing cycle month
        await supabase
          .from('finances')
          .insert({
            id: crypto.randomUUID(),
            user_id: r.user_id,
            type: r.type,
            amount_total: parseFloat(r.amount_total),
            amount_paid: 0.0,
            amount_pending: parseFloat(r.amount_total),
            due_date: newDueDateStr,
            status: 'pending'
          });

        // 2. Archive the old record so it stays separately saved as history
        await supabase
          .from('finances')
          .update({
            status: 'archived'
          })
          .eq('id', r.id);

        console.log(`🔄 Billing Refreshed: Archived finance ID ${r.id}, Created new monthly cycle record with due date ${newDueDateStr}`);
      }
    }
  } catch (err) {
    console.error('Error refreshing finances on cycle:', err.message);
  }
};

module.exports = {
  supabase,
  initDb,
  checkAndRefreshFinances
};
