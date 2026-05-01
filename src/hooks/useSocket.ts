import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { DashboardData, Message } from "../types";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
export function useSocket(userId: string, onMessage: (message: Message) => void, onDashboardUpdate: (data: DashboardData) => void) {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('register', { userId });
            socket.emit('request:dashboard');
        });
        // Listen for incoming messages
        socket.on('message', onMessage);
        // Listen for dashboard updates
        socket.on('dashboard:update', onDashboardUpdate);

        return () => {
            socket.disconnect();
        };
    }, [userId]);

    const sendMessage = (to: string, text: string) => {
        socketRef.current?.emit('message', { to, text });
    }
    const refreshDashboard = () => {
        socketRef.current?.emit('request:dashboard');
    }


    return { sendMessage, refreshDashboard };
}