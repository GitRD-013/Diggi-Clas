# DiggiClass Supabase Integration

This guide explains how to set up Supabase as the backend for DiggiClass application.

## Setup Instructions

### 1. Create a Supabase Account and Project

1. Go to [https://supabase.com/](https://supabase.com/) and sign up for an account
2. Create a new project
3. Note your project URL and anon/public API key

### 2. Configure Environment Variables

1. Create or update the `.env.local` file in the root of your project:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase project URL and anon key.

### 3. Create Database Tables

Set up the following tables in your Supabase database:

#### Students Table
```sql
CREATE TABLE public.students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  roll_number TEXT UNIQUE NOT NULL,
  class_id UUID REFERENCES public.classes(id),
  profile_image_url TEXT
);
```

#### Classes Table
```sql
CREATE TABLE public.classes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  name TEXT NOT NULL,
  section TEXT,
  teacher_id UUID REFERENCES public.teachers(id)
);
```

#### Teachers Table
```sql
CREATE TABLE public.teachers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  subject TEXT,
  profile_image_url TEXT
);
```

#### Attendance Table
```sql
CREATE TABLE public.attendance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  student_id UUID REFERENCES public.students(id) NOT NULL,
  class_id UUID REFERENCES public.classes(id) NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late'))
);
```

#### Exams Table
```sql
CREATE TABLE public.exams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  name TEXT NOT NULL,
  class_id UUID REFERENCES public.classes(id) NOT NULL,
  date DATE NOT NULL,
  max_marks INTEGER NOT NULL
);
```

#### Exam Results Table
```sql
CREATE TABLE public.exam_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  exam_id UUID REFERENCES public.exams(id) NOT NULL,
  student_id UUID REFERENCES public.students(id) NOT NULL,
  subject_id TEXT NOT NULL,
  marks_obtained NUMERIC(5, 2) NOT NULL
);
```

### 4. Set Up Row Level Security (RLS)

For each table, enable Row Level Security and create policies to ensure data security:

```sql
-- Example for students table
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own students"
  ON public.students
  FOR SELECT
  USING (auth.uid() IN (
    SELECT teacher_id FROM public.classes WHERE id = class_id
  ));
```

Repeat similar policies for each table as needed.

### 5. Set Up Authentication

Configure authentication in your Supabase dashboard:

1. Go to Authentication → Settings
2. Set up Site URL (your application's URL)
3. Configure email templates for confirmation, magic links, etc.
4. Optionally enable additional authentication providers (Google, GitHub, etc.)

## Using the Auth and Data Services

The following utility files have been created to help you interact with Supabase:

- `src/lib/supabase.ts` - Main Supabase client configuration and type definitions
- `src/services/authService.ts` - Authentication-related functions
- `src/services/dataService.ts` - Data fetching and manipulation functions
- `src/contexts/AuthContext.tsx` - React Context for authentication state management
- `src/components/ProtectedRoute.tsx` - Route protection component

### Example Usage

#### Authentication

```jsx
import { useAuth } from '../contexts/AuthContext';

function LoginForm() {
  const { signIn } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    if (error) {
      // Handle error
    } else {
      // Redirect to dashboard
    }
  };
  
  // Rest of your form component
}
```

#### Fetching Data

```jsx
import { fetchData } from '../services/dataService';

async function getStudents() {
  const { data, error } = await fetchData('students', {
    filters: { class_id: 'your-class-id' },
    orderBy: { column: 'first_name', ascending: true },
    limit: 20,
    page: 1
  });
  
  if (error) {
    console.error('Error fetching students:', error);
    return [];
  }
  
  return data;
}
```

## Deploying to Production

When deploying to production, ensure:

1. Create a proper `.env.production` file with your production Supabase credentials
2. Set up proper RLS policies for production data
3. Configure CORS in your Supabase project to only allow your application domain
4. Set up proper redirects for authentication flows

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth) 