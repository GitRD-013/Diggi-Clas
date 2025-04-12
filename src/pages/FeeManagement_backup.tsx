import { useState, useEffect, useRef, useCallback } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Autocomplete,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Badge,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Checkbox,
  Menu,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  TablePagination,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  Add,
  Close,
  CalendarMonth,
  Payment,
  CheckCircle,
  Warning,
  Edit,
  Download,
  FilterList,
  Search,
  Clear,
  ViewList,
  ViewModule,
  GridView,
  School,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Receipt as ReceiptIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Share as ShareIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { format, differenceInMonths, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { useClasses } from '../contexts/ClassContext';
import { useStudents } from '../contexts/StudentContext';

interface FeeRecord {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  month: string;
  year: string;
  status: 'paid' | 'pending' | 'partial';
  dueDate: string;
  paidDate: string | null;
  paymentMode: 'Cash' | 'UPI' | 'Bank' | null;
  notes?: string;
  transactionId?: string;
  paidAmount?: number;
  invoiceUrl?: string;
  shareableLink?: string;
}

interface FilterState {
  studentName: string[];
  class: string[];
  month: string[];
  year: string[];
  status: string[];
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
}

// Interface for Student
interface Student {
  id: string;
  name: string;
  classId: string;
  profileImage?: string;
}

const FeeManagement = () => {
  const { classes } = useClasses();
  const { students } = useStudents();

  // State for filters
  const [filters, setFilters] = useState<FilterState>({
    studentName: [],
    class: [],
    month: [],
    year: [],
    status: [],
    dateRange: {
      startDate: null,
      endDate: null,
    },
  });

  // State for filter panel visibility
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // State for view mode
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  // State for selected records
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [bulkActionsAnchorEl, setBulkActionsAnchorEl] = useState<null | HTMLElement>(null);
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);

  // State for invoice menu
  const [invoiceMenuAnchorEl, setInvoiceMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [invoicePreviewOpen, setInvoicePreviewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<FeeRecord | null>(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock data for fee records
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([
    {
      id: '1',
      studentId: '1',
      amount: 1500,
      date: '2023-01-15',
      month: '01',
      year: '2023',
      status: 'paid',
      dueDate: '2023-01-10',
      paidDate: '2023-01-15',
      paymentMode: 'Cash',
    },
    {
      id: '2',
      studentId: '1',
      amount: 1500,
      date: '2023-02-15',
      month: '02',
      year: '2023',
      status: 'paid',
      dueDate: '2023-02-10',
      paidDate: '2023-02-15',
      paymentMode: 'UPI',
    },
    {
      id: '3',
      studentId: '1',
      amount: 1500,
      date: '',
      month: '03',
      year: '2023',
      status: 'pending',
      dueDate: '2023-03-10',
      paidDate: null,
      paymentMode: null,
    },
    {
      id: '4',
      studentId: '2',
      amount: 1500,
      date: '2023-02-20',
      month: '02',
      year: '2023',
      status: 'paid',
      dueDate: '2023-02-10',
      paidDate: '2023-02-20',
      paymentMode: 'Bank',
    },
    {
      id: '5',
      studentId: '2',
      amount: 1500,
      date: '',
      month: '03',
      year: '2023',
      status: 'pending',
      dueDate: '2023-03-10',
      paidDate: null,
      paymentMode: null,
    },
  ]);

  // State for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(null);
  const [editFormData, setEditFormData] = useState({
    studentId: '',
    amount: '',
    status: '',
    paidDate: '',
    paymentMode: '',
    notes: '',
    transactionId: '',
  });

  // State for transaction history
  const [transactionHistoryOpen, setTransactionHistoryOpen] = useState(false);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<Student | null>(null);

  // Filter options
  const filterOptions = {
    studentName: students.map(student => student.name),
    class: classes.map(cls => cls.name),
    month: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    year: Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i).toString()),
    status: ['paid', 'pending'],
  };

  // Handle filter changes
  const handleFilterChange = (filterType: keyof FilterState, value: string[]) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Handle filter removal
  const handleRemoveFilterValue = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => {
      if (filterType === 'dateRange') {
        return {
          ...prev,
          dateRange: { startDate: null, endDate: null },
        };
      }
      return {
        ...prev,
        [filterType]: (prev[filterType] as string[]).filter((v: string) => v !== value),
      };
    });
  };

  // Handle edit button click
  const handleEditClick = (record: FeeRecord) => {
    setSelectedRecord(record);
    setEditFormData({
      studentId: record.studentId,
      amount: record.amount.toString(),
      status: record.status,
      paidDate: record.paidDate || format(new Date(), 'yyyy-MM-dd'),
      paymentMode: record.paymentMode || '',
      notes: record.notes || '',
      transactionId: record.transactionId || '',
    });
    setEditDialogOpen(true);
  };

  // Handle edit form submission
  const handleEditSubmit = () => {
    if (!selectedRecord && !editFormData.studentId) return;

    const updatedRecord = {
      id: selectedRecord ? selectedRecord.id : Date.now().toString(),
      studentId: selectedRecord ? selectedRecord.studentId : editFormData.studentId,
      amount: Number(editFormData.amount),
      date: editFormData.status === 'paid' ? editFormData.paidDate : '',
      month: format(new Date(), 'MM'),
      year: format(new Date(), 'yyyy'),
      status: editFormData.status as 'paid' | 'pending' | 'partial',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      paidDate: editFormData.status === 'paid' ? editFormData.paidDate : null,
      paymentMode: editFormData.status === 'paid' ? editFormData.paymentMode as 'Cash' | 'UPI' | 'Bank' : null,
      notes: editFormData.notes,
      transactionId: editFormData.transactionId,
    };

    if (selectedRecord) {
      setFeeRecords(prev =>
        prev.map(record =>
          record.id === selectedRecord.id ? updatedRecord : record
        )
      );
    } else {
      setFeeRecords(prev => [...prev, updatedRecord]);
    }

    setEditDialogOpen(false);
    setSelectedRecord(null);
    setEditFormData({
      studentId: '',
      amount: '',
      status: '',
      paidDate: '',
      paymentMode: '',
      notes: '',
      transactionId: '',
    });
  };

  // Handle generate invoice
  const handleGenerateInvoice = (record: FeeRecord) => {
    // In a real implementation, this would generate a PDF invoice
    console.log('Generating invoice for record:', record);
    // For now, we'll just show an alert
    alert('Invoice generation would be implemented here. This would create a PDF with student details, fee information, and payment status.');
  };

  // Filter fee records based on selected filters
  const filteredFeeRecords = feeRecords.filter(record => {
    const student = students.find(s => s.id === record.studentId);
    const className = classes.find(c => c.id === student?.classId)?.name;

    // Date range filter
    const isInDateRange = () => {
      if (!filters.dateRange.startDate && !filters.dateRange.endDate) {
        return true; // No date filter applied
      }
      
      // If record has no paid date and status is not paid, include it
      if (!record.paidDate && record.status !== 'paid') {
        return true;
      }
      
      // If only start date is set
      if (filters.dateRange.startDate && !filters.dateRange.endDate) {
        return record.paidDate && record.paidDate >= filters.dateRange.startDate;
      }
      
      // If only end date is set
      if (!filters.dateRange.startDate && filters.dateRange.endDate) {
        return record.paidDate && record.paidDate <= filters.dateRange.endDate;
      }
      
      // If both dates are set
      if (filters.dateRange.startDate && filters.dateRange.endDate) {
        return record.paidDate && 
               record.paidDate >= filters.dateRange.startDate && 
               record.paidDate <= filters.dateRange.endDate;
      }
      
      return true;
    };

    return (
      (filters.studentName.length === 0 || (student && filters.studentName.includes(student.name))) &&
      (filters.class.length === 0 || (className && filters.class.includes(className))) &&
      (filters.month.length === 0 || filters.month.some(monthName => {
        const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'].indexOf(monthName);
        const monthNumber = monthIndex > -1 ? (monthIndex + 1).toString().padStart(2, '0') : '';
        return monthNumber === record.month;
      })) &&
      (filters.year.length === 0 || filters.year.includes(record.year)) &&
      (filters.status.length === 0 || filters.status.includes(record.status)) &&
      isInDateRange()
    );
  });

  // Get month name from month number
  const getMonthName = (monthNumber: string) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const index = parseInt(monthNumber) - 1;
    return months[index] || 'Unknown';
  };

  // Get student name by id
  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown';
  };

  // Get class name by id
  const getClassName = (classId: string) => {
    const foundClass = classes.find(cls => cls.id === classId);
    return foundClass ? foundClass.name : 'Unknown';
  };

  // Get student class id by student id
  const getStudentClassId = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.classId : '';
  };

  // Count active filters
  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'dateRange') {
      // Count date range as active if either start or end date is set
      const dateRange = value as { startDate: string | null; endDate: string | null };
      return count + (dateRange.startDate || dateRange.endDate ? 1 : 0);
    }
    return count + (Array.isArray(value) ? value.length : 0);
  }, 0);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRecords(filteredFeeRecords.map(record => record.id));
    } else {
      setSelectedRecords([]);
    }
  };

  const handleSelectRecord = (id: string) => {
    setSelectedRecords(prev => {
      if (prev.includes(id)) {
        return prev.filter(recordId => recordId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleBulkActionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setBulkActionsAnchorEl(event.currentTarget);
  };

  const handleBulkActionsClose = () => {
    setBulkActionsAnchorEl(null);
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'markPaid':
        // Implement bulk mark as paid
        break;
      case 'markPending':
        // Implement bulk mark as pending
        break;
      case 'generateInvoices':
        // Implement bulk invoice generation
        break;
      case 'downloadInvoices':
        // Implement bulk invoice download
        break;
      default:
        break;
    }
    handleBulkActionsClose();
  };

  // Handle invoice menu open
  const handleInvoiceMenuOpen = (event: React.MouseEvent<HTMLElement>, record: FeeRecord) => {
    setInvoiceMenuAnchorEl(event.currentTarget);
    setSelectedInvoice(record);
  };

  // Handle invoice menu close
  const handleInvoiceMenuClose = () => {
    setInvoiceMenuAnchorEl(null);
    setSelectedInvoice(null);
  };

  // Handle view invoice
  const handleViewInvoice = () => {
    setInvoicePreviewOpen(true);
    handleInvoiceMenuClose();
  };

  // Handle download invoice
  const handleDownloadInvoice = () => {
    // In a real implementation, this would download the PDF
    console.log('Downloading invoice for record:', selectedInvoice);
    alert('Invoice download would be implemented here.');
    handleInvoiceMenuClose();
  };

  // Handle share invoice
  const handleShareInvoice = () => {
    // In a real implementation, this would generate a shareable link
    const shareableLink = `https://yourdomain.com/invoice/${selectedInvoice?.id}`;
    navigator.clipboard.writeText(shareableLink);
    alert('Shareable link copied to clipboard!');
    handleInvoiceMenuClose();
  };

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate paginated records
  const paginatedRecords = filteredFeeRecords.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Calculate summary statistics
  const summaryStats = {
    totalStudents: new Set(feeRecords.map(record => record.studentId)).size,
    totalPaid: feeRecords
      .filter(record => record.status === 'paid')
      .reduce((sum, record) => sum + record.amount, 0),
    pendingBalance: feeRecords
      .filter(record => record.status === 'pending')
      .reduce((sum, record) => sum + record.amount, 0),
    paymentsThisMonth: feeRecords
      .filter(record => {
        const recordDate = new Date(record.date);
        const currentDate = new Date();
        return record.status === 'paid' && 
               recordDate.getMonth() === currentDate.getMonth() &&
               recordDate.getFullYear() === currentDate.getFullYear();
      })
      .reduce((sum, record) => sum + record.amount, 0),
  };

  // Get student's transaction history
  const getStudentTransactionHistory = (studentId: string) => {
    return feeRecords
      .filter(record => record.studentId === studentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Handle transaction history click
  const handleTransactionHistoryClick = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setSelectedStudentForHistory(student);
      setTransactionHistoryOpen(true);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4">Fee Management</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newView) => setViewMode(newView as 'table' | 'card')}
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
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setFilterPanelOpen(!filterPanelOpen)}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            Filters
            {activeFilterCount > 0 && (
              <Badge
                badgeContent={activeFilterCount}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#f44336',
                    color: 'white',
                    fontSize: '0.75rem',
                    height: '20px',
                    minWidth: '20px',
                    padding: '0 6px',
                    borderRadius: '10px',
                    right: -10,
                    top: 0,
                  },
                }}
              />
            )}
          </Button>
          {selectedRecords.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<MoreVertIcon />}
              onClick={handleBulkActionsClick}
              sx={{ 
                borderColor: 'rgba(255, 255, 255, 0.23)',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              Bulk Actions ({selectedRecords.length})
            </Button>
          )}
          <Menu
            anchorEl={bulkActionsAnchorEl}
            open={Boolean(bulkActionsAnchorEl)}
            onClose={handleBulkActionsClose}
            PaperProps={{
              sx: {
                bgcolor: '#1e1e1e',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              },
            }}
          >
            <MenuItem onClick={() => handleBulkAction('markPaid')}>
              <ListItemIcon>
                <CheckCircleIcon fontSize="small" sx={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText>Mark as Paid</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleBulkAction('markPending')}>
              <ListItemIcon>
                <PendingIcon fontSize="small" sx={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText>Mark as Pending</ListItemText>
            </MenuItem>
            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
            <MenuItem onClick={() => handleBulkAction('generateInvoices')}>
              <ListItemIcon>
                <ReceiptIcon fontSize="small" sx={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText>Generate Invoices</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleBulkAction('downloadInvoices')}>
              <ListItemIcon>
                <Download fontSize="small" sx={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText>Download Invoices</ListItemText>
            </MenuItem>
          </Menu>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setEditDialogOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #cc73f8 0%, #b35de0 100%)',
              boxShadow: '0 4px 15px rgba(204, 115, 248, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(204, 115, 248, 0.4)',
              },
            }}
          >
            Add Payment
          </Button>
        </Box>
      </Box>

      {/* Summary Bar */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
          mb: 3,
        }}
      >
        <Paper
          sx={{
            p: 2,
            background: 'rgba(204, 115, 248, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(204, 115, 248, 0.2)',
            borderRadius: '16px',
          }}
        >
          <Typography variant="subtitle2" sx={{ color: '#cc73f8' }} gutterBottom>
            Total Students
          </Typography>
          <Typography variant="h4" sx={{ color: '#cc73f8' }}>
            {summaryStats.totalStudents}
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 2,
            background: 'rgba(33, 150, 243, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(33, 150, 243, 0.2)',
            borderRadius: '16px',
          }}
        >
          <Typography variant="subtitle2" sx={{ color: '#2196f3' }} gutterBottom>
            Payments This Month
          </Typography>
          <Typography variant="h4" sx={{ color: '#2196f3' }}>
            ₹{summaryStats.paymentsThisMonth.toLocaleString()}
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 2,
            background: 'rgba(76, 175, 80, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
            borderRadius: '16px',
          }}
        >
          <Typography variant="subtitle2" sx={{ color: '#4caf50' }} gutterBottom>
            Total Paid
          </Typography>
          <Typography variant="h4" sx={{ color: '#4caf50' }}>
            ₹{summaryStats.totalPaid.toLocaleString()}
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 2,
            background: 'rgba(244, 67, 54, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(244, 67, 54, 0.2)',
            borderRadius: '16px',
          }}
        >
          <Typography variant="subtitle2" sx={{ color: '#f44336' }} gutterBottom>
            Pending Balance
          </Typography>
          <Typography variant="h4" sx={{ color: '#f44336' }}>
            ₹{summaryStats.pendingBalance.toLocaleString()}
          </Typography>
        </Paper>
      </Box>

      {/* Filter Panel */}
      {filterPanelOpen && (
        <Paper
          sx={{
            p: 3,
            mb: 3,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                multiple
                options={filterOptions.studentName}
                value={filters.studentName}
                onChange={(_, newValue) => handleFilterChange('studentName', newValue)}
                clearIcon={
                  <IconButton sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <Clear />
                  </IconButton>
                }
                componentsProps={{
                  popper: {
                    sx: {
                      '& .MuiPaper-root': {
                        backgroundColor: 'rgba(30, 30, 50, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        '& .MuiAutocomplete-option': {
                          '&:hover': {
                            backgroundColor: 'rgba(33, 150, 243, 0.15)',
                          },
                          '&[aria-selected="true"]': {
                            backgroundColor: 'rgba(33, 150, 243, 0.25)',
                          },
                        },
                      },
                    },
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Student Name"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(30, 30, 50, 0.8)',
                        borderRadius: '16px',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '16px',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2196f3',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={index}
                      label={option}
                      {...getTagProps({ index })}
                      onDelete={() => handleRemoveFilterValue('studentName', option)}
                      deleteIcon={<Clear fontSize="small" />}
                      sx={{
                        backgroundColor: 'rgba(204, 115, 248, 0.2)',
                        color: 'white',
                        '& .MuiChip-deleteIcon': {
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            color: 'white',
                          },
                        },
                      }}
                    />
                  ))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                multiple
                options={filterOptions.class}
                value={filters.class}
                onChange={(_, newValue) => handleFilterChange('class', newValue)}
                clearIcon={
                  <IconButton sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <Clear />
                  </IconButton>
                }
                componentsProps={{
                  popper: {
                    sx: {
                      '& .MuiPaper-root': {
                        backgroundColor: 'rgba(30, 30, 50, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        '& .MuiAutocomplete-option': {
                          '&:hover': {
                            backgroundColor: 'rgba(33, 150, 243, 0.15)',
                          },
                          '&[aria-selected="true"]': {
                            backgroundColor: 'rgba(33, 150, 243, 0.25)',
                          },
                        },
                      },
                    },
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Class"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(30, 30, 50, 0.8)',
                        borderRadius: '16px',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '16px',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2196f3',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={index}
                      label={option}
                      {...getTagProps({ index })}
                      onDelete={() => handleRemoveFilterValue('class', option)}
                      deleteIcon={<Clear fontSize="small" />}
                      sx={{
                        backgroundColor: 'rgba(204, 115, 248, 0.2)',
                        color: 'white',
                        '& .MuiChip-deleteIcon': {
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            color: 'white',
                          },
                        },
                      }}
                    />
                  ))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                multiple
                options={filterOptions.month}
                value={filters.month}
                onChange={(_, newValue) => handleFilterChange('month', newValue)}
                clearIcon={
                  <IconButton sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <Clear />
                  </IconButton>
                }
                componentsProps={{
                  popper: {
                    sx: {
                      '& .MuiPaper-root': {
                        backgroundColor: 'rgba(30, 30, 50, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        '& .MuiAutocomplete-option': {
                          '&:hover': {
                            backgroundColor: 'rgba(33, 150, 243, 0.15)',
                          },
                          '&[aria-selected="true"]': {
                            backgroundColor: 'rgba(33, 150, 243, 0.25)',
                          },
                        },
                      },
                    },
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Month"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(30, 30, 50, 0.8)',
                        borderRadius: '16px',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '16px',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2196f3',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={index}
                      label={option}
                      {...getTagProps({ index })}
                      onDelete={() => handleRemoveFilterValue('month', option)}
                      deleteIcon={<Clear fontSize="small" />}
                      sx={{
                        backgroundColor: 'rgba(204, 115, 248, 0.2)',
                        color: 'white',
                        '& .MuiChip-deleteIcon': {
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            color: 'white',
                          },
                        },
                      }}
                    />
                  ))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                multiple
                options={filterOptions.year}
                value={filters.year}
                onChange={(_, newValue) => handleFilterChange('year', newValue)}
                clearIcon={
                  <IconButton sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <Clear />
                  </IconButton>
                }
                componentsProps={{
                  popper: {
                    sx: {
                      '& .MuiPaper-root': {
                        backgroundColor: 'rgba(30, 30, 50, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        '& .MuiAutocomplete-option': {
                          '&:hover': {
                            backgroundColor: 'rgba(33, 150, 243, 0.15)',
                          },
                          '&[aria-selected="true"]': {
                            backgroundColor: 'rgba(33, 150, 243, 0.25)',
                          },
                        },
                      },
                    },
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Year"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(30, 30, 50, 0.8)',
                        borderRadius: '16px',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '16px',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2196f3',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={index}
                      label={option}
                      {...getTagProps({ index })}
                      onDelete={() => handleRemoveFilterValue('year', option)}
                      deleteIcon={<Clear fontSize="small" />}
                      sx={{
                        backgroundColor: 'rgba(204, 115, 248, 0.2)',
                        color: 'white',
                        '& .MuiChip-deleteIcon': {
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            color: 'white',
                          },
                        },
                      }}
                    />
                  ))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                multiple
                options={filterOptions.status}
                value={filters.status}
                onChange={(_, newValue) => handleFilterChange('status', newValue)}
                clearIcon={
                  <IconButton sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <Clear />
                  </IconButton>
                }
                componentsProps={{
                  popper: {
                    sx: {
                      '& .MuiPaper-root': {
                        backgroundColor: 'rgba(30, 30, 50, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        '& .MuiAutocomplete-option': {
                          '&:hover': {
                            backgroundColor: 'rgba(33, 150, 243, 0.15)',
                          },
                          '&[aria-selected="true"]': {
                            backgroundColor: 'rgba(33, 150, 243, 0.25)',
                          },
                        },
                      },
                    },
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Status"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(30, 30, 50, 0.8)',
                        borderRadius: '16px',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '16px',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2196f3',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={index}
                      label={option}
                      {...getTagProps({ index })}
                      onDelete={() => handleRemoveFilterValue('status', option)}
                      deleteIcon={<Clear fontSize="small" />}
                      sx={{
                        backgroundColor: 'rgba(204, 115, 248, 0.2)',
                        color: 'white',
                        '& .MuiChip-deleteIcon': {
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            color: 'white',
                          },
                        },
                      }}
                    />
                  ))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                  Payment Date Range
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <TextField
                    label="Start Date"
                    type="date"
                    value={filters.dateRange.startDate || ''}
                    onChange={(e) => {
                      const newStartDate = e.target.value;
                      setFilters(prev => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          startDate: newStartDate,
                        }
                      }));
                    }}
                    InputLabelProps={{ 
                      shrink: true,
                      sx: { color: 'rgba(255, 255, 255, 0.7)' }
                    }}
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                        backgroundColor: 'rgba(30, 30, 50, 0.8)',
                        borderRadius: '16px',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '16px',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2196f3',
                        },
                      },
                      '& input': {
                        color: 'white',
                        '&::-webkit-calendar-picker-indicator': {
                          filter: 'invert(1)',
                        },
                      },
                    }}
                  />
                  <TextField
                    label="End Date"
                    type="date"
                    value={filters.dateRange.endDate || ''}
                    onChange={(e) => {
                      const newEndDate = e.target.value;
                      setFilters(prev => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          endDate: newEndDate,
                        }
                      }));
                    }}
                    InputLabelProps={{ 
                      shrink: true,
                      sx: { color: 'rgba(255, 255, 255, 0.7)' }
                    }}
                    size="small"
                    fullWidth
                    error={!!(filters.dateRange.startDate && filters.dateRange.endDate && 
                           filters.dateRange.startDate > filters.dateRange.endDate)}
                    helperText={filters.dateRange.startDate && filters.dateRange.endDate && 
                               filters.dateRange.startDate > filters.dateRange.endDate ? 
                               "End date must be after start date" : ""}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                        backgroundColor: 'rgba(30, 30, 50, 0.8)',
                        borderRadius: '16px',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '16px',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2196f3',
                        },
                      },
                      '& input': {
                        color: 'white',
                        '&::-webkit-calendar-picker-indicator': {
                          filter: 'invert(1)',
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: 'rgba(33, 150, 243, 0.05)',
                '& th': {
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  borderBottom: '1px solid rgba(33, 150, 243, 0.15)',
                  padding: '16px',
                }
              }}>
                <TableCell 
                  padding="checkbox"
                  sx={{
                    padding: '0 16px',
                    '& .MuiCheckbox-root': {
                      padding: '8px',
                    }
                  }}
                >
                  <Checkbox
                    checked={selectedRecords.length === paginatedRecords.length && paginatedRecords.length > 0}
                    indeterminate={selectedRecords.length > 0 && selectedRecords.length < paginatedRecords.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-checked': {
                        color: '#2196f3',
                      },
                    }}
                  />
                </TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Month & Year</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Paid Date</TableCell>
                <TableCell>Payment Mode</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRecords.map((record) => {
                const student = students.find(s => s.id === record.studentId);
                const className = student ? getClassName(student.classId) : 'Unknown';
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                const monthName = monthNames[parseInt(record.month) - 1];
                
                return (
                  <TableRow 
                    key={record.id}
                    sx={{ 
                      '&:hover': {
                        backgroundColor: 'rgba(33, 150, 243, 0.08)',
                        transition: 'background-color 0.2s ease',
                        cursor: 'pointer',
                      },
                      '&:last-child td, &:last-child th': { border: 0 } 
                    }}
                  >
                    <TableCell 
                      padding="checkbox"
                      sx={{
                        padding: '0 16px',
                        '& .MuiCheckbox-root': {
                          padding: '8px',
                        }
                      }}
                    >
                      <Checkbox
                        checked={selectedRecords.includes(record.id)}
                        onChange={() => handleSelectRecord(record.id)}
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-checked': {
                            color: '#cc73f8',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={student?.profileImage}
                          alt={getStudentName(record.studentId)}
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: 'rgba(204, 115, 248, 0.2)',
                            color: '#cc73f8',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                          }}
                        >
                          {getStudentName(record.studentId).charAt(0)}
                        </Avatar>
                        <Typography>{getStudentName(record.studentId)}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{className}</TableCell>
                    <TableCell>{`${monthName} ${record.year}`}</TableCell>
                    <TableCell>{format(parseISO(record.dueDate), 'dd MMM yyyy')}</TableCell>
                    <TableCell>₹{record.amount}</TableCell>
                    <TableCell>{record.paidDate ? format(parseISO(record.paidDate), 'dd MMM yyyy') : '-'}</TableCell>
                    <TableCell>
                      {record.paymentMode ? (
                        <Chip
                          label={record.paymentMode}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            '& .MuiChip-label': {
                              px: 1,
                            },
                          }}
                        />
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        color={record.status === 'paid' ? 'success' : 'warning'}
                        size="small"
                        sx={{
                          backgroundColor: record.status === 'paid' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                          color: record.status === 'paid' ? '#4caf50' : '#ff9800',
                          '& .MuiChip-label': {
                            px: 1,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Transaction History">
                          <IconButton
                            size="small"
                            onClick={() => handleTransactionHistoryClick(record.studentId)}
                            sx={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&:hover': {
                                color: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              },
                            }}
                          >
                            <HistoryIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Payment">
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(record)}
                            sx={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&:hover': {
                                color: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Invoice Options">
                          <IconButton
                            size="small"
                            onClick={(e) => handleInvoiceMenuOpen(e, record)}
                            sx={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&:hover': {
                                color: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              },
                            }}
                          >
                            <Download fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredFeeRecords.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '.MuiTablePagination-select': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '.MuiTablePagination-selectIcon': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '.MuiTablePagination-actions': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '.MuiTablePagination-displayedRows': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '.MuiTablePagination-selectLabel': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '.MuiTablePagination-toolbar': {
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              },
            }}
          />
        </TableContainer>
      )}

      {/* Card View */}
      {viewMode === 'card' && (
        <Box>
          <Grid container spacing={3}>
            {paginatedRecords.map((record) => {
              const student = students.find(s => s.id === record.studentId);
              const className = student ? getClassName(student.classId) : 'Unknown';
              const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
              const monthName = monthNames[parseInt(record.month) - 1];
              
              return (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  key={record.id}
                >
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 20px rgba(204, 115, 248, 0.15)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">{getStudentName(record.studentId)}</Typography>
                      <Chip
                        label={record.status}
                        color={record.status === 'paid' ? 'success' : 'warning'}
                        size="small"
                        sx={{
                          backgroundColor: record.status === 'paid' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                          color: record.status === 'paid' ? '#4caf50' : '#ff9800',
                          border: `1px solid ${record.status === 'paid' ? '#4caf50' : '#ff9800'}`,
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <School fontSize="small" sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
                      <Typography variant="body2">{className}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarMonth fontSize="small" sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
                      <Typography variant="body2">{`${monthName} ${record.year}`}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Payment fontSize="small" sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
                        <Typography variant="body2">Amount:</Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="bold">₹{record.amount}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Due Date:</Typography>
                      <Typography variant="body2">{format(parseISO(record.dueDate), 'dd MMM yyyy')}</Typography>
                    </Box>
                    
                    {record.paidDate && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Paid Date:</Typography>
                        <Typography variant="body2">{format(parseISO(record.paidDate), 'dd MMM yyyy')}</Typography>
                      </Box>
                    )}
                    
                    {record.paymentMode && (
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={`Payment: ${record.paymentMode}`}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            borderRadius: '4px',
                          }}
                        />
                      </Box>
                    )}
                    
                    <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title="Transaction History">
                        <IconButton
                          size="small"
                          onClick={() => handleTransactionHistoryClick(record.studentId)}
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                              color: 'white',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                          }}
                        >
                          <ReceiptIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Payment">
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(record)}
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                              color: 'white',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Invoice Options">
                        <IconButton
                          size="small"
                          onClick={(e) => handleInvoiceMenuOpen(e, record)}
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                              color: 'white',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                          }}
                        >
                          <Download fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <TablePagination
              component="div"
              count={filteredFeeRecords.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '.MuiTablePagination-select': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '.MuiTablePagination-selectIcon': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '.MuiTablePagination-actions': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '.MuiTablePagination-displayedRows': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '.MuiTablePagination-selectLabel': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            />
          </Box>
        </Box>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        PaperProps={{
          sx: {
            background: 'rgba(18, 18, 40, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            minWidth: '400px',
          },
        }}
      >
        <DialogTitle>
          {selectedRecord ? 'Edit Payment' : 'Add Payment'}
          <IconButton
            onClick={() => setEditDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: 'white',
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            {!selectedRecord && (
              <FormControl fullWidth>
                <InputLabel>Student</InputLabel>
                <Select
                  value={editFormData.studentId || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, studentId: e.target.value })}
                  label="Student"
                >
                  {students.map((student) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <TextField
              label="Amount"
              type="number"
              value={editFormData.amount}
              onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={editFormData.status}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                label="Status"
              >
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="partial">Partial</MenuItem>
              </Select>
            </FormControl>
            {editFormData.status === 'paid' && (
              <>
                <TextField
                  label="Paid Date"
                  type="date"
                  value={editFormData.paidDate}
                  onChange={(e) => setEditFormData({ ...editFormData, paidDate: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth>
                  <InputLabel>Payment Mode</InputLabel>
                  <Select
                    value={editFormData.paymentMode || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, paymentMode: e.target.value })}
                    label="Payment Mode"
                  >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                    <MenuItem value="Bank">Bank</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Transaction ID"
                  value={editFormData.transactionId}
                  onChange={(e) => setEditFormData({ ...editFormData, transactionId: e.target.value })}
                  fullWidth
                  placeholder="Enter transaction ID (optional)"
                />
              </>
            )}
            <TextField
              label="Notes"
              value={editFormData.notes}
              onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
              fullWidth
              multiline
              rows={3}
              placeholder="Add any additional notes (optional)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setEditDialogOpen(false)}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #cc73f8 0%, #b35de0 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #b35de0 0%, #cc73f8 100%)',
              },
            }}
          >
            {selectedRecord ? 'Save Changes' : 'Add Payment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invoice Menu */}
      <Menu
        anchorEl={invoiceMenuAnchorEl}
        open={Boolean(invoiceMenuAnchorEl)}
        onClose={handleInvoiceMenuClose}
        PaperProps={{
          sx: {
            bgcolor: '#1e1e1e',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          },
        }}
      >
        <MenuItem onClick={handleViewInvoice}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText>View Invoice</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDownloadInvoice}>
          <ListItemIcon>
            <Download fontSize="small" sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText>Download PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleShareInvoice}>
          <ListItemIcon>
            <ShareIcon fontSize="small" sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText>Share Link</ListItemText>
        </MenuItem>
      </Menu>

      {/* Invoice Preview Dialog */}
      <Dialog
        open={invoicePreviewOpen}
        onClose={() => setInvoicePreviewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(18, 18, 40, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <DialogTitle>
          Invoice Preview
          <IconButton
            onClick={() => setInvoicePreviewOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: 'white',
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                Fee Invoice
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1">Student: {getStudentName(selectedInvoice.studentId)}</Typography>
                  <Typography variant="body2">Class: {getClassName(getStudentClassId(selectedInvoice.studentId))}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1">Invoice Date: {format(new Date(), 'dd MMM yyyy')}</Typography>
                  <Typography variant="body2">Due Date: {format(parseISO(selectedInvoice.dueDate), 'dd MMM yyyy')}</Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Payment Details
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Amount:</Typography>
                  <Typography>₹{selectedInvoice.amount}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Status:</Typography>
                  <Chip
                    label={selectedInvoice.status}
                    color={selectedInvoice.status === 'paid' ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
                {selectedInvoice.paidDate && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Paid Date:</Typography>
                    <Typography>{format(parseISO(selectedInvoice.paidDate), 'dd MMM yyyy')}</Typography>
                  </Box>
                )}
                {selectedInvoice.paymentMode && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Payment Mode:</Typography>
                    <Typography>{selectedInvoice.paymentMode}</Typography>
                  </Box>
                )}
              </Box>
              <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setInvoicePreviewOpen(false)}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  onClick={handleDownloadInvoice}
                  sx={{
                    background: 'linear-gradient(135deg, #cc73f8 0%, #b35de0 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #b35de0 0%, #cc73f8 100%)',
                    },
                  }}
                >
                  Download PDF
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Transaction History Dialog */}
      <Dialog
        open={transactionHistoryOpen}
        onClose={() => setTransactionHistoryOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(18, 18, 40, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <DialogTitle>
          Transaction History
          <IconButton
            onClick={() => setTransactionHistoryOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: 'white',
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedStudentForHistory && (
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                  src={selectedStudentForHistory.profileImage}
                  alt={selectedStudentForHistory.name}
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'rgba(204, 115, 248, 0.2)',
                    color: '#cc73f8',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                  }}
                >
                  {selectedStudentForHistory.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedStudentForHistory.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Class: {getClassName(selectedStudentForHistory.classId)}
                  </Typography>
                </Box>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ 
                      backgroundColor: 'rgba(33, 150, 243, 0.05)',
                      '& th': {
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        borderBottom: '1px solid rgba(33, 150, 243, 0.15)',
                        padding: '16px',
                      }
                    }}>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Month</TableCell>
                      <TableCell>Year</TableCell>
                      <TableCell>Due Amount</TableCell>
                      <TableCell>Paid Date</TableCell>
                      <TableCell>Paid Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Payment Method</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getStudentTransactionHistory(selectedStudentForHistory.id).map((record) => {
                      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                      const monthName = monthNames[parseInt(record.month) - 1];
                      const paidAmount = record.status === 'paid' ? record.amount : (record.paidAmount || 0);
                      
                      return (
                        <TableRow key={record.id} sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(33, 150, 243, 0.08)',
                            transition: 'background-color 0.2s ease',
                            cursor: 'pointer',
                          },
                          '&:last-child td, &:last-child th': { border: 0 }
                        }}>
                          <TableCell>{format(parseISO(record.dueDate), 'dd MMM yyyy')}</TableCell>
                          <TableCell>{getMonthName(record.month)}</TableCell>
                          <TableCell>{record.year}</TableCell>
                          <TableCell>₹{record.amount}</TableCell>
                          <TableCell>{record.paidDate ? format(parseISO(record.paidDate), 'dd MMM yyyy') : '-'}</TableCell>
                          <TableCell>₹{paidAmount}</TableCell>
                          <TableCell>
                            <Chip
                              label={record.status}
                              color={record.status === 'paid' ? 'success' : (record.status === 'partial' ? 'info' : 'warning')}
                              size="small"
                              sx={{
                                backgroundColor: record.status === 'paid' 
                                  ? 'rgba(76, 175, 80, 0.2)' 
                                  : (record.status === 'partial' 
                                    ? 'rgba(33, 150, 243, 0.2)' 
                                    : 'rgba(255, 152, 0, 0.2)'),
                                color: record.status === 'paid' 
                                  ? '#4caf50' 
                                  : (record.status === 'partial' 
                                    ? '#2196f3' 
                                    : '#ff9800'),
                                '& .MuiChip-label': {
                                  px: 1,
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>{record.paymentMode || '-'}</TableCell>
                          <TableCell>
                            {record.status === 'paid' && (
                              <Tooltip title="View Invoice">
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleInvoiceMenuOpen(e, record)}
                                  sx={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&:hover': {
                                      color: 'white',
                                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                  }}
                                >
                                  <ReceiptIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setTransactionHistoryOpen(false)}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FeeManagement;
