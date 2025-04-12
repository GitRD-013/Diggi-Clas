import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Badge,
  Collapse,
  InputBase,
  Divider,
  Tabs,
  Tab,
  Menu,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Fade,
  CardHeader,
  CardContent,
  CardActions,
  LinearProgress,
  ToggleButtonGroup,
  ToggleButton,
  List,
  ListItem,
  ListItemButton,
  SelectChangeEvent
} from '@mui/material';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Tooltip as ChartTooltip
} from 'chart.js';
import { Bar, Line, Pie, Radar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { useClasses } from '../contexts/ClassContext';
import { useStudents } from '../contexts/StudentContext';
import { 
  GridView, 
  ViewList,
  FilterAlt,
  Add, 
  MoreVert,
  Edit, 
  Delete, 
  Email, 
  Download,
  BarChart,
  ShowChart,
  PieChart,
  Timeline,
  DonutLarge,
  CompareArrows,
  EmojiEvents,
  Equalizer,
  School
} from '@mui/icons-material';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  ChartTooltip,
  Legend
);

// Types
interface Student {
  id: string;
  name: string;
  classId: string;
  imageUrl?: string;
  profileImage?: string;
}

interface Subject {
  id: string;
  name: string;
  totalMarks: number;
}

interface ExamResult {
  id: string;
  studentId: string;
  examName: string;
  date: string;
  subjectMarks: {
    subjectId: string;
    marksObtained: number;
  }[];
}

// Graph view types
type GraphViewType = 
  | 'subject-wise' 
  | 'progress-line' 
  | 'grade-distribution' 
  | 'subject-comparison'
  | 'top-performers'
  | 'attendance-correlation';

const PerformanceTracking = () => {
  const { classes } = useClasses();
  const { students } = useStudents();

  // Mock data
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 'math-123', name: 'Mathematics', totalMarks: 100 },
    { id: 'science-123', name: 'Science', totalMarks: 100 },
    { id: 'english-123', name: 'English', totalMarks: 100 },
    { id: 'social-123', name: 'Social Studies', totalMarks: 100 },
    { id: 'cs-123', name: 'Computer Science', totalMarks: 100 }
  ]);

  const [examResults, setExamResults] = useState<ExamResult[]>([
    {
      id: '1',
      studentId: '1',
      examName: 'First Term',
      date: '2023-04-15',
      subjectMarks: [
        { subjectId: 'math-123', marksObtained: 85 },
        { subjectId: 'science-123', marksObtained: 78 },
        { subjectId: 'english-123', marksObtained: 92 },
        { subjectId: 'social-123', marksObtained: 81 },
        { subjectId: 'cs-123', marksObtained: 95 },
      ],
    },
    {
      id: '2',
      studentId: '1',
      examName: 'Mid Term',
      date: '2023-08-10',
      subjectMarks: [
        { subjectId: 'math-123', marksObtained: 88 },
        { subjectId: 'science-123', marksObtained: 82 },
        { subjectId: 'english-123', marksObtained: 85 },
        { subjectId: 'social-123', marksObtained: 79 },
        { subjectId: 'cs-123', marksObtained: 90 },
      ],
    },
    {
      id: '3',
      studentId: '2',
      examName: 'First Term',
      date: '2023-04-15',
      subjectMarks: [
        { subjectId: 'math-123', marksObtained: 75 },
        { subjectId: 'science-123', marksObtained: 88 },
        { subjectId: 'english-123', marksObtained: 82 },
        { subjectId: 'social-123', marksObtained: 79 },
        { subjectId: 'cs-123', marksObtained: 85 },
      ],
    },
  ]);

  // States
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [subjectMarks, setSubjectMarks] = useState<{ subjectId: string; marksObtained: number }[]>([]);
  const [customSubjects, setCustomSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectTotalMarks, setNewSubjectTotalMarks] = useState(100);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    studentName: [] as string[],
    dateRange: {
      start: '',
      end: '',
    },
    examName: [] as string[],
    searchQuery: '',
  });

  // Add exam type tabs state
  const [examTypeTab, setExamTypeTab] = useState<string>('all');
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);
  const [remarksMap, setRemarksMap] = useState<{[key: string]: string}>({});

  // Graph view state
  const [currentGraphView, setCurrentGraphView] = useState<GraphViewType>('subject-wise');
  const [graphViewMenuAnchor, setGraphViewMenuAnchor] = useState<null | HTMLElement>(null);
  
  // View mode toggle - card or table view 
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  // State for subject comparison view
  const [selectedSubjectForComparison, setSelectedSubjectForComparison] = useState<string>('');

  // Get unique exam names for filter
  const examNames = useMemo(() => {
    return [...new Set(examResults.map(result => result.examName))];
  }, [examResults]);

  // Apply filters
  const filteredResults = useMemo(() => {
    let results = [...examResults];
    
    // Filter by student name
    if (filters.studentName.length > 0) {
      results = results.filter(result => 
        filters.studentName.includes(result.studentId)
      );
    }
    
    // Filter by date range
    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      results = results.filter(result => {
        const resultDate = new Date(result.date);
        return resultDate >= startDate && resultDate <= endDate;
      });
    }
    
    // Filter by exam name
    if (filters.examName.length > 0) {
      results = results.filter(result => 
        filters.examName.includes(result.examName)
      );
    }
    
    // Filter by exam type tab
    if (examTypeTab !== 'all') {
      results = results.filter(result => result.examName === examTypeTab);
    }
    
    return results;
  }, [examResults, filters, examTypeTab]);

  // Get filtered students based on filteredResults
  const filteredStudents = useMemo(() => {
    const studentIds = [...new Set(filteredResults.map(result => result.studentId))];
    return selectedStudentId
      ? students.filter(student => student.id === selectedStudentId)
      : students.filter(student => studentIds.includes(student.id));
  }, [filteredResults, selectedStudentId, students]);

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.studentName.length > 0) count++;
    if (filters.examName.length > 0) count++;
    if (filters.dateRange.start && filters.dateRange.end) count++;
    if (filters.searchQuery) count++;
    return count;
  };

  return (
    <div>
      {/* Rest of the component code */}
    </div>
  );
};

export default PerformanceTracking; 