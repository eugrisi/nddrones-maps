import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jtkttlahkanvjjhufcvm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0a3R0bGFoa2FudmpqaHVmY3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMTM1MzEsImV4cCI6MjA2NzU4OTUzMX0.kQg19MOMHcq2FU-GIpf0NLV-15dgtqHAu6T5IXk4lj4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 