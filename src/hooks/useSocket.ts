import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { DashboardData, Message } from "../types";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

interface UseSocketOptions {
  token: string;
  onMessage: (message: Message) => void;
  onDashboardUpdate: (data: DashboardData) => void;
  onAuthError: () => void;
}

export function useSocket({ token, onMessage, onDashboardUpdate, onAuthError }: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const onMessageRef = useRef(onMessage);
  const onDashboardUpdateRef = useRef(onDashboardUpdate);
  const onAuthErrorRef = useRef(onAuthError);
  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);
  useEffect(() => { onDashboardUpdateRef.current = onDashboardUpdate; }, [onDashboardUpdate]);
  useEffect(() => { onAuthErrorRef.current = onAuthError; }, [onAuthError]);

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('register');
      socket.emit('request:dashboard');
    });

    socket.on('connect_error', (err) => {
      if (err.message === 'Authentication required') {
        onAuthErrorRef.current();
      }
    });

    socket.on('online-users', ({ users }: { users: string[] }) => {
      setOnlineUsers(users);
    });

    socket.on('message', (msg: Message) => onMessageRef.current(msg));
    socket.on('dashboard:update', (data: DashboardData) => onDashboardUpdateRef.current(data));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const sendMessage = (to: string, text: string) => {
    socketRef.current?.emit('message', { to, text });
  };

  const refreshDashboard = () => {
    socketRef.current?.emit('request:dashboard');
  };

  const requestOnlineUsers = () => {
    socketRef.current?.emit('request:online-users');
  };

  return { sendMessage, refreshDashboard, requestOnlineUsers, onlineUsers };
}
