import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
// Load environment variables from .env or .env.local
function loadEnv() {
  const paths = [
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../.env.local')
  ];
  
  paths.forEach(p => {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf-8');
      content.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^["']|["']$/g, '');
          if (!process.env[key]) process.env[key] = value;
        }
      });
    }
  });
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// CRITICAL: This key is required for deleting users. It is usually NOT in your client .env.
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdXN4ZW9ieW1jb3RzYXJ6aG16Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTk2NzczMywiZXhwIjoyMDg1NTQzNzMzfQ.8HZC5WH2dKQLG66dL2mUg-aX_-0Q3U_4i8BWjlMRH2c';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('\n❌ Error: Missing configuration.');
  console.error('   Ensure VITE_SUPABASE_URL is set.');
  console.error('   Ensure SUPABASE_SERVICE_ROLE_KEY is set (required for admin operations).');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  console.log('🔄 Disabling email confirmation for all users...');

  // 1. List all users
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('❌ Failed to list users:', listError.message);
    process.exit(1);
  }

  if (!users || users.length === 0) {
    console.log('✅ No users found.');
    process.exit(0);
  }

  console.log(`Found ${users.length} users. Checking confirmation status...`);

  for (const user of users) {
    if (!user.email_confirmed_at) {
        console.log(`\nConfirming user: ${user.email} (${user.id})`);
        
        // Update user to confirm email manually
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            user.id,
            { email_confirm: true }
        );

        if (updateError) {
            console.error('   ❌ Failed to confirm user:', updateError.message);
        } else {
            console.log(`   ✅ User confirmed.`);
        }
    } else {
        // console.log(`   - User ${user.email} already confirmed.`);
    }
  }

  console.log('\n✅ All users processed.');
}

main().catch(console.error);
