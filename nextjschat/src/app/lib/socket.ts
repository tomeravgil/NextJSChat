import { io } from 'socket.io-client';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000';

const socket = io(SERVER_URL, {
  withCredentials: true,
  extraHeaders: {
    'my-custom-header': 'abcd'
  }
});

export default socket;
