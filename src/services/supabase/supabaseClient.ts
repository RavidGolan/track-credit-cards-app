import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://viutydvbuzsavjcniayx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpdXR5ZHZidXpzYXZqY25pYXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMjU2ODUsImV4cCI6MjA2MjcwMTY4NX0.48hy1FdOs5O2jx6LhLsdui1r4CFjk22Mvpb2Lp480Ns'; // public client key
export const supabase = createClient(supabaseUrl, supabaseKey);
