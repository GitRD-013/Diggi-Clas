import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels'; // <-- Import Context type
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
  School,
  Search,
  Close,
  FilterList
} from '@mui/icons-material';
import { useSearch } from '../components/Layout';

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
  Legend,
  ChartDataLabels // <-- Re-register the plugin
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
  const { searchQuery, setSearchQuery } = useSearch(); // Use the search context
  const navigate = useNavigate(); // Add navigation hook

  // Replace predefined subjects with empty array
  const [subjects, setSubjects] = useState<Subject[]>([]);

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
  const [currentEditingResultId, setCurrentEditingResultId] = useState<string | null>(null);
  
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
  
  // Card menu state
  const [cardMenuAnchor, setCardMenuAnchor] = useState<HTMLElement | null>(null);
  const [currentStudentForMenu, setCurrentStudentForMenu] = useState<Student | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedExamForEdit, setSelectedExamForEdit] = useState<string>('');

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
    
    // Apply search query from context
    if (searchQuery) {
      // First find students matching the search
      const matchingStudentIds = students
        .filter(student => 
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          getClassName(student.classId).toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(student => student.id);
      
      // Then find exam names matching the search
      const matchingExamNames = examResults
        .filter(result => 
          result.examName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(result => result.examName);
      
      // Filter results by either matching student or exam name
      results = results.filter(result => 
        matchingStudentIds.includes(result.studentId) || 
        matchingExamNames.includes(result.examName)
      );
    }
    
    return results;
  }, [examResults, filters, examTypeTab, searchQuery, students]); // Add searchQuery to the dependencies

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

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  // Handle student name filter change
  const handleStudentNameFilterChange = (event: SelectChangeEvent<string[]>) => {
    handleFilterChange('studentName', event.target.value);
  };

  // Handle exam name filter change
  const handleExamNameFilterChange = (event: SelectChangeEvent<string[]>) => {
    handleFilterChange('examName', event.target.value);
  };

  // Sync local search state with context
  useEffect(() => {
    if (searchQuery !== filters.searchQuery) {
      handleFilterChange('searchQuery', searchQuery);
    }
  }, [searchQuery]);

  // Handle search query change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query); // Update the context
    handleFilterChange('searchQuery', query); // Update local state
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      studentName: [],
      dateRange: {
        start: '',
        end: '',
      },
      examName: [],
      searchQuery: '',
    });
    setExamTypeTab('all');
  };

  // Handle opening the add/edit result dialog
  const handleOpen = () => {
    setSubjectMarks([]);
    setExamName('');
    setExamDate('');
    setCurrentEditingResultId(null);
    setOpen(true);
  };

  // Handle closing the add/edit result dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedStudent(null);
    setExamName('');
    setExamDate('');
    setSubjectMarks([]);
    setSubjects([]);
    setCurrentEditingResultId(null);
  };

  // Handle form submission for adding/editing a result
  const handleSubmit = () => {
    if (!selectedStudent || !examName || !examDate) return;

    if (currentEditingResultId) {
      // Update existing result
      setExamResults(prev => 
        prev.map(result => 
          result.id === currentEditingResultId 
            ? {
                ...result,
                examName,
                date: examDate,
                subjectMarks,
              }
            : result
        )
      );
    } else {
      // Add new result
      const newResult: ExamResult = {
        id: Math.random().toString(36).substr(2, 9),
      studentId: selectedStudent.id,
      examName,
      date: examDate,
      subjectMarks,
    };

      setExamResults(prev => [...prev, newResult]);
    }
    
    handleClose();
  };

  // Handle subject mark change
  const handleSubjectMarkChange = (subjectId: string, marks: number) => {
    setSubjectMarks(prev => 
      prev.map(item => 
        item.subjectId === subjectId 
          ? { ...item, marksObtained: marks } 
          : item
      )
    );
  };

  // Calculate average marks for a student
  const calculateAverage = (studentId: string): number => {
    const studentResults = examResults.filter(result => result.studentId === studentId);
    
    if (studentResults.length === 0) return 0;

    let totalMarks = 0;
    let totalPossibleMarks = 0;
    
    studentResults.forEach(result => {
      result.subjectMarks.forEach(mark => {
        const subject = subjects.find(s => s.id === mark.subjectId);
        if (subject) {
          totalMarks += mark.marksObtained;
          totalPossibleMarks += subject.totalMarks;
        }
      });
    });

    return totalPossibleMarks > 0 ? (totalMarks / totalPossibleMarks) * 100 : 0;
  };

  // Get student results
  const getStudentResults = (studentId: string): ExamResult[] => {
    return examResults
      .filter(result => result.studentId === studentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Prepare chart data for student
  const prepareStudentChartData = (studentId: string, onlyLastExam: boolean = false) => {
    const studentResults = getStudentResults(studentId);
    
    if (studentResults.length === 0) {
      return {
        subjectData: {
          labels: [],
          datasets: [{
            label: 'No Exams',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          }]
        },
        progressData: {
          labels: [],
          datasets: [{
            label: 'Progress',
            data: [],
            fill: false,
            borderColor: '#cc73f8',
            tension: 0.4,
          }]
        },
      };
    }
    
    const resultsToUse = onlyLastExam ? [studentResults[0]] : studentResults;
    
    // Get all subject IDs from the result's marks to show in chart
    const subjectIds = new Set<string>();
    resultsToUse.forEach(result => {
      result.subjectMarks.forEach(mark => {
        subjectIds.add(mark.subjectId);
      });
    });

    // Get subject names for display in chart
    const subjectNames: {[key: string]: string} = {};
    const subjectTotalMarks: {[key: string]: number} = {};
    
    // Use existing subjects if available, otherwise use subject IDs as names
    Array.from(subjectIds).forEach(id => {
      const subject = subjects.find(s => s.id === id);
      if (subject) {
        subjectNames[id] = subject.name;
        subjectTotalMarks[id] = subject.totalMarks;
      } else {
        // Extract name from ID or use ID directly
        subjectNames[id] = id.split('-')[0] || id;
        
        // Find max marks obtained for this subject across all results
        let maxMarks = 100; // Default
        resultsToUse.forEach(result => {
          const mark = result.subjectMarks.find(m => m.subjectId === id);
          if (mark && mark.marksObtained > maxMarks) {
            maxMarks = mark.marksObtained;
          }
        });
        subjectTotalMarks[id] = maxMarks;
      }
    });
    
    // Subject wise data
    const subjectData = {
      labels: Array.from(subjectIds).map(id => subjectNames[id]),
      datasets: resultsToUse.map((result, index) => {
        // Different colors for different exams
        const colors = [
          'rgba(54, 162, 235, 0.7)',   // Blue
          'rgba(30, 144, 255, 0.7)',   // Dodger Blue
          'rgba(0, 191, 255, 0.7)',    // Deep Sky Blue
          'rgba(65, 105, 225, 0.7)',   // Royal Blue
          'rgba(100, 149, 237, 0.7)',  // Cornflower Blue
        ];
        
        return {
        label: result.examName,
          data: Array.from(subjectIds).map(subjectId => {
            const mark = result.subjectMarks.find(m => m.subjectId === subjectId);
          return mark ? mark.marksObtained : 0;
        }),
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length].replace('0.7', '1'),
          borderWidth: 1,
        };
      })
    };
    
    // Progress data over time
    const progressData = {
      labels: studentResults.map(result => result.examName).reverse(),
      datasets: [{
        label: 'Average Score (%)',
        data: studentResults.map(result => {
            const totalMarks = result.subjectMarks.reduce((sum, mark) => sum + mark.marksObtained, 0);
          let totalPossibleMarks = 0;
          
          result.subjectMarks.forEach(mark => {
            const maxMarks = subjectTotalMarks[mark.subjectId] || 100;
            totalPossibleMarks += maxMarks;
          });
          
          return totalPossibleMarks > 0 ? (totalMarks / totalPossibleMarks) * 100 : 0;
        }).reverse(),
        fill: false,
          borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.4,
      }]
    };
    
    return { subjectData, progressData };
  };

  // Get class name from class ID
  const getClassName = (classId: string) => {
    const classObj = classes.find(c => c.id === classId);
    return classObj ? classObj.name : 'Unknown';
  };

  // Handle opening student report dialog
  const handleOpenReport = (student: Student | string) => {
    // If student is a string (studentId), navigate to the student report page
    if (typeof student === 'string') {
      navigate(`/dashboard/student-report/${student}`);
    } else {
      // Otherwise, open the report dialog (legacy behavior)
      setSelectedStudentForReport(student);
      setReportDialogOpen(true);
    }
  };

  // Handle closing student report dialog
  const handleCloseReport = () => {
    setReportDialogOpen(false);
    setSelectedStudentForReport(null);
  };

  // Handle remarks change
  const handleRemarksChange = (studentId: string, remarks: string) => {
    setRemarksMap(prev => ({
      ...prev,
      [studentId]: remarks
    }));
  };

  // Handle generating PDF of the report
  const handleGeneratePDF = () => {
    // Implementation would go here
    console.log('Generating PDF...');
  };

  // Handle adding custom subject
  const handleAddCustomSubject = () => {
    if (!newSubjectName || newSubjectTotalMarks <= 0) return;
    
    const newSubject: Subject = {
      id: `custom-${Math.random().toString(36).substr(2, 9)}`,
      name: newSubjectName,
      totalMarks: newSubjectTotalMarks
    };
    
    setSubjects(prev => [...prev, newSubject]);
    setCustomSubjects(prev => [...prev, newSubject]);
    setSubjectMarks(prev => [...prev, { subjectId: newSubject.id, marksObtained: 0 }]);
    
    // Reset form
    setNewSubjectName('');
    setNewSubjectTotalMarks(100);
  };

  // Handle removing custom subject
  const handleRemoveCustomSubject = (subjectId: string) => {
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
    setCustomSubjects(prev => prev.filter(s => s.id !== subjectId));
    setSubjectMarks(prev => prev.filter(m => m.subjectId !== subjectId));
  };

  // Graph view menu handlers
  const handleGraphViewMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setGraphViewMenuAnchor(event.currentTarget);
  };

  const handleGraphViewMenuClose = () => {
    setGraphViewMenuAnchor(null);
  };

  const handleGraphViewChange = (viewType: GraphViewType) => {
    setCurrentGraphView(viewType);
    handleGraphViewMenuClose();
  };

  const getGraphViewIcon = () => {
    switch (currentGraphView) {
      case 'subject-wise':
        return <BarChart />;
      case 'progress-line':
        return <ShowChart />;
      case 'grade-distribution':
        return <PieChart />;
      case 'subject-comparison':
        return <CompareArrows />;
      case 'top-performers':
        return <EmojiEvents />;
      case 'attendance-correlation':
        return <Timeline />;
      default:
        return <BarChart />;
    }
  };

  const getGraphViewTitle = () => {
    switch (currentGraphView) {
      case 'subject-wise':
        return 'Subject-wise Performance';
      case 'progress-line':
        return 'Progress Over Time';
      case 'grade-distribution':
        return 'Grade Distribution';
      case 'subject-comparison':
        return 'Subject Comparison';
      case 'top-performers':
        return 'Top Performers';
      case 'attendance-correlation':
        return 'Attendance Correlation';
      default:
        return 'Performance Analytics';
    }
  };

  // Calculate grade distribution
  const calculateGradeDistribution = () => {
    const gradeMap: Record<string, number> = {
      'A+': 0,
      'A': 0,
      'B+': 0,
      'B': 0,
      'C+': 0,
      'C': 0,
      'D': 0,
      'F': 0
    };
    
    filteredResults.forEach(result => {
      const totalMarks = result.subjectMarks.reduce((sum, mark) => sum + mark.marksObtained, 0);
      const totalPossibleMarks = result.subjectMarks.reduce((sum, mark) => {
        const subject = subjects.find(s => s.id === mark.subjectId);
        return sum + (subject ? subject.totalMarks : 0);
      }, 0);
      
      const percentage = totalPossibleMarks > 0 ? (totalMarks / totalPossibleMarks) * 100 : 0;
      
      if (percentage >= 90) gradeMap['A+']++;
      else if (percentage >= 80) gradeMap['A']++;
      else if (percentage >= 75) gradeMap['B+']++;
      else if (percentage >= 70) gradeMap['B']++;
      else if (percentage >= 65) gradeMap['C+']++;
      else if (percentage >= 60) gradeMap['C']++;
      else if (percentage >= 50) gradeMap['D']++;
      else gradeMap['F']++;
    });
    
    return {
      labels: Object.keys(gradeMap),
      datasets: [
        {
          label: 'Grade Distribution',
          data: Object.values(gradeMap),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(201, 203, 207, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)',
            'rgb(201, 203, 207)',
            'rgb(255, 99, 132)'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare data for subject comparison view
  const prepareSubjectComparisonData = (subjectId: string) => {
    const studentsWithMarks = students.map(student => {
      // Find the latest exam result for this student
      const latestResult = [...examResults]
        .filter(result => result.studentId === student.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        
      const mark = latestResult?.subjectMarks.find(m => m.subjectId === subjectId)?.marksObtained || 0;
      
      return {
        studentName: student.name,
        mark
      };
    });
    
    // Sort by marks in descending order
    studentsWithMarks.sort((a, b) => b.mark - a.mark);
    
    return {
      labels: studentsWithMarks.map(s => s.studentName),
      datasets: [
        {
          label: subjects.find(s => s.id === subjectId)?.name || 'Subject',
          data: studentsWithMarks.map(s => s.mark),
          backgroundColor: 'rgba(204, 115, 248, 0.6)',
          borderColor: '#cc73f8',
          borderWidth: 1,
        }
      ]
    };
  };

  // Prepare data for top performers view
  const prepareTopPerformersData = () => {
    const studentPerformance = students.map(student => {
      const studentResults = examResults.filter(result => result.studentId === student.id);
      
      if (studentResults.length === 0) {
        return {
          studentName: student.name,
          averageScore: 0
        };
      }
      
      let totalMarks = 0;
      let totalPossibleMarks = 0;
      
      studentResults.forEach(result => {
        result.subjectMarks.forEach(mark => {
          const subject = subjects.find(s => s.id === mark.subjectId);
          if (subject) {
            totalMarks += mark.marksObtained;
            totalPossibleMarks += subject.totalMarks;
          }
        });
      });
      
      const averageScore = totalPossibleMarks > 0 ? (totalMarks / totalPossibleMarks) * 100 : 0;
      
      return {
        studentName: student.name,
        averageScore
      };
    });
    
    // Sort by average score in descending order and take top 10
    studentPerformance.sort((a, b) => b.averageScore - a.averageScore);
    const topPerformers = studentPerformance.slice(0, 10);
    
    return {
      labels: topPerformers.map(s => s.studentName),
      datasets: [
        {
          label: 'Average Score (%)',
          data: topPerformers.map(s => s.averageScore),
          backgroundColor: topPerformers.map((_, index) => {
            const hue = (index * 36) % 360; // Spread colors across the spectrum
            return `hsla(${hue}, 80%, 60%, 0.7)`;
          }),
          borderColor: topPerformers.map((_, index) => {
            const hue = (index * 36) % 360;
            return `hsla(${hue}, 80%, 60%, 1)`;
          }),
          borderWidth: 1,
        }
      ]
    };
  };

  // Handle view mode change
  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'card' | 'table' | null,
  ) => {
    if (newView) {
      setViewMode(newView);
    }
  };

  // Card menu handlers
  const handleCardMenuOpen = (event: React.MouseEvent<HTMLElement>, student: Student) => {
    setCardMenuAnchor(event.currentTarget);
    setCurrentStudentForMenu(student);
  };

  const handleCardMenuClose = () => {
    setCardMenuAnchor(null);
    setCurrentStudentForMenu(null);
  };

  // Handle edit result
  const handleEditResult = () => {
    if (!currentStudentForMenu) return;
    
    const studentResults = getStudentResults(currentStudentForMenu.id);
    
    if (studentResults.length === 0) {
      // No results to edit
      handleCardMenuClose();
      return;
    }
    
    if (studentResults.length === 1) {
      // Only one result, edit it directly
      const result = studentResults[0];
      setSelectedStudent(currentStudentForMenu);
      setExamName(result.examName);
      setExamDate(result.date);
      setCurrentEditingResultId(result.id);
      
      // Reconstruct subjects from the result's subjectMarks
      const reconstructedSubjects = result.subjectMarks.map(mark => {
        // Find existing subject if available
        const existingSubject = subjects.find(s => s.id === mark.subjectId);
        
        // Create a new subject entry if not found
        if (!existingSubject) {
          // Determine a reasonable total marks if not known (default to 100)
          const totalMarks = mark.marksObtained > 100 ? mark.marksObtained : 100;
          
          return {
            id: mark.subjectId,
            name: `Subject ${mark.subjectId.split('-')[0]}`, // Extract name from ID if possible
            totalMarks
          };
        }
        
        return existingSubject;
      });
      
      setSubjects(reconstructedSubjects);
      setSubjectMarks(result.subjectMarks);
      setOpen(true);
      handleCardMenuClose();
    } else {
      // Multiple results, show dialog to select which one to edit
      setEditDialogOpen(true);
      handleCardMenuClose();
    }
  };

  // Handle delete result
  const handleDeleteResult = () => {
    if (!currentStudentForMenu) return;
    
    // Implementation would be added here
    console.log('Delete result for student:', currentStudentForMenu.id);
    
    handleCardMenuClose();
  };

  // Handle send report
  const handleSendReport = () => {
    if (!currentStudentForMenu) return;
    
    // Implementation would be added here
    console.log('Sending report for student:', currentStudentForMenu.id);
    
    handleCardMenuClose();
  };

  // Handle download PDF
  const handleDownloadPDF = () => {
    if (!currentStudentForMenu) return;
    
    // Implementation would be added here
    console.log('Downloading PDF for student:', currentStudentForMenu.id);
    
    handleCardMenuClose();
  };

  // Function to get grade based on percentage
  const getGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 75) return 'B+';
    if (percentage >= 70) return 'B';
    if (percentage >= 65) return 'C+';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  // Function to get color based on grade
  const getGradeColor = (percentage: number): string => {
    if (percentage >= 80) return '#4caf50'; // Green
    if (percentage >= 70) return '#8bc34a'; // Light Green
    if (percentage >= 60) return '#ffeb3b'; // Yellow
    if (percentage >= 50) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4">Performance Tracking</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Card/Table View Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            aria-label="view mode"
            size="small"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              '& .MuiToggleButton-root': {
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': {
                  bgcolor: 'rgba(204, 115, 248, 0.2)',
                  color: '#cc73f8',
                },
              },
            }}
          >
            <ToggleButton value="card" aria-label="card view">
              <Tooltip title="Card View">
                <GridView fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="table" aria-label="table view">
              <Tooltip title="Table View">
                <ViewList fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Filter Button */}
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '&:hover': {
                borderColor: 'rgba(204, 115, 248, 0.5)',
                backgroundColor: 'rgba(204, 115, 248, 0.1)',
              },
            }}
          >
            Filters
            {getActiveFilterCount() > 0 && (
              <Badge 
                badgeContent={getActiveFilterCount()} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    right: -10,
                    top: 0,
                    border: '2px solid #1a1a1a',
                    padding: '0 4px',
                    minWidth: '20px',
                    height: '20px',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    backgroundColor: '#f44336',
                  },
                }}
              />
            )}
          </Button>

          {/* Add Result Button */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpen}
            sx={{
              background: 'linear-gradient(135deg, #cc73f8 0%, #b35de0 100%)',
              boxShadow: '0 4px 15px rgba(204, 115, 248, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(204, 115, 248, 0.4)',
              },
            }}
          >
            Add Result
          </Button>
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <Paper
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, color: 'white' }}
            placeholder="Search by student name, class, or exam..."
            value={filters.searchQuery} // Synced with context
            onChange={handleSearchChange}
          />
          {filters.searchQuery && (
            <IconButton 
              onClick={() => {
                handleFilterChange('searchQuery', '');
                setSearchQuery(''); // Also clear the context
              }}
              sx={{ 
                p: '10px', 
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#cc73f8',
                },
              }}
            >
              <Close />
            </IconButton>
          )}
          <Divider sx={{ height: 28, m: 0.5, borderColor: 'rgba(255, 255, 255, 0.1)' }} orientation="vertical" />
          <IconButton sx={{ p: '10px', color: 'rgba(255, 255, 255, 0.7)' }}>
            <Search />
          </IconButton>
        </Paper>
      </Box>

      {/* Filter Panel */}
      <Collapse in={showFilters}>
        <Paper
                sx={{
            p: 3,
            mb: 3,
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: 'white' }}>
              Filter Results
            </Typography>
            <Button
              variant="text"
              startIcon={<Close />}
              onClick={clearFilters}
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Clear All
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {/* Student Name Filter */}
            <Grid item xs={12} md={6} lg={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: 'transparent',
                  '&.MuiInputLabel-shrink': {
                    backgroundColor: 'transparent',
                    padding: '0 4px',
                    textShadow: '0 0 8px rgba(0, 0, 0, 0.7)',
                    fontWeight: 500,
                    color: '#cc73f8',
                  },
                  '&.Mui-focused': {
                    color: '#cc73f8',
                  },
                }}>Student</InputLabel>
                <Select
                  multiple
                  value={filters.studentName}
                  onChange={handleStudentNameFilterChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const student = students.find(s => s.id === value);
                        return (
                          <Chip 
                            key={value} 
                            label={student ? student.name : value}
                            size="small"
                  sx={{
                              bgcolor: 'rgba(204, 115, 248, 0.2)', 
                              color: 'white',
                              borderRadius: '12px',
                            }}
                            onDelete={(e) => {
                              e.stopPropagation();
                              handleFilterChange('studentName', filters.studentName.filter(id => id !== value));
                            }}
                            deleteIcon={
                              <Close 
                                fontSize="small" 
                                sx={{ 
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  '&:hover': {
                                    color: 'white',
                                  } 
                                }}
                              />
                            }
                          />
                        );
                      })}
                    </Box>
                  )}
                  sx={{
                    '.MuiSelect-select': {
                      color: 'white',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(204, 115, 248, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#cc73f8',
                    },
                    '.MuiSvgIcon-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: '#1a1a2e',
                        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        '& .MuiMenuItem-root': {
                          color: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            bgcolor: 'rgba(204, 115, 248, 0.15)',
                          },
                          '&.Mui-selected': {
                            bgcolor: 'rgba(204, 115, 248, 0.2)',
                            color: '#cc73f8',
                            '&:hover': {
                              bgcolor: 'rgba(204, 115, 248, 0.25)',
                            },
                          },
                        },
                      },
                    },
                  }}
                >
                  {students.map((student) => (
                    <MenuItem key={student.id} value={student.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                          src={student.profileImage} 
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            fontSize: '0.75rem',
                            backgroundColor: 'rgba(204, 115, 248, 0.3)',
                            color: '#cc73f8'
                          }}
                        >
                          {student.name.charAt(0)}
                    </Avatar>
                        {student.name} <Typography variant="caption" sx={{ ml: 0.5, color: 'rgba(255, 255, 255, 0.5)' }}>
                          ({getClassName(student.classId)})
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Exam Name Filter */}
            <Grid item xs={12} md={6} lg={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: 'transparent',
                  '&.MuiInputLabel-shrink': {
                    backgroundColor: 'transparent',
                    padding: '0 4px',
                    textShadow: '0 0 8px rgba(0, 0, 0, 0.7)',
                    fontWeight: 500,
                    color: '#cc73f8',
                  },
                  '&.Mui-focused': {
                    color: '#cc73f8',
                  },
                }}>Exam</InputLabel>
                <Select
                  multiple
                  value={filters.examName}
                  onChange={handleExamNameFilterChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                      <Chip
                          key={value} 
                          label={value}
                        size="small"
                          sx={{ 
                            bgcolor: 'rgba(204, 115, 248, 0.2)', 
                            color: 'white',
                            borderRadius: '12px',
                          }}
                          onDelete={(e) => {
                            e.stopPropagation();
                            handleFilterChange('examName', filters.examName.filter(name => name !== value));
                          }}
                          deleteIcon={
                            <Close 
                              fontSize="small" 
                              sx={{ 
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&:hover': {
                                  color: 'white',
                                } 
                              }}
                            />
                          }
                        />
                      ))}
                    </Box>
                  )}
                  sx={{
                    '.MuiSelect-select': {
                      color: 'white',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(204, 115, 248, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#cc73f8',
                    },
                    '.MuiSvgIcon-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: '#1a1a2e',
                        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        '& .MuiMenuItem-root': {
                          color: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            bgcolor: 'rgba(204, 115, 248, 0.15)',
                          },
                          '&.Mui-selected': {
                            bgcolor: 'rgba(204, 115, 248, 0.2)',
                            color: '#cc73f8',
                            '&:hover': {
                              bgcolor: 'rgba(204, 115, 248, 0.25)',
                            },
                          },
                        },
                      },
                    },
                  }}
                >
                  {examNames.map((examName) => (
                    <MenuItem key={examName} value={examName}>
                      {examName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Date Range Filter */}
            <Grid item xs={12} md={6} lg={6}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="From Date"
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => 
                    handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })
                  }
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-focused': {
                        color: '#cc73f8',
                      },
                    }
                  }}
                  fullWidth
                  sx={{
                    '& .MuiInputBase-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(204, 115, 248, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#cc73f8',
                      }
                    },
                    '& .MuiInputBase-input[type="date"]::-webkit-calendar-picker-indicator': {
                      filter: 'invert(1) hue-rotate(180deg) brightness(1.5)',
                    }
                  }}
                />
                <TextField
                  label="To Date"
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => 
                    handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })
                  }
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-focused': {
                        color: '#cc73f8',
                      },
                    }
                  }}
                  fullWidth
                  sx={{
                    '& .MuiInputBase-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(204, 115, 248, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#cc73f8',
                      }
                    },
                    '& .MuiInputBase-input[type="date"]::-webkit-calendar-picker-indicator': {
                      filter: 'invert(1) hue-rotate(180deg) brightness(1.5)',
                    }
                  }}
                />
                  </Box>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      {/* Card View */}
      {viewMode === 'card' ? (
        <Grid container spacing={3}>
          {filteredStudents.map((student) => {
            const studentResults = getStudentResults(student.id);
            return (
              <Grid item xs={12} md={6} lg={4} key={student.id}>
                <Card sx={{ 
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  overflow: 'visible',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                  },
                }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ 
                        bgcolor: 'rgba(204, 115, 248, 0.3)', 
                        color: '#cc73f8',
                        fontWeight: 'bold'
                      }}>
                        {student.name.charAt(0)}
                      </Avatar>
                    }
                    action={
                      <IconButton 
                        aria-label="options" 
                        onClick={(e) => handleCardMenuOpen(e, student)}
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            color: '#cc73f8',
                            backgroundColor: 'rgba(204, 115, 248, 0.1)',
                          }
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    }
                    title={student.name}
                    subheader={
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <School fontSize="small" /> {getClassName(student.classId)}
                      </Typography>
                    }
                    sx={{ 
                      pb: 0, 
                      '& .MuiCardHeader-title': {
                        color: 'white',
                        fontWeight: 'bold',
                      },
                      '& .MuiCardHeader-subheader': {
                        color: 'rgba(255, 255, 255, 0.6)',
                      }
                    }}
                  />
                  <CardContent sx={{ pt: 1 }}>
                    {studentResults.length > 0 ? (
                      <>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                          Latest Exam: <span style={{ color: 'white', fontWeight: 'bold' }}>{studentResults[0].examName}</span>
                      </Typography>
                        
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                          Date: <span style={{ color: 'white' }}>
                            {new Date(studentResults[0].date).toLocaleDateString()}
                          </span>
                        </Typography>
                        
                        <Box sx={{ mt: 2, height: 200, mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                            Subject Performance
                          </Typography>
                          <Box sx={{ height: 'calc(100% - 30px)', position: 'relative', pl: 2 }}>
                            <Bar
                              data={prepareStudentChartData(student.id, true).subjectData}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                indexAxis: 'y',
                                scales: {
                                  y: {
                                    beginAtZero: true,
                                    ticks: {
                                      display: true, // Show y-axis labels for subject names
                                      color: 'rgba(255, 255, 255, 0.7)',
                                      font: {
                                        size: 10,
                                      },
                                      padding: 8, // Add padding between labels and bars
                                      align: 'center',
                                    },
                                    grid: {
                                      display: false
                                    },
                                    border: {
                                      display: false
                                    }
                                  },
                                  x: {
                                    beginAtZero: true,
                                    max: 100,
                                    ticks: {
                                      color: 'rgba(255, 255, 255, 0.5)',
                                      font: {
                                        size: 9,
                                      },
                                      padding: 4,
                                    },
                                    grid: {
                                      color: 'rgba(255, 255, 255, 0.1)'
                                    }
                                  }
                                },
                                layout: {
                                  padding: {
                                    bottom: 10, // Add bottom padding to avoid x-axis label cutoff
                                  }
                                },
                                plugins: {
                                  legend: {
                                    display: false
                                  },
                                  tooltip: {
                                    enabled: true,
                                    callbacks: {
                                      title: (context) => {
                                        return context[0].label || '';
                                      }
                                    }
                                  },
                                  // @ts-ignore - Suppress type error for datalabels plugin
                                  datalabels: { 
                                    display: false, // Hide datalabels since we're showing y-axis labels now
                                  }
                                }
                              }}
                            />
                          </Box>
                        </Box>
                        {/* View Report button with proper spacing */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenReport(student.id)}
                            startIcon={<Equalizer />}
                            sx={{
                              borderColor: 'rgba(204, 115, 248, 0.5)',
                              color: '#cc73f8',
                              px: 2,
                              py: 0.75,
                              '&:hover': {
                                borderColor: '#cc73f8',
                                backgroundColor: 'rgba(204, 115, 248, 0.1)',
                              }
                            }}
                          >
                            View Report
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, flexDirection: 'column', gap: 2 }}>
                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          No exam results available
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleOpen}
                          startIcon={<Add />}
                          sx={{
                            borderColor: 'rgba(204, 115, 248, 0.5)',
                            color: '#cc73f8',
                            '&:hover': {
                              borderColor: '#cc73f8',
                              backgroundColor: 'rgba(204, 115, 248, 0.1)',
                            }
                          }}
                        >
                          Add Result
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
                      </Grid>
            );
          })}
                    </Grid>
      ) : (
        // Table View
        <TableContainer 
          component={Paper}
          sx={{
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
                      <Table>
            <TableHead sx={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.2)'
            }}>
                          <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Class</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Exam</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Average</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Grade</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
              {filteredResults.map((result) => {
                const student = students.find(s => s.id === result.studentId);
                if (!student) return null;
                
                const totalMarks = result.subjectMarks.reduce((sum, mark) => sum + mark.marksObtained, 0);
                const totalPossibleMarks = result.subjectMarks.reduce((sum, mark) => {
                  const subject = subjects.find(s => s.id === mark.subjectId);
                  return sum + (subject ? subject.totalMarks : 0);
                }, 0);
                
                const percentage = totalPossibleMarks > 0 ? (totalMarks / totalPossibleMarks) * 100 : 0;
                const grade = getGrade(percentage);
                            
                            return (
                              <TableRow key={result.id}>
                                <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: 'rgba(204, 115, 248, 0.3)', 
                          color: '#cc73f8',
                          fontSize: '0.875rem',
                          fontWeight: 'bold'
                        }}>
                          {student.name.charAt(0)}
                        </Avatar>
                        <Typography sx={{ color: 'white' }}>{student.name}</Typography>
                      </Box>
                                </TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{getClassName(student.classId)}</TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{result.examName}</TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{new Date(result.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={percentage} 
                          sx={{ 
                            width: 60,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getGradeColor(percentage),
                              borderRadius: 4,
                            }
                          }} 
                        />
                        <Typography sx={{ color: 'white' }}>{percentage.toFixed(1)}%</Typography>
                      </Box>
                                    </TableCell>
                    <TableCell>
                                  <Chip
                        label={grade} 
                                    size="small"
                                    sx={{
                          bgcolor: 'rgba(204, 115, 248, 0.2)', 
                                      color: getGradeColor(percentage),
                          fontWeight: 'bold',
                          borderRadius: '12px',
                                    }}
                                  />
                                </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          setCurrentStudentForMenu(student);
                          handleCardMenuOpen(e, student);
                        }}
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            color: '#cc73f8',
                            backgroundColor: 'rgba(204, 115, 248, 0.1)',
                          }
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
      )}

      {/* Card Menu */}
      <Menu
        anchorEl={cardMenuAnchor}
        open={Boolean(cardMenuAnchor)}
        onClose={handleCardMenuClose}
        TransitionComponent={Fade}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '12px',
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            color: 'white',
            minWidth: '180px',
          }
        }}
      >
        <MenuItem onClick={handleEditResult}>
          <ListItemIcon>
            <Edit fontSize="small" sx={{ color: '#cc73f8' }} />
          </ListItemIcon>
          <ListItemText>Edit Result</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteResult}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: '#f44336' }} />
          </ListItemIcon>
          <ListItemText>Delete Result</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSendReport}>
          <ListItemIcon>
            <Email fontSize="small" sx={{ color: '#2196f3' }} />
          </ListItemIcon>
          <ListItemText>Send Report</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDownloadPDF}>
          <ListItemIcon>
            <Download fontSize="small" sx={{ color: '#4caf50' }} />
          </ListItemIcon>
          <ListItemText>Download PDF</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Add/Edit Result Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1a1a2e',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ 
          color: 'white', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          pb: 2,
          fontWeight: 'bold'
        }}>
          {currentEditingResultId
            ? `Edit Exam Result${selectedStudent ? ` for ${selectedStudent.name}` : ''}`
            : selectedStudent 
              ? `Add Exam Result for ${selectedStudent.name}` 
              : 'Add Exam Result'
          }
        </DialogTitle>
        <DialogContent sx={{ 
          mt: 2,
          backgroundColor: 'rgba(18, 18, 40, 0.5)',
          backdropFilter: 'blur(15px)',
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
            <Autocomplete
              options={students}
              getOptionLabel={(option) => `${option.name} (Class ${getClassName(option.classId)})`}
              value={selectedStudent}
              onChange={(_, newValue) => setSelectedStudent(newValue)}
              renderInput={(params) => <TextField {...params} label="Select Student" required />}
              ListboxProps={{
                style: { 
                  backgroundColor: '#1f1f3d', 
                  borderRadius: '12px',
                }
              }}
              renderOption={(props, option) => (
                <MenuItem {...props} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(204, 115, 248, 0.15)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(204, 115, 248, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(204, 115, 248, 0.25)',
                    },
                  },
                }}>
                  <Avatar 
                    src={option.profileImage} 
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      fontSize: '0.75rem',
                      bgcolor: 'rgba(204, 115, 248, 0.3)',
                      color: '#cc73f8',
                    }}
                  >
                    {option.name.charAt(0)}
                  </Avatar>
                  {option.name} <Typography variant="caption" sx={{ ml: 0.5, color: 'rgba(255, 255, 255, 0.5)' }}>
                    ({getClassName(option.classId)})
                  </Typography>
                </MenuItem>
              )}
              sx={{
                '& .MuiInputBase-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(204, 115, 248, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#cc73f8',
                  }
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#cc73f8',
                  },
                }
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Exam Name"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  fullWidth
                  required
                  sx={{
                    '& .MuiInputBase-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(204, 115, 248, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#cc73f8',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-focused': {
                        color: '#cc73f8',
                      },
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Exam Date"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(204, 115, 248, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#cc73f8',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-focused': {
                        color: '#cc73f8',
                      },
                    },
                    '& .MuiInputBase-input[type="date"]::-webkit-calendar-picker-indicator': {
                      filter: 'invert(1) hue-rotate(180deg) brightness(1.5)',
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, color: 'white', fontWeight: 'medium' }}>
              Subject Marks
            </Typography>

            {/* Show the list of added subjects */}
            {subjects.length > 0 && (
              <Paper 
                sx={{ 
                  p: 2, 
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                  mb: 3
                }}
              >
            <Grid container spacing={2}>
                  {subjects.map((subject) => {
                    const subjectMark = subjectMarks.find(m => m.subjectId === subject.id);
                    const mark = subjectMark ? subjectMark.marksObtained : 0;
                    
                    return (
                      <Grid item xs={12} sm={6} md={4} key={subject.id}>
                        <Box sx={{ position: 'relative' }}>
                  <TextField
                    label={subject.name}
                    type="number"
                            value={mark}
                            onChange={(e) => handleSubjectMarkChange(subject.id, Number(e.target.value))}
                            fullWidth
                            InputProps={{
                              inputProps: { min: 0, max: subject.totalMarks },
                              endAdornment: (
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                  / {subject.totalMarks}
                                </Typography>
                              ),
                            }}
                            sx={{
                              '& .MuiInputBase-root': {
                                color: 'white',
                                '& fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.1)',
                                  borderRadius: '16px',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(204, 115, 248, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#cc73f8',
                                }
                              },
                              '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&.Mui-focused': {
                                  color: '#cc73f8',
                                },
                              }
                            }}
                          />
                          <IconButton 
                            size="small" 
                            onClick={() => handleRemoveCustomSubject(subject.id)}
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              backgroundColor: 'rgba(255, 76, 76, 0.1)',
                              border: '1px solid rgba(255, 76, 76, 0.2)',
                              color: '#ff4c4c',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 76, 76, 0.2)',
                              }
                            }}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Paper>
            )}

            {/* Add subject form - now the main UI element */}
            <Paper 
              sx={{ 
                p: 2, 
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2, color: 'white' }}>
                Add Subject
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={5}>
                  <TextField
                    label="Subject Name"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    fullWidth
                    placeholder="Enter subject name"
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '16px',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(204, 115, 248, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#cc73f8',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                          color: '#cc73f8',
                        },
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Total Marks"
                    type="number"
                    value={newSubjectTotalMarks}
                    onChange={(e) => setNewSubjectTotalMarks(Number(e.target.value))}
                    fullWidth
                    InputProps={{
                      inputProps: { min: 1 },
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '16px',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(204, 115, 248, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#cc73f8',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                          color: '#cc73f8',
                        },
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    onClick={handleAddCustomSubject}
                    fullWidth
                    sx={{
                      background: 'linear-gradient(135deg, #cc73f8 0%, #b35de0 100%)',
                      boxShadow: '0 4px 15px rgba(204, 115, 248, 0.3)',
                      borderRadius: '10px',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(204, 115, 248, 0.4)',
                      },
                    }}
                  >
                    Add Subject
                  </Button>
            </Grid>
              </Grid>
              
              {subjects.length === 0 && (
                <Box sx={{ mt: 2, p: 2, textAlign: 'center', border: '1px dashed rgba(255, 255, 255, 0.2)', borderRadius: '12px' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    No subjects added yet. Add subjects using the form above.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          py: 2.5, 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)' 
        }}>
          <Button 
            onClick={handleClose} 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!selectedStudent || !examName || !examDate || subjects.length === 0}
            sx={{
              background: 'linear-gradient(135deg, #cc73f8 0%, #9940D3 100%)',
              boxShadow: '0 4px 15px rgba(204, 115, 248, 0.3)',
              borderRadius: '8px',
              px: 3,
              '&:hover': {
                boxShadow: '0 6px 20px rgba(204, 115, 248, 0.4)',
              },
              '&.Mui-disabled': {
                background: 'rgba(204, 115, 248, 0.3)',
                color: 'rgba(255, 255, 255, 0.4)',
              }
            }}
          >
            {currentEditingResultId ? 'Update Result' : 'Save Result'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Select Exam to Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1a1a2e',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ 
          color: 'white', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          pb: 2,
          fontWeight: 'bold'
        }}>
          Select Exam to Edit
        </DialogTitle>
        <DialogContent sx={{ 
          mt: 2,
          backgroundColor: 'rgba(18, 18, 40, 0.5)',
          backdropFilter: 'blur(15px)',
        }}>
          <List>
            {currentStudentForMenu && getStudentResults(currentStudentForMenu.id).map((result) => (
              <ListItem
                key={result.id}
                button
                onClick={() => {
                  setSelectedStudent(currentStudentForMenu);
                  setExamName(result.examName);
                  setExamDate(result.date);
                  setCurrentEditingResultId(result.id);
                  
                  // Reconstruct subjects from the result's subjectMarks
                  const reconstructedSubjects = result.subjectMarks.map(mark => {
                    // Try to find any existing subject definition
                    const existingSubject = subjects.find(s => s.id === mark.subjectId);
                    
                    // Create a new subject if none exists
                    if (!existingSubject) {
                      const totalMarks = mark.marksObtained > 100 ? mark.marksObtained : 100;
                      return {
                        id: mark.subjectId,
                        name: `Subject ${mark.subjectId.split('-')[0]}`, // Extract name from ID if possible 
                        totalMarks
                      };
                    }
                    
                    return existingSubject;
                  });
                  
                  setSubjects(reconstructedSubjects);
                  setSubjectMarks(result.subjectMarks);
                  setOpen(true);
                  setEditDialogOpen(false);
                }}
                sx={{
                  borderRadius: '12px',
                  mb: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(204, 115, 248, 0.1)',
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ color: 'white', fontWeight: 'medium' }}>
                      {result.examName}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      {new Date(result.date).toLocaleDateString()}
                    </Typography>
                  }
                />
                <Chip
                  label={`${result.subjectMarks.length} subjects`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(204, 115, 248, 0.15)',
                    color: 'white',
                    borderRadius: '12px',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          py: 2.5, 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)' 
        }}>
          <Button 
            onClick={() => setEditDialogOpen(false)} 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Other dialogs and modals will go here */}
    </Box>
  );
};

export default PerformanceTracking; 