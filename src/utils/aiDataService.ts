import { StudentProvider, useStudents } from '../contexts/StudentContext';
import { useClasses } from '../contexts/ClassContext';

// Types for the data structure that will be sent to AI
export interface AIContextData {
  students: StudentData[];
  fees: FeeData[];
  attendance: AttendanceData[];
  performance: PerformanceData[];
  summary: {
    totalStudents: number;
    totalFeesPending: number;
    averageAttendance: number;
    averagePerformance: number;
  };
}

interface StudentData {
  id: string;
  name: string;
  classId: string;
  className?: string;
  age?: string;
  fatherName?: string;
  mobile?: string;
  address?: string;
  joiningDate: string;
  fee: number;
  feeStatus?: 'paid' | 'unpaid' | 'partial';
  profileImage?: string;
}

interface FeeData {
  studentId: string;
  studentName: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'partial';
  dueDate?: string;
  lastPaymentDate?: string;
}

interface AttendanceData {
  studentId: string;
  studentName: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  percentage?: number;
}

interface PerformanceData {
  studentId: string;
  studentName: string;
  examName?: string;
  subject?: string;
  marks?: number;
  totalMarks?: number;
  grade?: string;
  rank?: number;
  performanceLevel?: 'high' | 'medium' | 'low';
}

/**
 * Fetches and formats all relevant data for AI context
 * @param userId User ID (currently not used as we're using mock data)
 * @returns Structured data object with all contextual information
 */
export async function getUserDataForAI(userId?: string): Promise<AIContextData> {
  // In a real application, this would make API calls or database queries
  // For now, we'll use the mock data that's already in the application

  // This would normally be a direct database call
  // But for our implementation, we'll get data from the existing state
  const { students } = await getMockStudentData();
  const { classes } = await getMockClassData();
  
  // Enrich student data with class names
  const enrichedStudents = students.map(student => ({
    ...student,
    className: classes.find(c => c.id === student.classId)?.name || 'Unknown Class'
  }));

  // Mock fee data based on students
  const fees = enrichedStudents.map(student => ({
    studentId: student.id,
    studentName: student.name,
    amount: student.fee,
    status: student.feeStatus as 'paid' | 'unpaid' | 'partial',
    dueDate: '2023-04-30',
    lastPaymentDate: student.feeStatus === 'paid' ? '2023-04-15' : undefined
  }));

  // Mock attendance data
  const attendance = enrichedStudents.map(student => {
    let status: 'present' | 'absent' | 'late';
    if (student.attendanceStatus === 'regular') {
      status = 'present';
    } else if (student.attendanceStatus === 'irregular') {
      status = 'late';
    } else {
      status = 'absent';
    }
    
    return {
      studentId: student.id,
      studentName: student.name,
      date: '2023-04-20',
      status,
      percentage: student.attendancePercentage || 
                (status === 'present' ? 95 : 
                 status === 'late' ? 80 : 65)
    };
  });

  // Mock performance data
  const performance = enrichedStudents.map(student => ({
    studentId: student.id,
    studentName: student.name,
    examName: 'Mid-Term Examination',
    subject: 'Mathematics',
    marks: student.performanceScore || 
           (student.performanceLevel === 'high' ? 90 : 
            student.performanceLevel === 'medium' ? 75 : 50),
    totalMarks: 100,
    grade: student.performanceLevel === 'high' ? 'A' : 
           student.performanceLevel === 'medium' ? 'B' : 'C',
    performanceLevel: student.performanceLevel
  }));

  // Generate summary statistics
  const totalStudents = students.length;
  const totalFeesPending = fees.filter(fee => fee.status !== 'paid').reduce((sum, fee) => sum + fee.amount, 0);
  const averageAttendance = attendance.reduce((sum, att) => sum + (att.percentage || 0), 0) / attendance.length;
  const averagePerformance = performance.reduce((sum, perf) => sum + (perf.marks || 0), 0) / performance.length;

  return {
    students: enrichedStudents,
    fees,
    attendance,
    performance,
    summary: {
      totalStudents,
      totalFeesPending,
      averageAttendance,
      averagePerformance
    }
  };
}

