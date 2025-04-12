import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Snackbar, Alert, AlertProps, Button } from '@mui/material';
import { subscribeToPushNotifications } from '../serviceWorkerRegistration';

// Define the context type
type NotificationContextType = {
  showNotification: (message: string, severity?: AlertProps['severity']) => void;
  closeNotification: () => void;
  enablePushNotifications: () => Promise<void>;
};

// Create context with default values
const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {},
  closeNotification: () => {},
  enablePushNotifications: async () => {},
});

// Custom hook to use the notification context
export const useNotification = () => useContext(NotificationContext);

// Types for the provider props
type NotificationProviderProps = {
  children: ReactNode;
};

// The provider component
export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertProps['severity']>('info');
  const [showPushPrompt, setShowPushPrompt] = useState(false);

  // Check if we should show the push notification prompt
  useEffect(() => {
    const shouldShowPrompt = localStorage.getItem('pushNotificationsPrompted') !== 'true';
    
    if (shouldShowPrompt) {
      // Show the prompt after a delay
      const timer = setTimeout(() => {
        setShowPushPrompt(true);
      }, 10000); // 10 seconds delay
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Function to show a notification
  const showNotification = (
    message: string,
    severity: AlertProps['severity'] = 'info'
  ) => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  // Function to close the notification
  const closeNotification = () => {
    setOpen(false);
  };

  // Function to enable push notifications
  const enablePushNotifications = async () => {
    try {
      await subscribeToPushNotifications();
      showNotification('Push notifications enabled successfully!', 'success');
    } catch (error) {
      showNotification('Failed to enable push notifications', 'error');
      console.error('Error enabling push notifications:', error);
    } finally {
      setShowPushPrompt(false);
      localStorage.setItem('pushNotificationsPrompted', 'true');
    }
  };

  // Function to dismiss the push notification prompt
  const dismissPushPrompt = () => {
    setShowPushPrompt(false);
    localStorage.setItem('pushNotificationsPrompted', 'true');
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification, closeNotification, enablePushNotifications }}
    >
      {children}
      
      {/* General notification snackbar */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={closeNotification}
          severity={severity}
          sx={{ width: '100%', borderRadius: '12px' }}
        >
          {message}
        </Alert>
      </Snackbar>

      {/* Push notification prompt */}
      <Snackbar
        open={showPushPrompt}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: '20px' }}
      >
        <Alert
          severity="info"
          sx={{
            width: '100%',
            borderRadius: '12px',
            backgroundColor: 'rgba(204, 115, 248, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(204, 115, 248, 0.2)',
          }}
          action={
            <>
              <Button
                color="inherit"
                size="small"
                onClick={dismissPushPrompt}
                sx={{ mr: 1 }}
              >
                Later
              </Button>
              <Button
                color="primary"
                size="small"
                variant="contained"
                onClick={enablePushNotifications}
                sx={{
                  background: 'linear-gradient(135deg, #cc73f8 0%, #b35de0 100%)',
                  boxShadow: '0 4px 15px rgba(204, 115, 248, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(204, 115, 248, 0.4)',
                  },
                }}
              >
                Enable
              </Button>
            </>
          }
        >
          Would you like to receive fee reminders and attendance notifications?
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider; 