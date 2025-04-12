import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClients';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

const SupabaseTest: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        // A simple query to test the connection
        const { data, error } = await supabase.from('students').select('count()', { count: 'exact' });
        
        if (error) {
          throw error;
        }
        
        setStatus('success');
      } catch (error: any) {
        console.error('Supabase connection error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Failed to connect to Supabase');
      }
    };

    testConnection();
  }, []);

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Supabase Connection Test
      </Typography>
      
      {status === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      )}
      
      {status === 'success' && (
        <Alert severity="success">
          Successfully connected to Supabase!
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert severity="error">
          Connection Error: {errorMessage}
        </Alert>
      )}
    </Box>
  );
};

export default SupabaseTest; 