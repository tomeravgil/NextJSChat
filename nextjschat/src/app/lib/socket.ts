import { io } from 'socket.io-client';

const socket = io('http://129.161.81.209:4000'); // Use the actual IP address

export default socket;
