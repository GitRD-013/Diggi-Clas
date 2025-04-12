import supabase from '../config/supabaseClients';

// Generic fetch function with filtering, pagination, and sorting
export const fetchData = async <T extends any>(
  table: string,
  options?: {
    select?: string;
    filters?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    page?: number;
  }
) => {
  const select = options?.select || '*';
  let query = supabase.from(table).select(select);

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

// Insert a new record
export const insertRecord = async <T extends any>(
  table: string,
  record: T
) => {
  const { data, error } = await supabase
    .from(table)
    .insert(record)
    .select();
  
  return { data, error };
};

// Update an existing record
export const updateRecord = async <T extends any>(
  table: string,
  id: string | number,
  updates: Partial<T>
) => {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id)
    .select();
  
  return { data, error };
};

// Delete a record
export const deleteRecord = async (
  table: string,
  id: string | number
) => {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);
  
  return { error };
};

// Get a record by ID
export const getRecordById = async (
  table: string,
  id: string | number,
  select: string = '*'
) => {
  const { data, error } = await supabase
    .from(table)
    .select(select)
    .eq('id', id)
    .single();
  
  return { data, error };
}; 