import { useState, useEffect, useMemo } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Checkbox,
  TextField,
  Divider,
  Badge,
  Collapse,
  SelectChangeEvent,
  InputBase,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Warning,
  ChevronLeft,
  ChevronRight,
  CalendarToday,
  Print,
  FileDownload,
  FilterList,
  Close,
  Search,
  Event,
  DateRange,
  ViewDay,
  ViewWeek,
} from '@mui/icons-material';
import { format, addMonths, subMonths, getDaysInMonth, isSameDay, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { useClasses } from '../contexts/ClassContext';
import { useStudents } from '../contexts/StudentContext';
import { useSearch } from '../components/Layout';

// Types
interface Student {
  id: string;
  name: string;
  classId: string;
  imageUrl?: string;
  profileImage?: string;
}

type AttendanceStatus = 'present' | 'absent' | 'late' | 'unrecorded';

interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
}

// Filter interface for attendance
interface AttendanceFilters {
  studentName: string[];
  class: string[];
  dateRange: {
    start: string;
    end: string;
  };
  attendanceStatus: AttendanceStatus[];
  searchQuery: string;
}

const AttendanceManagement = () => {
  const { classes } = useClasses();
  const { students } = useStudents();
  const { searchQuery, setSearchQuery } = useSearch();
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<AttendanceFilters>({
    studentName: [],
    class: [],
    dateRange: {
      start: format(new Date(), 'yyyy-MM-dd'),
      end: format(new Date(), 'yyyy-MM-dd'),
    },
    attendanceStatus: [],
    searchQuery: '',
  });

  // Initialize records for each student
  const generateInitialAttendance = (): AttendanceRecord[] => {
    const records: AttendanceRecord[] = [];
    const today = new Date();
    const daysInMonth = getDaysInMonth(today);
    
    students.forEach((student) => {
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(today.getFullYear(), today.getMonth(), day);
        
        // Skip future dates and weekends
        if (date > today || date.getDay() === 0 || date.getDay() === 6) continue;
        
        // Random status for past dates (for demo purposes)
        const statuses: AttendanceStatus[] = ['present', 'absent', 'late'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        records.push({
          id: `${student.id}-${format(date, 'yyyy-MM-dd')}`,
          studentId: student.id,
          date: format(date, 'yyyy-MM-dd'),
          status: randomStatus,
        });
      }
    });
    
    return records;
  };

  // State
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filteredAttendanceRecords, setFilteredAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Generate initial attendance records when students are loaded
  useEffect(() => {
    if (students.length > 0) {
      setAttendanceRecords(generateInitialAttendance());
    }
  }, [students]);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [filters, attendanceRecords, searchQuery]);

  // Function to apply all active filters
  const applyFilters = () => {
    let result = [...attendanceRecords];
    
    // Filter by student name
    if (filters.studentName.length > 0) {
      result = result.filter(record => 
        filters.studentName.includes(record.studentId)
      );
    }
    
    // Filter by class
    if (filters.class.length > 0) {
      const studentIdsInSelectedClasses = students
        .filter(student => filters.class.includes(student.classId))
        .map(student => student.id);
      
      result = result.filter(record => 
        studentIdsInSelectedClasses.includes(record.studentId)
      );
    }
    
    // Filter by date range
    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      result = result.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }
    
    // Filter by attendance status
    if (filters.attendanceStatus.length > 0) {
      result = result.filter(record => 
        filters.attendanceStatus.includes(record.status)
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchingStudentIds = students.filter(student => 
        student.name.toLowerCase().includes(query) ||
        getClassName(student.classId).toLowerCase().includes(query)
      ).map(student => student.id);
      
      result = result.filter(record => 
        matchingStudentIds.includes(record.studentId)
      );
    }
    
    setFilteredAttendanceRecords(result);
  };

  // Sync local search state with context
  useEffect(() => {
    if (searchQuery !== filters.searchQuery) {
      handleFilterChange('searchQuery', searchQuery);
    }
  }, [searchQuery, filters.searchQuery]);

  // Handle filter changes
  const handleFilterChange = (filterType: keyof AttendanceFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle class filter change
  const handleClassFilterChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    handleFilterChange('class', typeof value === 'string' ? value.split(',') : value);
  };

  // Handle student name filter change
  const handleStudentNameFilterChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    handleFilterChange('studentName', typeof value === 'string' ? value.split(',') : value);
  };

  // Handle attendance status filter change
  const handleAttendanceStatusFilterChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    handleFilterChange('attendanceStatus', typeof value === 'string' ? value.split(',') : value);
  };

  // Handle search query change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    handleFilterChange('searchQuery', query);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      studentName: [],
      class: [],
      dateRange: {
        start: format(new Date(), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd'),
      },
      attendanceStatus: [],
      searchQuery: '',
    });
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.studentName.length > 0) count++;
    if (filters.class.length > 0) count++;
    if (filters.attendanceStatus.length > 0) count++;
    if (filters.searchQuery) count++;
    
    // Check if date range is different from default (today)
    const today = format(new Date(), 'yyyy-MM-dd');
    if (filters.dateRange.start !== today || filters.dateRange.end !== today) count++;
    
    return count;
  };

  // Computed values
  const daysInMonth = getDaysInMonth(currentDate);
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthName = format(currentDate, 'MMMM yyyy');
  
  // Calendar dates
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => 
    new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)
  );

  // Filtered students based on class selection
  const filteredStudents = useMemo(() => {
    return selectedClass === 'all' 
    ? students 
    : students.filter(student => student.classId === selectedClass);
  }, [students, selectedClass]);

  // Get filtered student IDs for display in tables
  const filteredStudentIds = useMemo(() => {
    // Apply student filters
    let studentIds = filteredStudents.map(student => student.id);
    
    // Filter by student name if specified
    if (filters.studentName.length > 0) {
      studentIds = studentIds.filter(id => filters.studentName.includes(id));
    }
    
    // Filter by class if specified
    if (filters.class.length > 0) {
      const studentIdsInSelectedClasses = students
        .filter(student => filters.class.includes(student.classId))
        .map(student => student.id);
      
      studentIds = studentIds.filter(id => studentIdsInSelectedClasses.includes(id));
    }
    
    return studentIds;
  }, [filteredStudents, filters.studentName, filters.class, students]);

  // Handle navigation
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Handle attendance update
  const updateAttendance = (studentId: string, date: Date, status: AttendanceStatus) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const recordId = `${studentId}-${dateString}`;
    
    // Check if record exists
    const existingRecordIndex = attendanceRecords.findIndex(
      (record) => record.id === recordId
    );
    
    if (existingRecordIndex !== -1) {
      // Update existing record
      const updatedRecords = [...attendanceRecords];
      updatedRecords[existingRecordIndex] = {
        ...updatedRecords[existingRecordIndex],
        status,
      };
      setAttendanceRecords(updatedRecords);
    } else {
      // Create new record
      const newRecord: AttendanceRecord = {
        id: recordId,
        studentId,
        date: dateString,
        status,
      };
      setAttendanceRecords([...attendanceRecords, newRecord]);
    }
  };

  // Get status for a specific student and date
  const getAttendanceStatus = (studentId: string, date: Date): AttendanceStatus => {
    const dateString = format(date, 'yyyy-MM-dd');
    const record = attendanceRecords.find(
      (record) => record.studentId === studentId && record.date === dateString
    );
    return record ? record.status : 'unrecorded';
  };

  // Calculate attendance statistics for a student
  const calculateStats = (studentId: string) => {
    const studentRecords = attendanceRecords.filter(record => record.studentId === studentId);
    const total = studentRecords.length;
    
    if (total === 0) return { present: 0, absent: 0, late: 0, presentPercentage: 0 };
    
    const present = studentRecords.filter(record => record.status === 'present').length;
    const absent = studentRecords.filter(record => record.status === 'absent').length;
    const late = studentRecords.filter(record => record.status === 'late').length;
    
    return {
      present,
      absent,
      late,
      presentPercentage: Math.round((present / total) * 100),
    };
  };

  // Render status icon
  const renderStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return <CheckCircle sx={{ color: '#4ecdc4' }} />;
      case 'absent':
        return <Cancel sx={{ color: '#ff6b6b' }} />;
      case 'late':
        return <Warning sx={{ color: '#ffd93d' }} />;
      default:
        return <Box sx={{ width: 24, height: 24 }} />;
    }
  };

  // Get cell color based on status
  const getCellColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return 'rgba(78, 205, 196, 0.1)';
      case 'absent':
        return 'rgba(255, 107, 107, 0.1)';
      case 'late':
        return 'rgba(255, 217, 61, 0.1)';
      default:
        return 'transparent';
    }
  };

  // Cycle through statuses when cell is clicked
  const cycleStatus = (currentStatus: AttendanceStatus): AttendanceStatus => {
    const statuses: AttendanceStatus[] = ['present', 'absent', 'late', 'unrecorded'];
    const currentIndex = statuses.indexOf(currentStatus);
    return statuses[(currentIndex + 1) % statuses.length];
  };

  // Find class name by id for display
  const getClassName = (classId: string) => {
    const foundClass = classes.find(cls => cls.id === classId);
    return foundClass ? foundClass.name : 'Unknown';
  };

  // Add bulk actions
  const handleBulkAction = (status: 'present' | 'absent' | 'late') => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const updatedRecords = [...attendanceRecords];
    
    selectedStudents.forEach(studentId => {
      const recordId = `${studentId}-${today}`;
      const existingRecordIndex = updatedRecords.findIndex(r => r.id === recordId);
      
      if (existingRecordIndex !== -1) {
        updatedRecords[existingRecordIndex] = {
          ...updatedRecords[existingRecordIndex],
          status,
        };
      } else {
        updatedRecords.push({
          id: recordId,
          studentId,
          date: today,
          status,
        });
      }
    });
    
    setAttendanceRecords(updatedRecords);
    setSelectedStudents([]);
  };

  // Add export functionality
  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    // Implement export logic here
    console.log(`Exporting as ${format}`);
  };

  // Add function to check if a date is today
  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  // Modify the table cell rendering to highlight current day
  const renderTableCell = (student: Student, day: Date) => {
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    const isInFuture = day > new Date();
    const status = getAttendanceStatus(student.id, day);

  return (
      <TableCell 
        key={day.toString()} 
        align="center"
        onClick={() => {
          if (!isWeekend && !isInFuture) {
            updateAttendance(student.id, day, cycleStatus(status));
          }
        }}
        sx={{ 
          cursor: isWeekend || isInFuture ? 'default' : 'pointer',
          bgcolor: isToday(day) 
            ? 'rgba(204, 115, 248, 0.2)' 
            : getCellColor(status),
          opacity: isWeekend || isInFuture ? 0.5 : 1,
          transition: 'all 0.2s',
          border: isToday(day) ? '2px solid #cc73f8' : '1px solid rgba(255, 255, 255, 0.1)',
          '&:hover': {
            bgcolor: isWeekend || isInFuture 
              ? getCellColor(status) 
              : 'rgba(204, 115, 248, 0.1)',
          },
        }}
      >
        {renderStatusIcon(status)}
      </TableCell>
    );
  };

  // Modify the table to handle view mode
  const renderAttendanceTable = () => {
    if (viewMode === 'daily') {
      const today = new Date();
      
      // Get students to display based on filters
      const studentsToDisplay = students.filter(student => 
        filteredStudentIds.includes(student.id)
      );
      
      return (
        <TableContainer
          component={Paper} 
        sx={{ 
            mb: 4,
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
            overflow: 'auto',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedStudents.length === studentsToDisplay.length && studentsToDisplay.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudents(studentsToDisplay.map(s => s.id));
                      } else {
                        setSelectedStudents([]);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Student</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Time</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentsToDisplay.map((student, index) => {
                const status = getAttendanceStatus(student.id, today);
                return (
                  <TableRow key={student.id}
                    component={motion.tr}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudents([...selectedStudents, student.id]);
                          } else {
                            setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{ width: 36, height: 36, mr: 1, bgcolor: '#cc73f8' }}
                          src={student.imageUrl || undefined}
                        >
                          {student.name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body1">{student.name}</Typography>
                          <Chip
                            label={`Class ${getClassName(student.classId)}`}
                            size="small"
                            sx={{ bgcolor: 'rgba(204, 115, 248, 0.2)', color: 'white' }}
                          />
        </Box>
        </Box>
                    </TableCell>
                    <TableCell align="center">
                      {renderStatusIcon(status)}
                    </TableCell>
                    <TableCell align="center">
                      {status !== 'unrecorded' ? format(new Date(), 'hh:mm a') : '-'}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                          onClick={() => updateAttendance(student.id, today, 'present')}
                          sx={{
                            color: '#4ecdc4',
                            fontSize: '2rem',
                            minWidth: 'auto',
                            padding: '8px',
            borderRadius: '50%', 
                            '&:hover': {
                              bgcolor: 'rgba(78, 205, 196, 0.1)',
                            },
                          }}
                        >
                          <CheckCircle />
                        </Button>
                        <Button
                          onClick={() => updateAttendance(student.id, today, 'absent')}
                          sx={{
                            color: '#ff6b6b',
                            fontSize: '2rem',
                            minWidth: 'auto',
                            padding: '8px',
            borderRadius: '50%', 
                            '&:hover': {
                              bgcolor: 'rgba(255, 107, 107, 0.1)',
                            },
                          }}
                        >
                          <Cancel />
                        </Button>
                        <Button
                          onClick={() => updateAttendance(student.id, today, 'late')}
                          sx={{
                            color: '#ffd93d',
                            fontSize: '2rem',
                            minWidth: 'auto',
                            padding: '8px',
                            borderRadius: '50%',
                            '&:hover': {
                              bgcolor: 'rgba(255, 217, 61, 0.1)',
                            },
                          }}
                        >
                          <Warning />
                        </Button>
        </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      );
    } else {
      // Monthly view - reorganize columns to place Stats right after today
      // Get students to display based on filters
      const studentsToDisplay = students.filter(student => 
        filteredStudentIds.includes(student.id)
      );
      
      // Separate calendar days into past/today and future days
      const today = new Date();
      const pastAndTodayDays = calendarDays.filter(day => day <= today);
      const futureDays = calendarDays.filter(day => day > today);
      
      return (
      <TableContainer 
        component={Paper} 
        sx={{ 
          mb: 4,
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          overflow: 'auto',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedStudents.length === studentsToDisplay.length && studentsToDisplay.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudents(studentsToDisplay.map(s => s.id));
                      } else {
                        setSelectedStudents([]);
                      }
                    }}
                  />
                </TableCell>
              <TableCell>Student</TableCell>
              {/* Past and today's dates */}
              {pastAndTodayDays.map((day) => (
                <TableCell 
                  key={day.toString()} 
                  align="center"
                  sx={{ 
                    minWidth: '50px',
                    ...(day.getDay() === 0 || day.getDay() === 6 ? { opacity: 0.5 } : {}),
                    ...(isToday(day) ? {
                      bgcolor: 'rgba(204, 115, 248, 0.1)',
                      border: '2px solid #cc73f8',
                    } : {}),
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {format(day, 'd')}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    {format(day, 'EEE')}
                  </Typography>
                </TableCell>
              ))}
              
              {/* Stats column after today */}
              <TableCell align="center" 
                sx={{
                  bgcolor: 'rgba(204, 115, 248, 0.05)',
                  borderLeft: '1px dashed rgba(204, 115, 248, 0.3)',
                  borderRight: '1px dashed rgba(204, 115, 248, 0.3)',
                }}
              >
                Stats
              </TableCell>
              
              {/* Future dates */}
              {futureDays.map((day) => (
                <TableCell 
                  key={day.toString()} 
                  align="center"
                  sx={{ 
                    minWidth: '50px',
                    ...(day.getDay() === 0 || day.getDay() === 6 ? { opacity: 0.5 } : {}),
                    opacity: 0.6, // Future dates are slightly faded
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {format(day, 'd')}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    {format(day, 'EEE')}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
              {studentsToDisplay.map((student, index) => {
              const stats = calculateStats(student.id);
              return (
                <TableRow key={student.id}
                  component={motion.tr}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudents([...selectedStudents, student.id]);
                          } else {
                            setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                          }
                        }}
                      />
                    </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{ width: 36, height: 36, mr: 1, bgcolor: '#cc73f8' }}
                        src={student.profileImage || student.imageUrl || undefined}
                      >
                        {student.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">{student.name}</Typography>
                        <Chip
                          label={`Class ${getClassName(student.classId)}`}
                          size="small"
                          sx={{ bgcolor: 'rgba(204, 115, 248, 0.2)', color: 'white' }}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                  
                  {/* Past and today's attendance cells */}
                  {pastAndTodayDays.map((day) => renderTableCell(student, day))}
                  
                  {/* Stats cell */}
                  <TableCell align="center" 
                        sx={{ 
                      bgcolor: 'rgba(204, 115, 248, 0.05)',
                      borderLeft: '1px dashed rgba(204, 115, 248, 0.3)',
                      borderRight: '1px dashed rgba(204, 115, 248, 0.3)',
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          bgcolor: `rgba(78, 205, 196, ${stats.presentPercentage / 100})`,
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {stats.presentPercentage}%
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={`P: ${stats.present}`}
                          size="small"
                          sx={{ bgcolor: 'rgba(78, 205, 196, 0.2)', color: '#4ecdc4' }}
                        />
                        <Chip
                          label={`A: ${stats.absent}`}
                          size="small"
                          sx={{ bgcolor: 'rgba(255, 107, 107, 0.2)', color: '#ff6b6b' }}
                        />
                        <Chip
                          label={`L: ${stats.late}`}
                          size="small"
                          sx={{ bgcolor: 'rgba(255, 217, 61, 0.2)', color: '#ffd93d' }}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                  
                  {/* Future attendance cells */}
                  {futureDays.map((day) => renderTableCell(student, day))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      );
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4">Attendance Management</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* View Mode Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newValue) => newValue && setViewMode(newValue)}
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
            <ToggleButton value="daily">
              <Tooltip title="Daily View">
                <ViewDay fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="monthly">
              <Tooltip title="Monthly View">
                <DateRange fontSize="small" />
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

          {/* Export Options */}
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={() => handleExport('csv')}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '&:hover': {
                borderColor: '#cc73f8',
                bgcolor: 'rgba(204, 115, 248, 0.1)',
              },
            }}
          >
            Export
          </Button>

          {/* Print Button */}
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={() => window.print()}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '&:hover': {
                borderColor: '#cc73f8',
                bgcolor: 'rgba(204, 115, 248, 0.1)',
              },
            }}
          >
            Print
          </Button>
        </Box>
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
              Filter Attendance
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
                }}>Student Name</InputLabel>
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
                            onDelete={() => {
                              const newSelected = filters.studentName.filter(id => id !== value);
                              handleFilterChange('studentName', newSelected);
                            }}
                            deleteIcon={<Close fontSize="small" />}
                            sx={{ 
                              bgcolor: 'rgba(204, 115, 248, 0.2)', 
                              color: 'white',
                              borderRadius: '16px',
                              '& .MuiChip-deleteIcon': {
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&:hover': {
                                  color: 'white',
                                },
                              },
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(204, 115, 248, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#cc73f8',
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: 'rgba(18, 18, 40, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
                        borderRadius: '16px',
                        '& .MuiMenuItem-root': {
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(204, 115, 248, 0.15)',
                          },
                          '&.Mui-selected': {
                            bgcolor: 'rgba(204, 115, 248, 0.2)',
                            '&:hover': {
                              bgcolor: 'rgba(204, 115, 248, 0.25)',
                            },
                          },
                        }
                      }
                    }
                  }}
                >
                  {students.map((student) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Class/Course Filter */}
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
                }}>Class/Course</InputLabel>
                <Select
                  multiple
                  value={filters.class}
                  onChange={handleClassFilterChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={getClassName(value)}
                          size="small"
                          onDelete={() => {
                            const newSelected = filters.class.filter(id => id !== value);
                            handleFilterChange('class', newSelected);
                          }}
                          deleteIcon={<Close fontSize="small" />}
                          sx={{ 
                            bgcolor: 'rgba(204, 115, 248, 0.2)', 
                            color: 'white',
                            borderRadius: '16px',
                            '& .MuiChip-deleteIcon': {
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&:hover': {
                                color: 'white',
                              },
                            },
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(204, 115, 248, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#cc73f8',
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: 'rgba(18, 18, 40, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
                        borderRadius: '16px',
                        '& .MuiMenuItem-root': {
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(204, 115, 248, 0.15)',
                          },
                          '&.Mui-selected': {
                            bgcolor: 'rgba(204, 115, 248, 0.2)',
                            '&:hover': {
                              bgcolor: 'rgba(204, 115, 248, 0.25)',
                            },
                          },
                        }
                      }
                    }
                  }}
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Date Range Filter */}
            <Grid item xs={12} md={6} lg={3}>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                Date Range
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="From"
                  type="date"
                  size="small"
                  value={filters.dateRange.start}
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      dateRange: {
                        ...filters.dateRange,
                        start: e.target.value
                      }
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{
                    '& .MuiInputBase-root': {
                      color: 'white',
                      borderRadius: '16px',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(204, 115, 248, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#cc73f8',
                      },
                      '& input::-webkit-calendar-picker-indicator': {
                        filter: 'invert(1)',
                        marginRight: '8px',
                        cursor: 'pointer',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />
                <TextField
                  label="To"
                  type="date"
                  size="small"
                  value={filters.dateRange.end}
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      dateRange: {
                        ...filters.dateRange,
                        end: e.target.value
                      }
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{
                    '& .MuiInputBase-root': {
                      color: 'white',
                      borderRadius: '16px',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(204, 115, 248, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#cc73f8',
                      },
                      '& input::-webkit-calendar-picker-indicator': {
                        filter: 'invert(1)',
                        marginRight: '8px',
                        cursor: 'pointer',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />
              </Box>
            </Grid>
            
            {/* Attendance Status Filter */}
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
                }}>Attendance Status</InputLabel>
                <Select
                  multiple
                  value={filters.attendanceStatus}
                  onChange={handleAttendanceStatusFilterChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        let color;
                        switch(value) {
                          case 'present': color = '#4ecdc4'; break;
                          case 'absent': color = '#ff6b6b'; break;
                          case 'late': color = '#ffd93d'; break;
                          default: color = 'white';
                        }
                        return (
                          <Chip 
                            key={value} 
                            label={value.charAt(0).toUpperCase() + value.slice(1)}
                            size="small"
                            onDelete={() => {
                              const newSelected = filters.attendanceStatus.filter(status => status !== value);
                              handleFilterChange('attendanceStatus', newSelected);
                            }}
                            deleteIcon={<Close fontSize="small" />}
                            sx={{ 
                              bgcolor: `rgba(${color.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ')}, 0.2)`,
                              color,
                              borderRadius: '16px',
                              '& .MuiChip-deleteIcon': {
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&:hover': {
                                  color: 'white',
                                },
                              },
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(204, 115, 248, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#cc73f8',
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: 'rgba(18, 18, 40, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
                        borderRadius: '16px',
                        '& .MuiMenuItem-root': {
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(204, 115, 248, 0.15)',
                          },
                          '&.Mui-selected': {
                            bgcolor: 'rgba(204, 115, 248, 0.2)',
                            '&:hover': {
                              bgcolor: 'rgba(204, 115, 248, 0.25)',
                            },
                          },
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="present">Present</MenuItem>
                  <MenuItem value="absent">Absent</MenuItem>
                  <MenuItem value="late">Late</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      {/* Results count */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Showing {filteredStudentIds.length} of {students.length} students
        </Typography>
      </Box>

      {/* Bulk Actions */}
      {selectedStudents.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <Button
            onClick={() => handleBulkAction('present')}
            sx={{
              color: '#4ecdc4',
              fontSize: '2rem',
              minWidth: 'auto',
              padding: '8px',
              borderRadius: '50%',
              '&:hover': {
                bgcolor: 'rgba(78, 205, 196, 0.1)',
              },
            }}
          >
            <CheckCircle />
          </Button>
          <Button
            onClick={() => handleBulkAction('absent')}
            sx={{
              color: '#ff6b6b',
              fontSize: '2rem',
              minWidth: 'auto',
              padding: '8px',
              borderRadius: '50%',
              '&:hover': {
                bgcolor: 'rgba(255, 107, 107, 0.1)',
              },
            }}
          >
            <Cancel />
          </Button>
          <Button
            onClick={() => handleBulkAction('late')}
            sx={{
              color: '#ffd93d',
              fontSize: '2rem',
              minWidth: 'auto',
              padding: '8px',
              borderRadius: '50%',
              '&:hover': {
                bgcolor: 'rgba(255, 217, 61, 0.1)',
              },
            }}
          >
            <Warning />
          </Button>
        </Box>
      )}

      {/* Month Navigation */}
      <Card 
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton onClick={goToPreviousMonth} color="primary">
            <ChevronLeft />
          </IconButton>
          <Typography variant="h5">{monthName}</Typography>
          <IconButton 
            onClick={goToNextMonth} 
            color="primary"
            disabled={isSameDay(addMonths(currentDate, 1), addMonths(new Date(), 1))}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Card>

      {/* Attendance Legend */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 16, 
            height: 16, 
            borderRadius: '50%', 
            bgcolor: 'rgba(78, 205, 196, 0.2)',
            mr: 1,
          }} />
          <Typography variant="body2">Present</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 16, 
            height: 16, 
            borderRadius: '50%', 
            bgcolor: 'rgba(255, 107, 107, 0.2)',
            mr: 1,
          }} />
          <Typography variant="body2">Absent</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 16, 
            height: 16, 
            borderRadius: '50%', 
            bgcolor: 'rgba(255, 217, 61, 0.2)',
            mr: 1,
          }} />
          <Typography variant="body2">Late</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 16, 
            height: 16, 
            borderRadius: '50%', 
            bgcolor: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            mr: 1,
          }} />
          <Typography variant="body2">Not Recorded</Typography>
        </Box>
      </Box>

      {/* Replace the existing table with the new renderAttendanceTable function */}
      {renderAttendanceTable()}

      {/* Summary Cards */}
      <Typography variant="h5" sx={{ mb: 2 }}>Monthly Summary</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              p: 3, 
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarToday sx={{ color: '#cc73f8', mr: 1 }} />
              <Typography variant="h6">Overall Attendance</Typography>
            </Box>
            <Typography variant="h4">
              {(() => {
                const total = attendanceRecords.length;
                const present = attendanceRecords.filter(r => r.status === 'present').length;
                return total ? Math.round((present / total) * 100) : 0;
              })()}%
            </Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              p: 3, 
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircle sx={{ color: '#4ecdc4', mr: 1 }} />
              <Typography variant="h6">Present Count</Typography>
            </Box>
            <Typography variant="h4">
              {attendanceRecords.filter(r => r.status === 'present').length}
            </Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              p: 3, 
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Cancel sx={{ color: '#ff6b6b', mr: 1 }} />
              <Typography variant="h6">Absent Count</Typography>
            </Box>
            <Typography variant="h4">
              {attendanceRecords.filter(r => r.status === 'absent').length}
            </Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              p: 3, 
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Warning sx={{ color: '#ffd93d', mr: 1 }} />
              <Typography variant="h6">Late Count</Typography>
            </Box>
            <Typography variant="h4">
              {attendanceRecords.filter(r => r.status === 'late').length}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AttendanceManagement; 