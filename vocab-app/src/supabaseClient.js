import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://jbtlvofxqjcundhsbpcs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpidGx2b2Z4cWpjdW5kaHNicGNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMTM4MjQsImV4cCI6MjA3NDY4OTgyNH0.Kqbny6z3kC3wbjkS6T33zNdqb6zIEfxQNlI8iEf19RQ'
const supabase = createClient(supabaseUrl, process.env.supabaseKey);
