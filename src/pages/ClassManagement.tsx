import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import { Add, Edit, Delete, Close, School } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useClasses, Class } from '../contexts/ClassContext';
import { ResponsiveTableWrapper } from '../utils/tableUtils';
import ResponsiveCard from '../components/ResponsiveCard';
import ResponsiveButton from '../components/ResponsiveButton';

const MotionCard = motion(Card);

const ClassManagement = () => {
  const { classes, addClass, updateClass, deleteClass } = useClasses();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentClass, setCurrentClass] = useState<Class>({
    id: '',
    name: '',
    fee: 0,
    notes: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    fee: '',
    notes: '',
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = (edit = false, classItem?: Class) => {
    if (edit && classItem) {
      setEditMode(true);
      setCurrentClass(classItem);
    } else {
      setEditMode(false);
      setCurrentClass({
        id: '',
        name: '',
        fee: 0,
        notes: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({ name: '', fee: '', notes: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentClass({
      ...currentClass,
      [name]: name === 'fee' ? Number(value) : value,
    });
    
    // Clear the error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!currentClass.name.trim()) {
      newErrors.name = 'Class/Course name is required';
      valid = false;
    }
    
    if (currentClass.fee <= 0) {
      newErrors.fee = 'Fee must be greater than 0';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    if (editMode) {
      updateClass(currentClass);
    } else {
      addClass({
        name: currentClass.name,
        fee: currentClass.fee,
      });
    }
    
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this class? This may affect existing students.')) {
      deleteClass(id);
    }
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        mb: { xs: 2, sm: 3, md: 4 }, 
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
          Manage Classes / Courses
        </Typography>
        <ResponsiveButton
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{
            background: 'linear-gradient(135deg, #cc73f8 0%, #b35de0 100%)',
            boxShadow: '0 4px 15px rgba(204, 115, 248, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(204, 115, 248, 0.4)',
            },
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          Add Class/Course
        </ResponsiveButton>
      </Box>

      {/* Mobile Card View */}
      {isMobile && (
        <Box sx={{ mt: 2 }}>
          {classes.length > 0 ? (
            <Grid container spacing={2}>
              {classes.map((classItem) => (
                <Grid item xs={12} key={classItem.id}>
                  <ResponsiveCard
                    sx={{
                      p: 2,
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 1.5,
                          borderRadius: '12px',
                          bgcolor: 'rgba(204, 115, 248, 0.2)',
                          color: '#cc73f8',
                          mr: 2
                        }}
                      >
                        <School fontSize="medium" />
                      </Box>
                      <Typography variant="h6" color="white" fontWeight={600} sx={{ flex: 1 }}>
                        {classItem.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                        Fee Amount
                      </Typography>
                      <Chip
                        label={`₹${classItem.fee.toLocaleString()}`}
                        sx={{
                          bgcolor: 'rgba(255, 107, 107, 0.2)',
                          color: '#ff6b6b',
                          fontWeight: 500,
                          height: '28px'
                        }}
                      />
                    </Box>
                    
                    {classItem.notes && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" mb={0.5}>
                          Notes
                        </Typography>
                        <Typography variant="body2" color="white">
                          {classItem.notes}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'flex-end',
                      mt: classItem.notes ? 0 : 1.5,
                      pt: 1.5,
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <Button
                        startIcon={<Edit />}
                        onClick={() => handleOpen(true, classItem)}
                        sx={{ 
                          color: '#4ecdc4',
                          mr: 1,
                          '&:hover': {
                            backgroundColor: 'rgba(78, 205, 196, 0.1)',
                          }
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        startIcon={<Delete />}
                        onClick={() => handleDelete(classItem.id)}
                        sx={{ 
                          color: '#ff6b6b',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 107, 107, 0.1)',
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </ResponsiveCard>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ 
              p: 3, 
              textAlign: 'center', 
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Typography color="white">
                No classes/courses found. Add a new one to get started.
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Desktop Table View */}
      {!isMobile && (
        <ResponsiveTableWrapper>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 600,
                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
                  }}>
                    Class/Course Name
                  </TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 600,
                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
                  }}>
                    Fee Amount (₹)
                  </TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 600,
                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                    display: { xs: 'none', md: 'table-cell' }
                  }}>
                    Notes
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    color: 'white', 
                    fontWeight: 600,
                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
                  }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classes.length > 0 ? (
                  classes.map((classItem, index) => (
                    <TableRow
                      key={classItem.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        },
                        // Add striped rows for better visibility
                        bgcolor: index % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ 
                          color: 'white', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 1,
                            borderRadius: '8px',
                            bgcolor: 'rgba(204, 115, 248, 0.2)',
                            color: '#cc73f8',
                          }}
                        >
                          <School />
                        </Box>
                        <Typography 
                          sx={{ 
                            fontWeight: 500, 
                            fontSize: '1rem',
                            lineHeight: '1.3'
                          }}
                        >
                          {classItem.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        <Chip
                          label={`₹${classItem.fee.toLocaleString()}`}
                          sx={{
                            bgcolor: 'rgba(255, 107, 107, 0.2)',
                            color: '#ff6b6b',
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ 
                        color: 'white',
                        display: { xs: 'none', md: 'table-cell' } 
                      }}>
                        {classItem.notes || '-'}
                      </TableCell>
                      <TableCell align="right">
                        <Stack 
                          direction="row" 
                          spacing={1} 
                          justifyContent="flex-end"
                        >
                          <IconButton
                            onClick={() => handleOpen(true, classItem)}
                            sx={{ color: '#4ecdc4' }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(classItem.id)}
                            sx={{ color: '#ff6b6b' }}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ color: 'white' }}>
                      No classes/courses found. Add a new one to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </ResponsiveTableWrapper>
      )}

      {/* Add/Edit Class Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: { xs: '12px', sm: '16px' },
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            margin: { xs: 2, sm: 4 },
            width: { xs: 'calc(100% - 32px)', sm: '100%' },
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: 'white',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          py: { xs: 1.5, sm: 2 },
          px: { xs: 2, sm: 3 },
          fontSize: { xs: '1.1rem', sm: '1.25rem' }
        }}>
          {editMode ? 'Edit Class/Course' : 'Add New Class/Course'}
          <IconButton onClick={handleClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            <Close sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 }, my: { xs: 1, sm: 2 } }}>
            <TextField
              label="Class/Course Name"
              name="name"
              value={currentClass.name}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name}
              placeholder="e.g., Class 6, Spoken English, Math Tuition"
              sx={{
                '& .MuiInputBase-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(204, 115, 248, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(204, 115, 248, 0.6)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiFormHelperText-root': {
                  color: 'rgba(255, 107, 107, 0.9)',
                },
              }}
            />
            <TextField
              label="Fee Amount"
              name="fee"
              type="number"
              value={currentClass.fee}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.fee}
              helperText={errors.fee}
              placeholder="e.g., 5000"
              InputProps={{
                startAdornment: <InputAdornment position="start" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>₹</InputAdornment>,
              }}
              sx={{
                '& .MuiInputBase-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(204, 115, 248, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(204, 115, 248, 0.6)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiFormHelperText-root': {
                  color: 'rgba(255, 107, 107, 0.9)',
                },
              }}
            />
            <TextField
              label="Notes (Optional)"
              name="notes"
              value={currentClass.notes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              placeholder="Add any additional information about this class"
              sx={{
                '& .MuiInputBase-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(204, 115, 248, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(204, 115, 248, 0.6)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 }, pt: 1 }}>
          <Button 
            onClick={handleClose}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #cc73f8 0%, #b35de0 100%)',
              color: 'white',
              minWidth: '100px',
              '&:hover': {
                boxShadow: '0 4px 15px rgba(204, 115, 248, 0.3)',
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

export default ClassManagement; 