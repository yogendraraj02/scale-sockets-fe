import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { DashboardData, Message } from "../types";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

interface UseSocketOptions {
  userId: string;
  onMessage: (message: Message) => void;
  onDashboardUpdate: (data: DashboardData) => void;
  onRegisterError: (reason: string) => void;
}

export function useSocket({ userId, onMessage, onDashboardUpdate, onRegisterError }: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // Keep callbacks in refs so socket listeners always call the latest version
  // without needing to re-create the socket on every render
  const onMessageRef = useRef(onMessage);
  const onDashboardUpdateRef = useRef(onDashboardUpdate);
  const onRegisterErrorRef = useRef(onRegisterError);
  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);
  useEffect(() => { onDashboardUpdateRef.current = onDashboardUpdate; }, [onDashboardUpdate]);
  useEffect(() => { onRegisterErrorRef.current = onRegisterError; }, [onRegisterError]);

  useEffect(() => {
    // Don't connect until we have a userId
    if (!userId) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('register', { userId });
      socket.emit('request:dashboard');
    });

    socket.on('register:error', ({ reason }: { reason: string }) => {
      onRegisterErrorRef.current(reason);
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
  }, [userId]); // only re-create socket when userId changes

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