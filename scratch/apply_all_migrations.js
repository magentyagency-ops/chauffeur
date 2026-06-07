const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:Redpillnira13!@db.ipakdwhkgzsibzritghw.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
});

async function main() {
  try {
    await client.connect();
    console.log('Connected to Supabase database.');

    const filesToRun = [
      'supabase/migrations/002_sprint6_bookings.sql',
      'supabase/migrations/003_push_notifications.sql',
      'supabase/migrations/004_add_profile_photo_url.sql',
      '005_add_whatsapp_column.sql',
      '006_create_submit_booking_rpc.sql'
    ];

    for (const file of filesToRun) {
      const filePath = path.join(__dirname, '..', file);
      if (fs.existsSync(filePath)) {
        console.log(`Running ${file}...`);
        const sql = fs.readFileSync(filePath, 'utf8');
        await client.query(sql);
        console.log(`Successfully applied ${file}.`);
      } else {
        console.log(`File not found: ${file}`);
      }
    }

  } catch (err) {
    console.error('Error executing query:', err);
  } finally {
    await client.end();
  }
}

main();
