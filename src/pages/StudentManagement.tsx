import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  InputAdornment,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
  Badge,
  Collapse,
  InputBase,
  Slider,
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  Close,
  Upload, 
  School, 
  GridView, 
  ViewList,
  FilterList,
  ExpandMore,
  Search,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  CalendarToday,
  AccessTime,
  Payment,
  EmojiEvents,
  Person,
  Group,
  Sort,
} from '@mui/icons-material';
import { useClasses } from '../contexts/ClassContext';
import { useSearch } from '../components/Layout';

// Extended Student interface with additional properties for filtering
interface Student {
  id: string;
  name: string;
  age: string;
  fatherName: string;
  mobile: string;
  address: string;
  joiningDate: string;
  classId: string;
  fee: number;
  imageUrl: string;
  // Additional properties for filtering
  feeStatus?: 'paid' | 'unpaid' | 'partial';
  performanceLevel?: 'high' | 'medium' | 'low';
  attendanceStatus?: 'regular' | 'irregular' | 'frequently-absent';
  lastAttendanceDate?: string;
  performanceScore?: number;
  attendancePercentage?: number;
  createdAt?: string; // For tracking when the student was added to the system
}

// Filter interface to track active filters
interface Filters {
  class: string[];
  joiningDate: 'newest' | 'oldest' | '';
  recentlyAdded: boolean;
  feeStatus: ('paid' | 'unpaid' | 'partial')[];
  performanceLevel: ('high' | 'medium' | 'low')[];
  attendanceStatus: ('regular' | 'irregular' | 'frequently-absent')[];
  searchQuery: string;
  ageRange: [number, number];
  gender?: 'male' | 'female' | 'other';
}

