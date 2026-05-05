import { createClient } from "../src/lib/supabase/client";

async function check() {
  const supabase = createClient();
  const { data, error } = await supabase.from('push_subscriptions').select('*, driver_profiles(full_name)').order('created_at', { ascending: false }).limit(3);
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}
check();
