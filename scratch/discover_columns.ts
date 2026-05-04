import { createClient } from "../src/lib/supabase/client";

async function discover() {
  const supabase = createClient();
  const { data, error } = await supabase.from('driver_profiles').select('*').limit(1);
  if (error) {
    console.error("Error:", error);
  } else if (data && data.length > 0) {
    console.log("Columns:", Object.keys(data[0]));
  } else {
    console.log("No data found to discover columns.");
  }
}

discover();
