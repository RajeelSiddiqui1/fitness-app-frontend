import { io } from 'socket.io-client';

// Use environment variable for socket URL, empty string disables socket
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://fitness-app-backend-navy.vercel.app';

let socket = null;

/**
 * Initialize socket connection
 * @param {string} userId - The current user's ID
 * @returns {object} - The socket instance
 */
export const initSocket = (userId) => {
  // Don't initialize if no socket URL configured
  if (!SOCKET_URL) {
    console.log('Socket disabled - no VITE_SOCKET_URL configured');
    return null;
  }
  
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      // Join user to their personal room
      if (userId) {
        socket.emit('join', userId);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.log('Socket connection error (this is normal if no server):', error.message);
    });
  } else if (userId) {
    // Rejoin if socket exists but with new user
    socket.emit('join', userId);
  }

  return socket;
};

/**
 * Get the socket instance
 * @returns {object|null} - The socket instance or null
 */
export const getSocket = () => {
  return socket;
};

/**
 * Disconnect socket connection
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Listen for new notification events
 * @param {function} callback - Callback function to handle notification
 */
export const onNewNotification = (callback) => {
  if (socket) {
    socket.on('newNotification', (notification) => {
      callback(notification);
    });
  }
};

/**
 * Listen for notification count update events
 * @param {function} callback - Callback function to handle count update
 */
export const onNotificationCountUpdate = (callback) => {
  if (socket) {
    socket.on('notificationCountUpdate', ({ unreadCount }) => {
      callback(unreadCount);
    });
  }
};

/**
 * Remove all socket event listeners
 */
export const removeAllListeners = () => {
  if (socket) {
    socket.off('newNotification');
    socket.off('notificationCountUpdate');
  }
};
