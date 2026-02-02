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
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdXN4ZW9ieW1jb3RzYXJ6aG16Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTk2NzczMywiZXhwIjoyMDg1NTQzNzMzfQ.8HZC5WH2dKQLG66dL2mUg-aX_-0Q3U_4i8BWjlMRH2c';

if (!supabaseUrl || !serviceRoleKey) process.exit(1);

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  const email = 'bathoensescob@gmail.com';
  console.log(`Checking status for ${email}...`);

  // 1. Get Auth User
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    console.log('❌ User not found in Auth.');
    return;
  }
  console.log(`✅ Auth User found: ${user.id}`);

  // 2. Get Profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  console.log('Profile:', profile);

  if (profile?.role !== 'seller') {
    console.log('⚠️ User is not a seller. Upgrading...');
    await supabase.from('profiles').update({ role: 'seller' }).eq('id', user.id);
    console.log('✅ User upgraded to Seller.');
  }

  // 3. Get Vendor
  const { data: vendor } = await supabase.from('vendors').select('*').eq('owner_id', user.id).single();
  if (!vendor) {
    console.log('⚠️ No vendor profile found. Creating default vendor...');
    const { data: newVendor, error } = await supabase.from('vendors').insert({
      owner_id: user.id,
      name: "Bathoen's Boutique",
      description: "Default vendor created via script.",
      location: "Gaborone",
      verified: true
    }).select().single();
    
    if (error) console.error('Error creating vendor:', error);
    else console.log('✅ Vendor created:', newVendor);
  } else {
    console.log('✅ Vendor profile exists:', vendor.name);
  }
}

main();
