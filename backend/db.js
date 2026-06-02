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
    const { data: users, error } = await supabase.from('users').select('mobile_number');
    
    if (error) {
      console.error('Error connecting to Supabase tables:', error.message);
      console.log('💡 Reminder: Ensure you paste the SQL DDL schema script into the Supabase Dashboard SQL Editor!');
      return;
    }

    const existingMobiles = users ? users.map(u => u.mobile_number) : [];

    const adminHash = await bcrypt.hash('admin123', 10);
    const teacherHash = await bcrypt.hash('teacher123', 10);
    const studentHash = await bcrypt.hash('student123', 10);

    const adminId = crypto.randomUUID();
    const teacherId = crypto.randomUUID();
    const studentId = crypto.randomUUID();
    const studentId2 = crypto.randomUUID();

    // 1. Seed Admin
    if (!existingMobiles.includes('9999999999')) {
      await supabase.from('users').insert({ id: adminId, name: 'System Admin', mobile_number: '9999999999', password_hash: adminHash, role: 'admin' });
      console.log('Seeded demo admin into cloud.');
    }

    // 2. Seed Teacher
    if (!existingMobiles.includes('8888888888')) {
      await supabase.from('users').insert({ id: teacherId, name: 'Prof. Jane Doe', mobile_number: '8888888888', password_hash: teacherHash, role: 'teacher' });
      console.log('Seeded demo teacher into cloud.');

      // Seed a batch for this teacher so the dashboard features are active!
      const batchId = crypto.randomUUID();
      await supabase.from('batches').insert({
        id: batchId,
        batch_name: 'Advanced Calculus & Algebra',
        teacher_id: teacherId,
        schedule_description: 'Mon & Wed @ 4:00 PM'
      });

      // Seed student entries if they don't exist
      if (!existingMobiles.includes('7777777777')) {
        await supabase.from('users').insert({ id: studentId, name: 'John Smith', mobile_number: '7777777777', password_hash: studentHash, role: 'student' });
        await supabase.from('batch_students').insert({ batch_id: batchId, student_id: studentId });
        await supabase.from('finances').insert({ id: crypto.randomUUID(), user_id: studentId, type: 'fee', amount_total: 1200.0, amount_paid: 400.0, amount_pending: 800.0, due_date: '2026-06-15', status: 'pending' });
        console.log('Seeded John Smith student.');
      }
      
      if (!existingMobiles.includes('7777777778')) {
        await supabase.from('users').insert({ id: studentId2, name: 'Alice Johnson', mobile_number: '7777777778', password_hash: studentHash, role: 'student' });
        await supabase.from('batch_students').insert({ batch_id: batchId, student_id: studentId2 });
        console.log('Seeded Alice Johnson student.');
      }

      // Seed finance record for teacher
      await supabase.from('finances').insert({ id: crypto.randomUUID(), user_id: teacherId, type: 'salary', amount_total: 3500.0, amount_paid: 0.0, amount_pending: 3500.0, due_date: '2026-05-31', status: 'pending' });
    }

    console.log('Cloud database validation and seeding finished successfully!');

    // Migrate chat_messages table: add file upload columns if missing
    try {
      // Try to add file columns via a safe DO block through rpc
      const { error: migErr } = await supabase.rpc('run_sql', {
        query: `
          ALTER TABLE chat_messages 
            ADD COLUMN IF NOT EXISTS file_data TEXT,
            ADD COLUMN IF NOT EXISTS file_name TEXT,
            ADD COLUMN IF NOT EXISTS file_type TEXT;
        `
      });
      if (migErr) {
        // rpc may not be available; that's okay, the backend will use memory fallback for file messages
        console.warn('Note: Could not auto-migrate chat_messages columns (expected if RPC not enabled). Please run in Supabase SQL editor:\n  ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS file_data TEXT, ADD COLUMN IF NOT EXISTS file_name TEXT, ADD COLUMN IF NOT EXISTS file_type TEXT;');
      } else {
        console.log('chat_messages file columns ensured.');
      }
    } catch (migError) {
      console.warn('Migration check skipped:', migError.message);
    }

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
