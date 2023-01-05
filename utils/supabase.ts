import { createClient } from "@supabase/supabase-js";

import type { Database } from "./db_types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!url || !anonKey) {
  throw new Error("Wicked Typescript");
}

const supabase = createClient<Database>(url, anonKey);

export default supabase;
