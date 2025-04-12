import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Class {
  id: string;
  name: string;
  fee: number;
  notes?: string;
}

interface ClassContextType {
  classes: Class[];
  addClass: (newClass: Omit<Class, 'id'>) => void;
  updateClass: (updatedClass: Class) => void;
  deleteClass: (id: string) => void;
  getClassById: (id: string) => Class | undefined;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

interface ClassProviderProps {
  children: ReactNode;
}

export const ClassProvider: React.FC<ClassProviderProps> = ({ children }) => {
  // Initialize with some example classes or fetch from localStorage if available
  const [classes, setClasses] = useState<Class[]>(() => {
    const savedClasses = localStorage.getItem('classes');
    return savedClasses 
      ? JSON.parse(savedClasses) 
      : [
          { id: '1', name: 'Class 6', fee: 5000, notes: 'Regular academic class with all subjects' },
          { id: '2', name: 'Class 7', fee: 5500, notes: 'Includes computer lab sessions' },
          { id: '3', name: 'Class 8', fee: 6000, notes: 'Includes science lab practicals' },
          { id: '4', name: 'Class 9', fee: 6500, notes: 'Board exam preparation included' },
          { id: '5', name: 'Class 10', fee: 7000, notes: 'Intensive board exam preparation' },
          { id: '6', name: 'Spoken English', fee: 3000, notes: 'Conversational English with native speakers' },
          { id: '7', name: 'Math Tuition', fee: 2500, notes: 'Focus on problem-solving techniques' },
        ];
  });

  // Save to localStorage whenever classes change
  useEffect(() => {
    localStorage.setItem('classes', JSON.stringify(classes));
  }, [classes]);

  const addClass = (newClass: Omit<Class, 'id'>) => {
    const id = Date.now().toString();
    setClasses(prevClasses => [...prevClasses, { ...newClass, id }]);
  };

  const updateClass = (updatedClass: Class) => {
    setClasses(prevClasses => 
      prevClasses.map(cls => 
        cls.id === updatedClass.id ? updatedClass : cls
      )
    );
  };

  const deleteClass = (id: string) => {
    setClasses(prevClasses => prevClasses.filter(cls => cls.id !== id));
  };

  const getClassById = (id: string) => {
    return classes.find(cls => cls.id === id);
  };

  return (
    <ClassContext.Provider value={{ 
      classes, 
      addClass, 
      updateClass, 
      deleteClass,
      getClassById
    }}>
      {children}
    </ClassContext.Provider>
  );
};

export const useClasses = (): ClassContextType => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error('useClasses must be used within a ClassProvider');
  }
  return context;
}; 