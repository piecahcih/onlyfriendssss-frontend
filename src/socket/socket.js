import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3999";

export const createSocketInstance = (token) => {
    const socket = io(SOCKET_URL, {
        auth: {
            token: token
        },
        transports: ['websocket','polling'],
        withCredentials:true,
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    })

    socket.on('connect_error', (err) => {
        console.error('Socket Connection Error:', err.message)
    })
    return socket
}