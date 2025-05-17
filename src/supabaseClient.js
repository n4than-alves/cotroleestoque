import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wfxykowuxnajlleprpni.supabase.co"; // seu endpoint Supabase
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmeHlrb3d1eG5hamxsZXBycG5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMjczMTksImV4cCI6MjA2MjkwMzMxOX0.G5pIWzgcKRH2PzdrnivhQX3iz4-1L3zZvtXr00Q6dpY";

export const supabase = createClient(supabaseUrl, supabaseKey);