/**
 * Helper function to get mock student data
 * In a real application, this would be an API call
 */
async function getMockStudentData() {
  // These would be fetched from a real database in production
  const students = [
    {
      id: '1',
      name: 'John Doe',
      age: '15',
      fatherName: 'Robert Doe',
      mobile: '9876543210',
      address: '123 Main St, City',
      joiningDate: '2023-01-15',
      classId: '4',
      fee: 6500,
      imageUrl: '',
      feeStatus: 'paid' as 'paid' | 'unpaid' | 'partial',
      performanceLevel: 'high' as 'high' | 'medium' | 'low',
      attendanceStatus: 'regular',
      lastAttendanceDate: '2023-06-15',
      performanceScore: 92,
      attendancePercentage: 95,
      createdAt: '2023-01-15T10:30:00',
    },
    {
      id: '2',
      name: 'Jane Smith',
      age: '14',
      fatherName: 'David Smith',
      mobile: '8765432109',
      address: '456 Park Ave, Town',
      joiningDate: '2023-02-20',
      classId: '3',
      fee: 6000,
      imageUrl: '',
      feeStatus: 'unpaid' as 'paid' | 'unpaid' | 'partial',
      performanceLevel: 'medium' as 'high' | 'medium' | 'low',
      attendanceStatus: 'irregular',
      lastAttendanceDate: '2023-06-10',
      performanceScore: 75,
      attendancePercentage: 80,
      createdAt: '2023-02-20T14:15:00',
    },
    {
      id: '3',
      name: 'Michael Johnson',
      age: '16',
      fatherName: 'James Johnson',
      mobile: '7654321098',
      address: '789 Oak St, Village',
      joiningDate: '2023-03-10',
      classId: '5',
      fee: 7000,
      imageUrl: '',
      feeStatus: 'partial' as 'paid' | 'unpaid' | 'partial',
      performanceLevel: 'low' as 'high' | 'medium' | 'low',
      attendanceStatus: 'frequently-absent',
      lastAttendanceDate: '2023-06-05',
      performanceScore: 45,
      attendancePercentage: 65,
      createdAt: '2023-03-10T09:45:00',
    },
    {
      id: '4',
      name: 'Emily Davis',
      age: '13',
      fatherName: 'William Davis',
      mobile: '6543210987',
      address: '321 Pine St, City',
      joiningDate: '2023-04-05',
      classId: '2',
      fee: 5500,
      imageUrl: '',
      feeStatus: 'paid' as 'paid' | 'unpaid' | 'partial',
      performanceLevel: 'high' as 'high' | 'medium' | 'low',
      attendanceStatus: 'regular',
      lastAttendanceDate: '2023-06-14',
      performanceScore: 88,
      attendancePercentage: 92,
      createdAt: '2023-04-05T11:20:00',
    },
    {
      id: '5',
      name: 'David Wilson',
      age: '15',
      fatherName: 'Thomas Wilson',
      mobile: '5432109876',
      address: '654 Elm St, Town',
      joiningDate: '2023-05-12',
      classId: '4',
      fee: 6500,
      imageUrl: '',
      feeStatus: 'unpaid' as 'paid' | 'unpaid' | 'partial',
      performanceLevel: 'medium' as 'high' | 'medium' | 'low',
      attendanceStatus: 'irregular',
      lastAttendanceDate: '2023-06-12',
      performanceScore: 70,
      attendancePercentage: 78,
      createdAt: '2023-05-12T16:30:00',
    },
  ];
  
  return { students };
}

/**
 * Helper function to get mock class data
 * In a real application, this would be an API call
 */
async function getMockClassData() {
  const classes = [
    { id: '1', name: 'Class 6', fee: 5000 },
    { id: '2', name: 'Class 7', fee: 5500 },
    { id: '3', name: 'Class 8', fee: 6000 },
    { id: '4', name: 'Class 9', fee: 6500 },
    { id: '5', name: 'Class 10', fee: 7000 },
  ];
  
  return { classes };
}

