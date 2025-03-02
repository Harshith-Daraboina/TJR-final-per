import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase project URL and anon key
const SUPABASE_URL = "https://kajmbkmfeyyxlqsnvgkd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtham1ia21mZXl5eGxxc252Z2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NjM4NDcsImV4cCI6MjA1NjMzOTg0N30.w949IFjbToLLiJDVz6Oc0I9O6m6Y0aEB-jgPQOj_QuM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);