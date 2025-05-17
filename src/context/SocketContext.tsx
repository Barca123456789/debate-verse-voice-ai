
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, status } = useAuth();

  useEffect(() => {
    // Mock socket for development
    // In production, this would connect to your actual backend
    const mockSocket = io('https://mock-socket-url.com', {
      autoConnect: false,
      reconnection: true,
      transports: ['websocket'],
    });

    function onConnect() {
      setIsConnected(true);
      console.log('Socket connected');
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log('Socket disconnected');
    }

    if (status === 'authenticated' && user) {
      // Connect and setup listeners
      mockSocket.auth = { token: localStorage.getItem('debateHubToken') };
      mockSocket.connect();
      
      mockSocket.on('connect', onConnect);
      mockSocket.on('disconnect', onDisconnect);

      setSocket(mockSocket);
    }

    return () => {
      if (mockSocket) {
        mockSocket.off('connect', onConnect);
        mockSocket.off('disconnect', onDisconnect);
        mockSocket.disconnect();
      }
    };
  }, [user, status]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