/**
 * Get AI-friendly formatted system context
 * @param userData User data object
 * @returns Formatted string for system context
 */
export function formatAISystemContext(userData: AIContextData): string {
  return `
    You are an AI assistant for this student management platform called Diggi-Class. You have access to the following data:
    
    STUDENT DATA (${userData.students.length} students):
    ${userData.students.map(student => 
      `- ${student.name} (ID: ${student.id}): ${student.age} years old, ${student.className}, joined on ${student.joiningDate}, fee: ₹${student.fee}, father: ${student.fatherName}`
    ).join('\n    ')}
    
    FEE DATA:
    ${userData.fees.map(fee => 
      `- ${fee.studentName}: ₹${fee.amount}, Status: ${fee.status}${fee.lastPaymentDate ? `, Last payment: ${fee.lastPaymentDate}` : ''}`
    ).join('\n    ')}
    
    ATTENDANCE DATA:
    ${userData.attendance.map(att => 
      `- ${att.studentName}: ${att.status} on ${att.date}, Attendance rate: ${att.percentage}%`
    ).join('\n    ')}
    
    PERFORMANCE DATA:
    ${userData.performance.map(perf => 
      `- ${perf.studentName}: ${perf.examName}, ${perf.subject}, Marks: ${perf.marks}/${perf.totalMarks}, Grade: ${perf.grade}, Performance level: ${perf.performanceLevel}`
    ).join('\n    ')}
    
    SUMMARY:
    - Total Students: ${userData.summary.totalStudents}
    - Total Fees Pending: ₹${userData.summary.totalFeesPending}
    - Average Attendance: ${userData.summary.averageAttendance.toFixed(2)}%
    - Average Performance: ${userData.summary.averagePerformance.toFixed(2)}/100
    
    ABOUT DIGGI-CLASS:
    - Diggi-Class is a student management platform designed for educational institutions to manage students, fees, performance, and attendance in one place
    - Founder: Rupam Debnath, who created this tool to simplify student management for teachers and institutions
    - Pricing: Basic (₹0/month, up to 25 students), Pro (₹99/month, up to 500 students), Premium (₹199/month, unlimited students)
    - Contact: Email: itsrupamdebnath@gmail.com, WhatsApp: https://wa.me/918402802480
    - Use Cases: Schools can track student records and fee payments, Tuition centers can monitor performance and attendance, Teachers can manage class lists and generate invoices for students
    - Support: Visit the "Contact Us" section on the dashboard, Built-in chatbot for FAQs, Email support available for plan or payment issues
    - Getting Started: Create an account, Add your institution or class, Start adding students and tracking progress
    - Dashboard Features: Modules for Fees, Attendance, Performance, and more
    
    IMPORTANT INSTRUCTIONS:
    - Use this data to provide accurate and personalized responses about the institution's students.
    - When asked about specific students, fees, attendance, or performance, refer to the data above.
    - If asked about statistics or summaries, use the summary data.
    - Keep your responses friendly, concise, and helpful.
    - When asked about Diggi-Class platform, provide accurate information from the "ABOUT DIGGI-CLASS" section.
    - If you don't know something that's not in the data, admit it rather than making up information.
  `;
}

/**
 * Main function to generate AI responses with backend data context
 * @param userId User ID 
 * @param userPrompt User's query
 * @returns AI response
 */
export async function generateAIResponseWithData(userPrompt: string): Promise<string> {
  try {
    // Fetch the user data
    const userData = await getUserDataForAI();
    
    // Format the system context with the data
    const systemContext = formatAISystemContext(userData);
    
    // Return the formatted context and user prompt for use in the OpenRouter call
    return systemContext;
  } catch (error) {
    console.error('Error generating AI response with data:', error);
    throw new Error('Failed to generate AI response with backend data');
  }
} 