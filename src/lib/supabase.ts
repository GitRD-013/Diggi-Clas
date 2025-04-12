import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://yfcoybolivatpllfzubr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmY295Ym9saXZhdHBsbGZ6dWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTM3NDQsImV4cCI6MjA2MDAyOTc0NH0.okDkn1ixZ2HPmArXZy6--Dv29C_73lhtxAV11V3kZI0';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for your database tables
export type Tables = {
  students: {
    id: string;
    created_at: string;
    first_name: string;
    last_name: string;
    email: string;
    roll_number: string;
    class_id: string;
    profile_image_url?: string;
  };
  classes: {
    id: string;
    created_at: string;
    name: string;
    section: string;
    teacher_id: string;
  };
  teachers: {
    id: string;
    created_at: string;
    first_name: string;
    last_name: string;
    email: string;
    subject: string;
    profile_image_url?: string;
  };
  attendance: {
    id: string;
    created_at: string;
    student_id: string;
    class_id: string;
    date: string;
    status: 'present' | 'absent' | 'late';
  };
  exams: {
    id: string;
    created_at: string;
    name: string;
    class_id: string;
    date: string;
    max_marks: number;
  };
  exam_results: {
    id: string;
    created_at: string;
    exam_id: string;
    student_id: string;
    subject_id: string;
    marks_obtained: number;
  };
}; 