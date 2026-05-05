import { createClient } from "../src/lib/supabase/client";

async function query() {
  const supabase = createClient();
  const { data, error } = await supabase.from('driver_profiles').select('id, user_id').limit(1);
  console.log(data);
}
query();
