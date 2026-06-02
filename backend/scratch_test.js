const { supabase } = require('./db');
const bcrypt = require('bcryptjs');

async function test() {
  console.log('Fetching user 8888888888 from Supabase...');
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('mobile_number', '8888888888')
    .maybeSingle();

  if (error) {
    console.error('Database lookup error:', error.message);
    return;
  }

  if (!user) {
    console.log('❌ User 8888888888 not found in database!');
    return;
  }

  console.log('Found user:', user.name);
  console.log('Stored Hash:', user.password_hash);

  const isMatch = await bcrypt.compare('teacher123', user.password_hash);
  console.log('Does "teacher123" match stored hash?', isMatch ? '✅ YES' : '❌ NO');

  const generatedHash = await bcrypt.hash('teacher123', 10);
  console.log('Newly generated hash for "teacher123":', generatedHash);
}

test();