const StudentManagement = () => {
  const { classes } = useClasses();
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    class: [],
    joiningDate: '',
    recentlyAdded: false,
    feeStatus: [],
    performanceLevel: [],
    attendanceStatus: [],
    searchQuery: '',
    ageRange: [5, 60],
  });
  
  // Mock data for students with additional properties for filtering
  const [students, setStudents] = useState<Student[]>([
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
      feeStatus: 'paid',
      performanceLevel: 'high',
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
      feeStatus: 'unpaid',
      performanceLevel: 'medium',
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
      feeStatus: 'partial',
      performanceLevel: 'low',
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
      feeStatus: 'paid',
      performanceLevel: 'high',
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
      feeStatus: 'unpaid',
      performanceLevel: 'medium',
      attendanceStatus: 'irregular',
      lastAttendanceDate: '2023-06-12',
      performanceScore: 70,
      attendancePercentage: 78,
      createdAt: '2023-05-12T16:30:00',
    },
  ]);

  // Filtered students based on active filters
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student>({
    id: '',
    name: '',
    age: '',
    fatherName: '',
    mobile: '',
    address: '',
    joiningDate: '',
    classId: '',
    fee: 0,
    imageUrl: '',
  });

  // Add search context
  const { searchQuery, setSearchQuery } = useSearch();

  // Apply filters whenever filters or students change
  useEffect(() => {
    applyFilters();
  }, [filters, students]);

  // Function to apply all active filters
  const applyFilters = () => {
    let result = [...students];
    
    // Filter by class
    if (filters.class.length > 0) {
      result = result.filter(student => filters.class.includes(student.classId));
    }
    
    // Filter by joining date (sort)
    if (filters.joiningDate) {
      result.sort((a, b) => {
        if (filters.joiningDate === 'newest') {
          return new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime();
        } else {
          return new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime();
        }
      });
    }
    
    // Filter by recently added
    if (filters.recentlyAdded) {
      result.sort((a, b) => {
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      });
    }
    
    // Filter by fee status
    if (filters.feeStatus.length > 0) {
      result = result.filter(student => student.feeStatus && filters.feeStatus.includes(student.feeStatus));
    }
    
    // Filter by performance level
    if (filters.performanceLevel.length > 0) {
      result = result.filter(student => student.performanceLevel && filters.performanceLevel.includes(student.performanceLevel));
    }
    
    // Filter by attendance status
    if (filters.attendanceStatus.length > 0) {
      result = result.filter(student => student.attendanceStatus && filters.attendanceStatus.includes(student.attendanceStatus));
    }
    
    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(student => 
        student.name.toLowerCase().includes(query) ||
        student.fatherName.toLowerCase().includes(query) ||
        student.mobile.includes(query) ||
        getClassName(student.classId).toLowerCase().includes(query)
      );
    }
    
    // Filter by age range
    result = result.filter(student => {
      const age = parseInt(student.age);
      return age >= filters.ageRange[0] && age <= filters.ageRange[1];
    });
    
    setFilteredStudents(result);
  };

  // Handle filter changes
  const handleFilterChange = (filterType: keyof Filters, value: any) => {
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

  // Handle fee status filter change
  const handleFeeStatusFilterChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    handleFilterChange('feeStatus', typeof value === 'string' ? value.split(',') : value);
  };

  // Handle performance level filter change
  const handlePerformanceFilterChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    handleFilterChange('performanceLevel', typeof value === 'string' ? value.split(',') : value);
  };

  // Handle attendance status filter change
  const handleAttendanceFilterChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    handleFilterChange('attendanceStatus', typeof value === 'string' ? value.split(',') : value);
  };

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearchQuery(newSearch); // Update global context
    handleFilterChange('searchQuery', newSearch); // Update local state
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      class: [],
      joiningDate: '',
      recentlyAdded: false,
      feeStatus: [],
      performanceLevel: [],
      attendanceStatus: [],
      searchQuery: '',
      ageRange: [5, 60],
    });
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.class.length > 0) count++;
    if (filters.joiningDate) count++;
    if (filters.recentlyAdded) count++;
    if (filters.feeStatus.length > 0) count++;
    if (filters.performanceLevel.length > 0) count++;
    if (filters.attendanceStatus.length > 0) count++;
    if (filters.searchQuery) count++;
    if (filters.ageRange[0] !== 5 || filters.ageRange[1] !== 60) count++;
    return count;
  };

  const handleOpen = (edit = false, student?: Student) => {
    if (edit && student) {
      setEditMode(true);
      setCurrentStudent(student);
    } else {
      setEditMode(false);
      setCurrentStudent({
        id: Date.now().toString(),
        name: '',
        age: '',
        fatherName: '',
        mobile: '',
        address: '',
        joiningDate: new Date().toISOString().split('T')[0],
        classId: '',
        fee: 0,
        imageUrl: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    setCurrentStudent({
      ...currentStudent,
      [name as string]: value,
    });
  };

  const handleClassChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    const selectedClass = classes.find(cls => cls.id === value);
    
    setCurrentStudent({
      ...currentStudent,
      classId: value,
      fee: selectedClass?.fee || 0,
    });
  };

  const handleSubmit = () => {
    if (editMode) {
      setStudents(
        students.map((student) =>
          student.id === currentStudent.id ? currentStudent : student
        )
      );
    } else {
      setStudents([...students, currentStudent]);
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const getClassName = (classId: string) => {
    const foundClass = classes.find(cls => cls.id === classId);
    return foundClass ? foundClass.name : 'Unknown';
  };

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'card' | 'table' | null,
  ) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  // Fix the handleRemoveFilterValue function to properly handle types
  const handleRemoveFilterValue = (filterType: keyof Filters, valueToRemove: string) => {
    // Remove the incorrect event handling that's causing errors
    
    setFilters(prev => {
      // Create a new filters object to avoid mutating state directly
      const newFilters = { ...prev };
      
      // Handle different filter types
      switch (filterType) {
        case 'class':
          // For class array, filter out the value to remove
          if (Array.isArray(prev[filterType])) {
            newFilters[filterType] = (prev[filterType] as string[]).filter(
              value => value !== valueToRemove
            );
          }
          break;
          
        case 'feeStatus':
          // For feeStatus array, filter out the value to remove
          if (Array.isArray(prev[filterType])) {
            newFilters[filterType] = (prev[filterType] as ('paid' | 'unpaid' | 'partial')[]).filter(
              value => value !== valueToRemove
            );
          }
          break;
          
        case 'performanceLevel':
          // For performanceLevel array, filter out the value to remove
          if (Array.isArray(prev[filterType])) {
            newFilters[filterType] = (prev[filterType] as ('high' | 'medium' | 'low')[]).filter(
              value => value !== valueToRemove
            );
          }
          break;
          
        case 'attendanceStatus':
          // For attendanceStatus array, filter out the value to remove
          if (Array.isArray(prev[filterType])) {
            newFilters[filterType] = (prev[filterType] as ('regular' | 'irregular' | 'frequently-absent')[]).filter(
              value => value !== valueToRemove
            );
          }
          break;
          
        case 'joiningDate':
          // For string type, reset to empty string
          newFilters[filterType] = '';
          break;
          
        case 'recentlyAdded':
          // For boolean type, set to false
          newFilters[filterType] = false;
          break;
          
        case 'ageRange':
          // For tuple type, reset to default range
          newFilters[filterType] = [5, 60] as [number, number];
          break;
          
        case 'searchQuery':
          // For search query, reset to empty string
          newFilters[filterType] = '';
          break;
      }
      
      return newFilters;
    });
  };

  // Sync local search state with context (if you have a local search state)
  useEffect(() => {
    if (searchQuery !== filters.searchQuery) {
      handleFilterChange('searchQuery', searchQuery);
    }
  }, [searchQuery]);

  // Define a proper handleClearSearch function to clear both search states
  const handleClearSearch = () => {
    setSearchQuery(''); // Clear global context
    handleFilterChange('searchQuery', ''); // Clear local state
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4">Student Management</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
          <Tooltip title="Filter Students">
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
          </Tooltip>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            sx={{
              background: 'linear-gradient(135deg, #cc73f8 0%, #b35de0 100%)',
              boxShadow: '0 4px 15px rgba(204, 115, 248, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(204, 115, 248, 0.4)',
              },
            }}
          >
            Add Student
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
              Filter Students
            </Typography>
            {/* Remove the Clear All button */}
          </Box>
          
          <Grid container spacing={3}>
            {/* Class Filter */}
            <Grid item xs={12} md={6} lg={4}>
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
                          sx={{ 
                            bgcolor: 'rgba(204, 115, 248, 0.2)', 
                            color: 'white',
                            borderRadius: '12px',
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(204, 115, 248, 0.3)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(204, 115, 248, 0.6)',
                    },
                  }}
                  endAdornment={
                    filters.class.length > 0 ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', right: '32px' }}>
                        <Box 
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilters(prev => ({...prev, class: []}));
                          }}
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: '4px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: 'rgba(255, 255, 255, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: '#cc73f8',
                              borderColor: 'rgba(204, 115, 248, 0.3)',
                              transform: 'scale(1.05)',
                            },
                          }}
                        >
                          <Close fontSize="small" />
                        </Box>
                      </Box>
                    ) : null
                  }
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
                  {classes.map((classItem) => (
                    <MenuItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Joining Date Filter */}
            <Grid item xs={12} md={6} lg={4}>
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
                }}>Joining Date</InputLabel>
                <Select
                  value={filters.joiningDate}
                  onChange={(e) => handleFilterChange('joiningDate', e.target.value)}
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(204, 115, 248, 0.3)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(204, 115, 248, 0.6)',
                    },
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
                  endAdornment={
                    filters.joiningDate ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', right: '32px' }}>
                        <Box 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFilterValue('joiningDate', '');
                          }}
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: '4px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: 'rgba(255, 255, 255, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: '#cc73f8',
                              borderColor: 'rgba(204, 115, 248, 0.3)',
                              transform: 'scale(1.05)',
                            },
                          }}
                        >
                          <Close fontSize="small" />
                        </Box>
                      </Box>
                    ) : null
                  }
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Recently Added Filter */}
            <Grid item xs={12} md={6} lg={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={filters.recentlyAdded}
                      onChange={(e) => handleFilterChange('recentlyAdded', e.target.checked)}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.3)',
                        '&.Mui-checked': {
                          color: '#cc73f8',
                        },
                      }}
                    />
                  }
                  label="Recently Added"
                  sx={{ color: 'white' }}
                />
                {filters.recentlyAdded && (
                  <Box 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFilterValue('recentlyAdded', '');
                    }}
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ml: 0.5,
                      p: '4px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      color: 'rgba(255, 255, 255, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#cc73f8',
                        borderColor: 'rgba(204, 115, 248, 0.3)',
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <Close fontSize="small" />
                  </Box>
                )}
              </Box>
            </Grid>
            
            {/* Fee Status Filter */}
            <Grid item xs={12} md={6} lg={4}>
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
                }}>Fee Status</InputLabel>
                <Select
                  multiple
                  value={filters.feeStatus}
                  onChange={handleFeeStatusFilterChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={value.charAt(0).toUpperCase() + value.slice(1)}
                          size="small"
                          sx={{ 
                            bgcolor: value === 'paid' 
                              ? 'rgba(76, 175, 80, 0.2)' 
                              : value === 'unpaid' 
                                ? 'rgba(244, 67, 54, 0.2)' 
                                : 'rgba(255, 152, 0, 0.2)',
                            color: value === 'paid' 
                              ? '#4caf50' 
                              : value === 'unpaid' 
                                ? '#f44336' 
                                : '#ff9800',
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(204, 115, 248, 0.3)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(204, 115, 248, 0.6)',
                    },
                  }}
                  endAdornment={
                    filters.feeStatus.length > 0 ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', right: '32px' }}>
                        <Box 
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilters(prev => ({...prev, feeStatus: []}));
                          }}
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: '4px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: 'rgba(255, 255, 255, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: '#cc73f8',
                              borderColor: 'rgba(204, 115, 248, 0.3)',
                              transform: 'scale(1.05)',
                            },
                          }}
                        >
                          <Close fontSize="small" />
                        </Box>
                      </Box>
                    ) : null
                  }
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
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="unpaid">Unpaid</MenuItem>
                  <MenuItem value="partial">Partial</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Performance Level Filter */}
            <Grid item xs={12} md={6} lg={4}>
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
                }}>Performance Level</InputLabel>
                <Select
                  multiple
                  value={filters.performanceLevel}
                  onChange={handlePerformanceFilterChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={value.charAt(0).toUpperCase() + value.slice(1)}
                          size="small"
                          sx={{ 
                            bgcolor: value === 'high' 
                              ? 'rgba(76, 175, 80, 0.2)' 
                              : value === 'medium' 
                                ? 'rgba(255, 152, 0, 0.2)' 
                                : 'rgba(244, 67, 54, 0.2)',
                            color: value === 'high' 
                              ? '#4caf50' 
                              : value === 'medium' 
                                ? '#ff9800' 
                                : '#f44336',
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(204, 115, 248, 0.3)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(204, 115, 248, 0.6)',
                    },
                  }}
                  endAdornment={
                    filters.performanceLevel.length > 0 ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', right: '32px' }}>
                        <Box 
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilters(prev => ({...prev, performanceLevel: []}));
                          }}
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: '4px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: 'rgba(255, 255, 255, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: '#cc73f8',
                              borderColor: 'rgba(204, 115, 248, 0.3)',
                              transform: 'scale(1.05)',
                            },
                          }}
                        >
                          <Close fontSize="small" />
                        </Box>
                      </Box>
                    ) : null
                  }
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
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Attendance Status Filter */}
            <Grid item xs={12} md={6} lg={4}>
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
                  onChange={handleAttendanceFilterChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ')}
                          size="small"
                          sx={{ 
                            bgcolor: value === 'regular' 
                              ? 'rgba(76, 175, 80, 0.2)' 
                              : value === 'irregular' 
                                ? 'rgba(255, 152, 0, 0.2)' 
                                : 'rgba(244, 67, 54, 0.2)',
                            color: value === 'regular' 
                              ? '#4caf50' 
                              : value === 'irregular' 
                                ? '#ff9800' 
                                : '#f44336',
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(204, 115, 248, 0.3)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(204, 115, 248, 0.6)',
                    },
                  }}
                  endAdornment={
                    filters.attendanceStatus.length > 0 ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', right: '32px' }}>
                        <Box 
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilters(prev => ({...prev, attendanceStatus: []}));
                          }}
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: '4px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: 'rgba(255, 255, 255, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: '#cc73f8',
                              borderColor: 'rgba(204, 115, 248, 0.3)',
                              transform: 'scale(1.05)',
                            },
                          }}
                        >
                          <Close fontSize="small" />
                        </Box>
                      </Box>
                    ) : null
                  }
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
                  <MenuItem value="regular">Regular</MenuItem>
                  <MenuItem value="irregular">Irregular</MenuItem>
                  <MenuItem value="frequently-absent">Frequently Absent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Age Range Filter */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Age Range: {filters.ageRange[0]} - {filters.ageRange[1]} years
                </Typography>
                {(filters.ageRange[0] !== 5 || filters.ageRange[1] !== 60) && (
                  <Box 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFilterValue('ageRange', '');
                    }}
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      px: 1,
                      py: '4px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      color: 'rgba(255, 255, 255, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#cc73f8',
                        borderColor: 'rgba(204, 115, 248, 0.3)',
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <Close fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="caption">Reset</Typography>
                  </Box>
                )}
              </Box>
              <Slider
                value={filters.ageRange}
                onChange={(_, newValue) => handleFilterChange('ageRange', newValue)}
                valueLabelDisplay="auto"
                min={5}
                max={60}
                step={1}
                sx={{
                  color: '#cc73f8',
                  '& .MuiSlider-thumb': {
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0 0 0 8px rgba(204, 115, 248, 0.16)',
                    },
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#cc73f8',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      {/* Results Count */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Showing {filteredStudents.length} of {students.length} students
        </Typography>
      </Box>

      {viewMode === 'card' ? (
        <Grid container spacing={3}>
          {filteredStudents.map((student) => (
            <Grid item xs={12} sm={6} md={4} key={student.id}>
              <div>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{ width: 56, height: 56, mr: 2, bgcolor: '#cc73f8' }}
                        src={student.imageUrl || undefined}
                      >
                        {student.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{student.name}</Typography>
                        <Chip
                          label={getClassName(student.classId)}
                          size="small"
                          sx={{ bgcolor: 'rgba(204, 115, 248, 0.2)', color: 'white' }}
                        />
                      </Box>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleOpen(true, student)}
                        sx={{ color: '#4ecdc4' }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(student.id)}
                        sx={{ color: '#ff6b6b' }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Father: {student.fatherName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Mobile: {student.mobile}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Fee: <Chip
                      label={`₹${student.fee.toLocaleString()}`}
                      size="small"
                      sx={{ bgcolor: 'rgba(255, 107, 107, 0.2)', color: '#ff6b6b' }}
                    />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Joined: {new Date(student.joiningDate).toLocaleDateString()}
                  </Typography>
                </Card>
              </div>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer 
          component={Paper}
          sx={{
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            mb: 4,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Student</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Class/Course</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Father</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Mobile</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Fee</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Joined</TableCell>
                <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow
                  key={student.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  <TableCell sx={{ color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{ width: 40, height: 40, bgcolor: '#cc73f8' }}
                        src={student.imageUrl || undefined}
                      >
                        {student.name[0]}
                      </Avatar>
                      <Typography variant="body1">{student.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    <Chip
                      label={getClassName(student.classId)}
                      size="small"
                      sx={{ bgcolor: 'rgba(204, 115, 248, 0.2)', color: 'white' }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>{student.fatherName}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{student.mobile}</TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    <Chip
                      label={`₹${student.fee.toLocaleString()}`}
                      size="small"
                      sx={{ bgcolor: 'rgba(255, 107, 107, 0.2)', color: '#ff6b6b' }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>{new Date(student.joiningDate).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpen(true, student)}
                      sx={{ color: '#4ecdc4' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(student.id)}
                      sx={{ color: '#ff6b6b' }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(18, 18, 40, 0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0))',
            },
          },
        }}
      >
        <DialogTitle 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            py: 2.5,
            px: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'white' }}>
            {editMode ? 'Edit Student' : 'Add New Student'}
          </Typography>
          <IconButton 
            onClick={handleClose} 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, my: 1 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mb: 2,
                mt: 1,
              }}
            >
              <Avatar
                sx={{ 
                  width: 90, 
                  height: 90, 
                  bgcolor: 'rgba(204, 115, 248, 0.8)',
                  boxShadow: '0 4px 20px rgba(204, 115, 248, 0.3)',
                  border: '3px solid rgba(255, 255, 255, 0.1)',
                }}
                src={currentStudent.imageUrl || undefined}
              >
                {currentStudent.name ? currentStudent.name[0] : <Upload sx={{ fontSize: 40 }} />}
              </Avatar>
            </Box>

            <TextField
              label="Name"
              name="name"
              value={currentStudent.name}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                sx: {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(204, 115, 248, 0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(204, 115, 248, 0.6)',
                  },
                }
              }}
              InputLabelProps={{
                sx: {
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
                }
              }}
            />

            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  label="Age"
                  name="age"
                  type="number"
                  value={currentStudent.age}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    sx: {
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(204, 115, 248, 0.3)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(204, 115, 248, 0.6)',
                      },
                    }
                  }}
                  InputLabelProps={{
                    sx: {
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
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth required>
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
                    name="classId"
                    value={currentStudent.classId}
                    label="Class/Course"
                    onChange={handleClassChange}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(204, 115, 248, 0.3)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(204, 115, 248, 0.6)',
                      },
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
                    {classes.map((classItem) => (
                      <MenuItem key={classItem.id} value={classItem.id}>
                        {classItem.name} (₹{classItem.fee})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Father's Name"
                  name="fatherName"
                  value={currentStudent.fatherName}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    sx: {
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(204, 115, 248, 0.3)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(204, 115, 248, 0.6)',
                      },
                    }
                  }}
                  InputLabelProps={{
                    sx: {
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
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Mobile"
                  name="mobile"
                  value={currentStudent.mobile}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    sx: {
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(204, 115, 248, 0.3)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(204, 115, 248, 0.6)',
                      },
                    }
                  }}
                  InputLabelProps={{
                    sx: {
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
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Joining Date"
                  type="date"
                  name="joiningDate"
                  value={currentStudent.joiningDate}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ 
                    shrink: true,
                    sx: {
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
                    }
                  }}
                  InputProps={{
                    sx: {
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(204, 115, 248, 0.3)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(204, 115, 248, 0.6)',
                      },
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Fee Amount"
                  name="fee"
                  type="number"
                  value={currentStudent.fee}
                  onChange={handleChange}
                  fullWidth
                  disabled
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    readOnly: true,
                    sx: {
                      bgcolor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }
                  }}
                  InputLabelProps={{
                    sx: {
                      color: 'rgba(255, 255, 255, 0.7)',
                    }
                  }}
                  helperText="Auto-calculated based on selected class/course"
                  FormHelperTextProps={{
                    sx: {
                      color: 'rgba(255, 255, 255, 0.5)',
                    }
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              label="Address"
              name="address"
              value={currentStudent.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              InputProps={{
                sx: {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(204, 115, 248, 0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(204, 115, 248, 0.6)',
                  },
                }
              }}
              InputLabelProps={{
                sx: {
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
                }
              }}
            />
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
            sx={{
              background: 'linear-gradient(135deg, #cc73f8 0%, #9940D3 100%)',
              boxShadow: '0 4px 15px rgba(204, 115, 248, 0.3)',
              borderRadius: '8px',
              px: 3,
              '&:hover': {
                boxShadow: '0 6px 20px rgba(204, 115, 248, 0.4)',
              },
            }}
          >
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentManagement; 