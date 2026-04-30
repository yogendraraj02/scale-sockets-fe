import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { Message } from "../types";

export function useSocket(userId: string, onMessage: (message: Message) => void) {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socket = io('http://localhost:8080', {
            transports: ['websocket'],
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
            socket.emit('register', { userId });
        });
        // Listen for incoming messages
        socket.on('message', onMessage);

        
        return () => {
            socket.disconnect();
        };
    }, [userId]);
    
    const sendMessage = (to: string, text: string) => {
        console.log(`what are you doing sendMessage`,to,text);
        
        socketRef.current?.emit('message', {to, text});
    }

    return { sendMessage }
}