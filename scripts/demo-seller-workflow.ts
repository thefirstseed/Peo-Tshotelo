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
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) process.exit(1);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const email = 'bathoensescob@gmail.com';
  const password = 'Hawdybitch@123';

  console.log(`\n🚀 Starting Full Seller Workflow Demo for ${email}...\n`);

  // --- 1. Login ---
  console.log('1️⃣  Logging in...');
  const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (loginError) {
    console.error('   ❌ Login failed:', loginError.message);
    process.exit(1);
  }
  console.log('   ✅ Login successful.');

  // Get Vendor
  const { data: vendor } = await supabase
    .from('vendors')
    .select('id, name')
    .eq('owner_id', session?.user.id)
    .single();

  if (!vendor) {
    console.error('   ❌ No vendor found.');
    process.exit(1);
  }
  console.log(`   ✅ Acting as Vendor: "${vendor.name}"`);


  // --- 2. Create Product ---
  console.log('\n2️⃣  Creating "Summer Vibes T-Shirt"...');
  const { data: product, error: createError } = await supabase
    .from('products')
    .insert({
        title: 'Summer Vibes T-Shirt',
        description: 'Limited edition cotton tee.',
        price: 250,
        category: 'Clothing',
        condition: 'New',
        sizes: ['M', 'L'],
        image_urls: ['https://picsum.photos/seed/tee/600/600'],
        vendor_id: vendor.id
    })
    .select()
    .single();

  if (createError) {
    console.error('   ❌ Create failed:', createError.message);
    process.exit(1);
  }
  console.log(`   ✅ Created Product ID: ${product.id}`);


  // --- 3. Update Product ---
  console.log('\n3️⃣  Updating Price to 300...');
  const { data: updatedProduct, error: updateError } = await supabase
    .from('products')
    .update({ price: 300, title: 'Summer Vibes T-Shirt (On Sale)' })
    .eq('id', product.id)
    .select()
    .single();

  if (updateError) {
    console.error('   ❌ Update failed:', updateError.message);
  } else {
    console.log(`   ✅ Updated: "${updatedProduct.title}" is now P${updatedProduct.price}`);
  }


  // --- 4. Create & Delete (Clean up test) ---
  console.log('\n4️⃣  Testing Deletion (Creating temporary item)...');
  const { data: tempItem } = await supabase
    .from('products')
    .insert({
        title: 'To Be Deleted',
        description: 'Goodbye world',
        price: 1,
        vendor_id: vendor.id
    })
    .select()
    .single();
    
  console.log(`   ✅ Created Temp Item: ${tempItem.id}`);
  
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .eq('id', tempItem.id);

  if (deleteError) {
    console.error('   ❌ Delete failed:', deleteError.message);
  } else {
    console.log('   ✅ Deleted Temp Item successfully.');
  }


  // --- 5. Verify Final Inventory ---
  console.log('\n5️⃣  Verifying Final Inventory...');
  const { data: inventory } = await supabase
    .from('products')
    .select('title, price')
    .eq('vendor_id', vendor.id);

  console.log('   Current Shop Inventory:');
  inventory?.forEach(p => console.log(`   - ${p.title} (P${p.price})`));

  console.log('\n✨ Demo Complete! Functionalities verified: Login, Create, Update, Delete, Read.');
}

main();
