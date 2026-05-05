import { createClient } from "../src/lib/supabase/client";

async function check() {
  const supabase = createClient();
  const { data, error } = await supabase.from('driver_profiles').select('*');
  if (error) console.error(error);
  else console.log("Profiles count:", data?.length);
  console.log("First profile:", data?.[0]);
}
check();
