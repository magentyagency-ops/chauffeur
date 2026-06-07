const { Client } = require('pg');

const connectionString = 'postgresql://postgres:Redpillnira13!@db.ipakdwhkgzsibzritghw.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
});

async function main() {
  try {
    await client.connect();
    console.log('Connected to Supabase database.');

    const query = `
      -- Drop the insecure public policy
      DROP POLICY IF EXISTS "Public can read bookings" ON public.bookings;
      
      -- Re-create the secure policy for drivers to read their own bookings
      DROP POLICY IF EXISTS "Drivers see own bookings" ON public.bookings;
      CREATE POLICY "Drivers see own bookings" ON public.bookings
        FOR SELECT USING (driver_id = auth.uid());
    `;

    await client.query(query);
    console.log('SQL Migration applied successfully! Security vulnerability patched.');
  } catch (err) {
    console.error('Error executing query:', err);
  } finally {
    await client.end();
  }
}

main();
