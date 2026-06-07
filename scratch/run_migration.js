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
      ALTER TABLE public.driver_profiles 
        ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
        ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE,
        ADD COLUMN IF NOT EXISTS subscription_status TEXT,
        ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
        ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;
    `;

    await client.query(query);
    console.log('SQL Migration applied successfully!');
  } catch (err) {
    console.error('Error executing query:', err);
  } finally {
    await client.end();
  }
}

main();
