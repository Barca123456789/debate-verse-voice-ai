
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://btxytgchkxduwconjsgd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0eHl0Z2Noa3hkdXdjb25qc2dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODE2MTgsImV4cCI6MjA2MzA1NzYxOH0.ZTbnlQp1I6QQDJRBjLvTCQozwl1pXYmjaYbZdgmlOPI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
