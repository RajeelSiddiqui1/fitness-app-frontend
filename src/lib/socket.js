import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let socket = null;

/**
 * Initialize socket connection
 * @param {string} userId - The current user's ID
 * @returns {object} - The socket instance
 */
export const initSocket = (userId) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
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
      console.error('Socket connection error:', error);
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
