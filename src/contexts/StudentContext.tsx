import { createContext, useContext, useState, ReactNode } from 'react';

interface Student {
  id: string;
  name: string;
  classId: string;
  joiningDate: string;
  fee: number;
  profileImage?: string;
  imageUrl?: string;  // For compatibility with existing code
  email?: string;
  phoneNumber?: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  rollNumber?: string;
}

interface StudentContextType {
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (id: string) => Student | undefined;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};

interface StudentProviderProps {
  children: ReactNode;
}

export const StudentProvider = ({ children }: StudentProviderProps) => {
  // Mock initial data - replace with actual data fetching in production
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'John Doe',
      classId: '1', // Class 6
      joiningDate: '2023-01-15',
      fee: 1500,
      profileImage: 'https://i.pravatar.cc/150?img=1',
      email: 'john.doe@example.com',
      phoneNumber: '9876543210',
      parentName: 'Michael Doe',
      parentPhone: '9876543211',
      address: '123 Main St, City',
      gender: 'male',
      dateOfBirth: '2010-05-15',
      rollNumber: 'A001',
    },
    {
      id: '2',
      name: 'Jane Smith',
      classId: '2', // Class 7
      joiningDate: '2023-02-20',
      fee: 1500,
      profileImage: 'https://i.pravatar.cc/150?img=2',
      email: 'jane.smith@example.com',
      phoneNumber: '9876543212',
      parentName: 'Sarah Smith',
      parentPhone: '9876543213',
      address: '456 Oak St, City',
      gender: 'female',
      dateOfBirth: '2009-08-22',
      rollNumber: 'A002',
    },
  ]);

  const addStudent = (newStudent: Omit<Student, 'id'>) => {
    setStudents(prev => [...prev, { ...newStudent, id: Date.now().toString() }]);
  };

  const updateStudent = (id: string, updatedFields: Partial<Student>) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id ? { ...student, ...updatedFields } : student
      )
    );
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const getStudentById = (id: string) => {
    return students.find(student => student.id === id);
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudentById,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export default StudentProvider; 