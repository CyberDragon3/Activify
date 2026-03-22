// shared/supabase.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://uoetcnbpvgovjqnvpvtz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZXRjbmJwdmdvdmpxbnZwdnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMjk1MDAsImV4cCI6MjA4OTcwNTUwMH0.064TFKLxXCCRZPmJEK47O_QiRcxllJA2Bjx6TxdSNsY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);