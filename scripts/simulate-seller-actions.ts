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
// Use Anon Key to simulate Client-Side login
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) process.exit(1);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const email = 'bathoensescob@gmail.com';
  const password = 'Hawdybitch@123';

  console.log(`\n🔐 Logging in as ${email}...`);

  const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (loginError) {
    console.error('❌ Login failed:', loginError.message);
    process.exit(1);
  }

  console.log('✅ Login successful.');
  console.log('   User ID:', session?.user.id);

  // Get Vendor ID
  const { data: vendor } = await supabase
    .from('vendors')
    .select('id, name')
    .eq('owner_id', session?.user.id)
    .single();

  if (!vendor) {
    console.error('❌ No vendor profile found for this user.');
    process.exit(1);
  }
  console.log(`✅ Found Vendor: ${vendor.name} (${vendor.id})`);

  // Create Product
  console.log('\n📦 Creating a new product...');
  const productPayload = {
    title: 'Vintage Leather Jacket',
    description: 'Genuine leather, 90s style, great condition.',
    price: 1200,
    category: 'Clothing',
    condition: 'Good',
    sizes: ['L', 'XL'],
    image_urls: ['https://picsum.photos/seed/jacket/600/600'],
    vendor_id: vendor.id
  };

  const { data: product, error: createError } = await supabase
    .from('products')
    .insert(productPayload)
    .select()
    .single();

  if (createError) {
    console.error('❌ Failed to create product:', createError.message);
    process.exit(1);
  }

  console.log('✅ Product created successfully!');
  console.log(product);

  console.log('\n✨ Simulation complete. You can now login in the browser to see this product.');
}

main();
