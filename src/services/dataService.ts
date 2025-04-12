import { supabase } from '../lib/supabase';
import { Tables } from '../lib/supabase';

// Generic function to fetch data from any table
export const fetchData = async <T extends keyof Tables>(
  table: T,
  options?: {
    filters?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    page?: number;
  }
) => {
  let query = supabase.from(table).select('*');

  // Apply filters
  if (options?.filters) {
    for (const [key, value] of Object.entries(options.filters)) {
      query = query.eq(key, value);
    }
  }

  // Apply ordering
  if (options?.orderBy) {
    const { column, ascending = true } = options.orderBy;
    query = query.order(column, { ascending });
  }

  // Apply pagination
  if (options?.limit) {
    query = query.limit(options.limit);
    if (options.page && options.page > 1) {
      const offset = (options.page - 1) * options.limit;
      query = query.range(offset, offset + options.limit - 1);
    }
  }

  const { data, error } = await query;
  return { data, error };
};

// Generic function to fetch a single record by ID
export const fetchById = async <T extends keyof Tables>(
  table: T,
  id: string
) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();
  
  return { data, error };
};

// Generic function to insert data
export const insertData = async <T extends keyof Tables>(
  table: T,
  data: Partial<Tables[T]>
) => {
  const { data: responseData, error } = await supabase
    .from(table)
    .insert(data)
    .select();
  
  return { data: responseData, error };
};

// Generic function to update data
export const updateData = async <T extends keyof Tables>(
  table: T,
  id: string,
  data: Partial<Tables[T]>
) => {
  const { data: responseData, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select();
  
  return { data: responseData, error };
};

// Generic function to delete data
export const deleteData = async <T extends keyof Tables>(
  table: T,
  id: string
) => {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);
  
  return { error };
};

// Function to fetch students with their class info
export const fetchStudentsWithClass = async () => {
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      classes (
        id,
        name,
        section
      )
    `);
  
  return { data, error };
};

// Function to fetch attendance for a specific class and date
export const fetchAttendanceByClassAndDate = async (
  classId: string,
  date: string
) => {
  const { data, error } = await supabase
    .from('attendance')
    .select(`
      *,
      students (
        id,
        first_name,
        last_name,
        roll_number
      )
    `)
    .eq('class_id', classId)
    .eq('date', date);
  
  return { data, error };
};

// Function to fetch exam results for a student
export const fetchExamResultsByStudent = async (studentId: string) => {
  const { data, error } = await supabase
    .from('exam_results')
    .select(`
      *,
      exams (
        id,
        name,
        date,
        max_marks
      )
    `)
    .eq('student_id', studentId);
  
  return { data, error };
}; 