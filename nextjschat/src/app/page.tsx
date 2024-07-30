"use client";
import { useEffect, useRef, useState } from 'react';

const Home: React.FC = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const socket = useRef<WebSocket | null>(null);
  const [setupMessage, setSetupMessage] = useState("");
  const [serverActions, setServerActions] = useState("");
  const [setup, setSetup] = useState(true);
  const [email, setEmail] = useState('');
  const [messages, setMessages] = useState([]);
  const handleEmailChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEmail(event.target.value);
  };

  useEffect(() => {
    // Ensure correct WebSocket connection port
    const ws = new WebSocket('ws://localhost:8080');

    socket.current = ws;

    ws.onopen = () => {
      console.log('WebSocket Client Connected');
      // ws.send('Hi this is web client');
    };

    ws.onmessage = (message) => {
      console.log('Received message from server:', message.data);
      const values = JSON.parse(message.data);
      console.log(Object.keys(values).length);
      if (Object.keys(values).length == 2){
        setSetupMessage("Hello " + values.email + "!");
      }
      if (values.hasOwnProperty('message')){
        setMessages((prevMessages: any) => [...prevMessages, values]);
      }
      else {
        setServerActions(message.data);
      }
    };

    ws.onclose = (event) => {
      console.log(`WebSocket Client Disconnected: ${event.code} - ${event.reason}`);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (textAreaRef.current && socket.current && socket.current.readyState === WebSocket.OPEN) {
      const message = textAreaRef.current.value;
      console.log('Sending message:', message);
      socket.current.send(JSON.stringify(["chat",message]));
    }
  };

  const setupProtocol = () => {
    setSetup(false);
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      const configMessage = JSON.stringify(["config", email]);
      console.log('Sending config message:', configMessage);
      socket.current.send(configMessage);
    }
  };

  return (
    <div className='bg-white'>
      <h1>{setupMessage}</h1>
      <h1>{serverActions}</h1>
      <p>Open the console to see WebSocket messages.</p>
      {setup && (
        <div>
          <textarea
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
          ></textarea>
          <button onClick={setupProtocol}>Enter Chat</button>
        </div>
      )}
      {messages.map((msg:any, index:any) => (
          <div key={index} className="message">
            <span className="message-email">{msg.email}:</span>
            <span className="message-content">{msg.message}</span>
            <span className="message-time">{new Date(msg.time).toLocaleTimeString()}</span>
          </div>
        ))}
      <textarea ref={textAreaRef} className="text-black" placeholder="Type your message here..."></textarea>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default Home;
