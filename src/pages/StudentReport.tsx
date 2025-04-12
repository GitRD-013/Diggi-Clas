import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import {
  ArrowBack,
  Print,
  Share,
  Download,
  Equalizer,
  School,
  EmojiEvents,
  TrendingUp,
  Assignment
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  RadialLinearScale,
  ArcElement
} from 'chart.js';
import { Bar, Line, Radar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
  ChartDataLabels
);

// Define types
interface Student {
  id: string;
  name: string;
  className: string;
  avatar?: string;
}

interface Subject {
  id: string;
  name: string;
  totalMarks: number;
}

interface SubjectMark {
  subjectId: string;
  marksObtained: number;
}

interface ExamResult {
  id: string;
  studentId: string;
  examName: string;
  date: string;
  subjectMarks: SubjectMark[];
}

const StudentReport = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  
  // State for student data
  const [student, setStudent] = useState<Student | null>(null);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [teacherComments, setTeacherComments] = useState<string>('');
  const [isEditingComments, setIsEditingComments] = useState(false);

  // Mock data - In a real app, this would come from an API or context
  useEffect(() => {
    // Simulate loading data
    const loadData = () => {
      // This would be replaced with actual API calls
      const mockStudent = {
        id: studentId || '',
        name: 'Student Name',
        className: 'Class X',
        avatar: '',
      };

      const mockSubjects = [
        { id: 'math', name: 'Mathematics', totalMarks: 100 },
        { id: 'science', name: 'Science', totalMarks: 100 },
        { id: 'english', name: 'English', totalMarks: 100 },
        { id: 'history', name: 'History', totalMarks: 100 },
        { id: 'geography', name: 'Geography', totalMarks: 100 },
      ];

      const mockExamResults = [
        {
          id: 'exam1',
          studentId: studentId || '',
          examName: 'Mid Term',
          date: '2025-02-15',
          subjectMarks: [
            { subjectId: 'math', marksObtained: 85 },
            { subjectId: 'science', marksObtained: 78 },
            { subjectId: 'english', marksObtained: 92 },
            { subjectId: 'history', marksObtained: 65 },
            { subjectId: 'geography', marksObtained: 70 },
          ],
        },
        {
          id: 'exam2',
          studentId: studentId || '',
          examName: 'Final Term',
          date: '2025-04-05',
          subjectMarks: [
            { subjectId: 'math', marksObtained: 90 },
            { subjectId: 'science', marksObtained: 82 },
            { subjectId: 'english', marksObtained: 88 },
            { subjectId: 'history', marksObtained: 75 },
            { subjectId: 'geography', marksObtained: 80 },
          ],
        },
      ];

      setStudent(mockStudent);
      setSubjects(mockSubjects);
      setExamResults(mockExamResults);
      setSelectedExam(mockExamResults[0].id);
      setLoading(false);
    };

    loadData();
  }, [studentId]);

  // Prepare chart data
  const prepareProgressChartData = () => {
    const labels = examResults.map(result => result.examName);
    const datasets = subjects.map((subject, index) => {
      // Different blue shades for different subjects
      const blueShades = [
        'rgba(54, 162, 235, 0.7)',   // Blue
        'rgba(30, 144, 255, 0.7)',   // Dodger Blue
        'rgba(0, 191, 255, 0.7)',    // Deep Sky Blue
        'rgba(65, 105, 225, 0.7)',   // Royal Blue
        'rgba(100, 149, 237, 0.7)',  // Cornflower Blue
      ];
      
      return {
        label: subject.name,
        data: examResults.map(result => {
          const mark = result.subjectMarks.find(m => m.subjectId === subject.id);
          return mark ? mark.marksObtained : 0;
        }),
        borderColor: blueShades[index % blueShades.length].replace('0.7', '1'),
        backgroundColor: blueShades[index % blueShades.length],
        tension: 0.3,
      };
    });

    return { labels, datasets };
  };

  const prepareSubjectPerformanceData = () => {
    // Use the latest exam result
    const latestExam = examResults.length > 0 ? examResults[examResults.length - 1] : null;
    
    if (!latestExam) return { labels: [], datasets: [] };
    
    const labels = subjects.map(subject => subject.name);
    const data = subjects.map(subject => {
      const mark = latestExam.subjectMarks.find(m => m.subjectId === subject.id);
      return mark ? mark.marksObtained : 0;
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Performance',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        }
      ]
    };
  };

  const prepareSkillsRadarData = () => {
    // Use the latest exam result
    const latestExam = examResults.length > 0 ? examResults[examResults.length - 1] : null;
    
    if (!latestExam) return { labels: [], datasets: [] };
    
    const labels = subjects.map(subject => subject.name);
    const data = subjects.map(subject => {
      const mark = latestExam.subjectMarks.find(m => m.subjectId === subject.id);
      return mark ? mark.marksObtained : 0;
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Skills',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
        }
      ]
    };
  };

  // Calculate overall performance
  const calculateOverallPerformance = () => {
    if (examResults.length === 0) return 0;
    
    // Use the latest exam result
    const latestExam = examResults[examResults.length - 1];
    const totalMarksObtained = latestExam.subjectMarks.reduce((sum, mark) => sum + mark.marksObtained, 0);
    const totalPossibleMarks = subjects.length * 100; // Assuming each subject has 100 total marks
    
    return (totalMarksObtained / totalPossibleMarks) * 100;
  };

  // Handle back button
  const handleBack = () => {
    navigate('/dashboard/performance');
  };

  // Handle print report
  const handlePrintReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with back button and actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              color: '#fff',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Back to Performance Tracking
        </Button>
        
        <Box>
          <Tooltip title="Print Report">
            <IconButton 
              onClick={handlePrintReport}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': { color: '#fff' },
                mx: 1 
              }}
            >
              <Print />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Share Report">
            <IconButton 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': { color: '#fff' },
                mx: 1 
              }}
            >
              <Share />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Download PDF">
            <IconButton 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': { color: '#fff' },
                mx: 1 
              }}
            >
              <Download />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Student Info Card */}
      <Paper 
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={2} md={1}>
            <Avatar
              sx={{ 
                width: 80, 
                height: 80,
                bgcolor: 'rgba(54, 162, 235, 0.7)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {student?.name.charAt(0)}
            </Avatar>
          </Grid>
          
          <Grid item xs={12} sm={10} md={7}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {student?.name}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Chip 
                icon={<School />} 
                label={student?.className} 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  '& .MuiChip-icon': { color: 'rgba(54, 162, 235, 0.9)' },
                }}
              />
              
              <Chip 
                icon={<EmojiEvents />} 
                label={`Overall: ${calculateOverallPerformance().toFixed(1)}%`} 
                sx={{ 
                  bgcolor: 'rgba(54, 162, 235, 0.2)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  '& .MuiChip-icon': { color: 'rgba(54, 162, 235, 0.9)' },
                }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                Report generated on: {new Date().toLocaleDateString()}
              </Typography>
              
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Academic Year: 2024-2025
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Exam Selection */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Select Exam
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {examResults.map((exam) => (
            <Button
              key={exam.id}
              variant={selectedExam === exam.id ? 'contained' : 'outlined'}
              onClick={() => setSelectedExam(exam.id)}
              sx={{
                minWidth: 120,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: selectedExam === exam.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  borderColor: 'rgba(54, 162, 235, 0.7)',
                  backgroundColor: selectedExam === exam.id ? 'rgba(54, 162, 235, 0.8)' : 'rgba(54, 162, 235, 0.1)',
                },
              }}
            >
              {exam.examName}
            </Button>
          ))}
        </Box>
      </Box>
      
      {/* Performance Overview */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        <Equalizer sx={{ mr: 1 }} /> Performance Overview
      </Typography>
      
      <Grid container spacing={3}>
        {/* Subject Performance Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            height: '100%',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Subject Performance
              </Typography>
              
              <Box sx={{ height: 300 }}>
                <Bar 
                  data={prepareSubjectPerformanceData()} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: {
                      y: {
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                        grid: {
                          display: false,
                        },
                      },
                      x: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                      datalabels: {
                        color: 'white',
                        anchor: 'end',
                        align: 'end',
                        formatter: (value) => `${value}%`,
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Skills Radar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            height: '100%',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Skills Assessment
              </Typography>
              
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <Radar 
                  data={prepareSkillsRadarData()} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      r: {
                        min: 0,
                        max: 100,
                        ticks: {
                          display: false,
                        },
                        pointLabels: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                        angleLines: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                      datalabels: {
                        display: false,
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Progress Over Time */}
        <Grid item xs={12}>
          <Card sx={{
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ mr: 1 }} /> Progress Over Time
              </Typography>
              
              <Box sx={{ height: 300 }}>
                <Line 
                  data={prepareProgressChartData()} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                      },
                      x: {
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          color: 'rgba(255, 255, 255, 0.7)',
                          boxWidth: 12,
                          padding: 15,
                        },
                      },
                      datalabels: {
                        display: false,
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Exam Results Table */}
      <Typography variant="h5" sx={{ mt: 5, mb: 3, fontWeight: 'bold' }}>
        Detailed Exam Results
      </Typography>
      
      <TableContainer component={Paper} sx={{
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        mb: 4,
      }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            <TableRow>
              <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 'bold' }}>Exam</TableCell>
              <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 'bold' }}>Date</TableCell>
              {subjects.map(subject => (
                <TableCell key={subject.id} sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 'bold' }}>
                  {subject.name}
                </TableCell>
              ))}
              <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 'bold' }}>Average</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examResults.map(result => {
              const totalMarks = result.subjectMarks.reduce((sum, mark) => sum + mark.marksObtained, 0);
              const average = (totalMarks / result.subjectMarks.length).toFixed(1);
              
              return (
                <TableRow key={result.id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>{result.examName}</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {new Date(result.date).toLocaleDateString()}
                  </TableCell>
                  {subjects.map(subject => {
                    const mark = result.subjectMarks.find(m => m.subjectId === subject.id);
                    const score = mark ? mark.marksObtained : '-';
                    const total = subject.totalMarks;
                    
                    // Color based on score
                    let color = 'rgba(255, 255, 255, 0.7)';
                    if (typeof score === 'number') {
                      if (score >= 80) color = 'rgba(46, 204, 113, 0.9)'; // Green for high scores
                      else if (score >= 60) color = 'rgba(241, 196, 15, 0.9)'; // Yellow for medium scores
                      else color = 'rgba(231, 76, 60, 0.9)'; // Red for low scores
                    }
                    
                    return (
                      <TableCell key={subject.id} sx={{ color }}>
                        {score}/{total}
                      </TableCell>
                    );
                  })}
                  <TableCell sx={{ 
                    color: 'rgba(54, 162, 235, 0.9)',
                    fontWeight: 'bold',
                  }}>
                    {average}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Teacher Comments */}
      <Card sx={{
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        mb: 4,
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Teacher's Comments
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setIsEditingComments(!isEditingComments)}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  borderColor: 'rgba(54, 162, 235, 0.7)',
                  backgroundColor: 'rgba(54, 162, 235, 0.1)',
                },
              }}
            >
              {isEditingComments ? 'Save' : 'Edit'}
            </Button>
          </Box>
          
          {isEditingComments ? (
            <TextField
              fullWidth
              multiline
              rows={4}
              value={teacherComments}
              onChange={(e) => setTeacherComments(e.target.value)}
              placeholder="Enter teacher's comments here..."
              sx={{
                '& .MuiInputBase-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(54, 162, 235, 0.7)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(54, 162, 235, 0.7)',
                  },
                },
              }}
            />
          ) : (
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic' }}>
              {teacherComments || 'No comments added yet.'}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default StudentReport;
