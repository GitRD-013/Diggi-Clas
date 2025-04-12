import { createClient } from '@supabase/supabase-js';

// Environment variables should be defined in a .env file at the project root
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

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