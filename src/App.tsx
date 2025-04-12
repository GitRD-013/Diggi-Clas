import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './theme/theme';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NotificationProvider } from './components/Notification';
import { ClassProvider } from './contexts/ClassContext';
import { StudentProvider } from './contexts/StudentContext';
import { ChatProvider } from './contexts/ChatContext';
import { AuthProvider } from './contexts/AuthContext';

// Components
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StudentManagement from './pages/StudentManagement';
import FeeManagement from './pages/FeeManagement';
import AttendanceManagement from './pages/AttendanceManagement';
import PerformanceTracking from './pages/PerformanceTracking';
import ClassManagement from './pages/ClassManagement';
import AIAssistant from './pages/AIAssistant';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import UsecaseDetails from './pages/UsecaseDetails';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import StudentReport from './pages/StudentReport';

const queryClient = new QueryClient();

function ErrorFallback({ error }: { error: Error }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: 3,
        backgroundColor: '#121212',
        color: 'white',
      }}
    >
      <Typography variant="h4" gutterBottom color="error">
        Something went wrong:
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        {error.message}
      </Typography>
      <pre style={{ maxWidth: '100%', overflow: 'auto', background: '#1e1e1e', padding: 16, borderRadius: 8 }}>
        {error.stack}
      </pre>
    </Box>
  );
}

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return <ErrorFallback error={error} />;
  }

  try {
    console.log('Rendering App component');
    
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <ClassProvider>
              <StudentProvider>
                <NotificationProvider>
                  <ChatProvider>
                    <Router>
                      <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        {/* Protected routes */}
                        <Route 
                          path="/dashboard" 
                          element={
                            <ProtectedRoute>
                              <Layout />
                            </ProtectedRoute>
                          }
                        >
                          <Route index element={<Dashboard />} />
                          <Route path="classes" element={<ClassManagement />} />
                          <Route path="students" element={<StudentManagement />} />
                          <Route path="fees" element={<FeeManagement />} />
                          <Route path="attendance" element={<AttendanceManagement />} />
                          <Route path="performance" element={<PerformanceTracking />} />
                          <Route path="student-report/:studentId" element={<StudentReport />} />
                          <Route path="ai-assistant" element={<AIAssistant />} />
                        </Route>
                        <Route path="/usecases/:type" element={<UsecaseDetails />} />
                        <Route path="/pricing" element={<PricingPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                      </Routes>
                    </Router>
                  </ChatProvider>
                </NotificationProvider>
              </StudentProvider>
            </ClassProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  } catch (err) {
    console.error('Error rendering App:', err);
    setError(err instanceof Error ? err : new Error(String(err)));
    return <ErrorFallback error={err instanceof Error ? err : new Error(String(err))} />;
  }
}

export default App; 