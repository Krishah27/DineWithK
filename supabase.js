import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://qjbypiddsvzgjkisagpg.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqYnlwaWRkc3Z6Z2praXNhZ3BnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MTMwOTgsImV4cCI6MjA5MDA4OTA5OH0.Mr2PsiyaqiWOHuxY0jQ_FnM6oi-YqbksyqAjAnKZ8Rw"

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase