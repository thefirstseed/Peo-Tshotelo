import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const paths = [path.resolve(__dirname, '../.env'), path.resolve(__dirname, '../.env.local')];
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
// Need service role key to CREATE USER directly (bypasses rate limits sometimes)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdXN4ZW9ieW1jb3RzYXJ6aG16Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTk2NzczMywiZXhwIjoyMDg1NTQzNzMzfQ.8HZC5WH2dKQLG66dL2mUg-aX_-0Q3U_4i8BWjlMRH2c';

if (!supabaseUrl || !serviceRoleKey) process.exit(1);

const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  // Use a unique email timestamp to avoid conflicts/rate limits if re-running quickly
  const timestamp = Date.now().toString().slice(-4);
  const email = `buyer${timestamp}@kulture.com`;
  const password = 'Password@123';
  const fullName = 'Kulture Buyer';

  console.log(`\n👤 Creating Buyer Account (Admin Mode): ${email}...`);

  // 1. Create User via Admin API (Auto-confirms by default usually)
  const { data, error } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
        full_name: fullName,
        role: 'buyer'
    }
  });

  if (error) {
    console.error('❌ Creation failed:', error.message);
    process.exit(1);
  }

  console.log('✅ Account created & confirmed.');
  console.log(`\n🎉 Buyer ready! Login with:\n   Email: ${email}\n   Password: ${password}`);
}

main();
