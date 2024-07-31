"use client"
import { useState, useEffect } from 'react';
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import socket from './lib/socket';
interface Message {
  username: string;
  message: string;
  time:string;
  active:boolean;
}

const Home = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  
  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      try {
        const now = new Date();
        const parsedMessage = JSON.parse(message);
        parsedMessage.time = now.toTimeString().split(' ')[0].slice(0, 5);
        parsedMessage.active = true;
        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
        console.log(parsedMessage.username);
        console.log(parsedMessage.message);
      } catch (error) {
        console.error('Error parsing JSON string:', error);
      }
    });

    socket.on('clientDisconnected', (message) => {
      const parsedMessage = JSON.parse(message);
      const disconnectedUsername = parsedMessage.username;
      setMessages((prevMessages) => {
        return prevMessages.map((msg) => {
          if (msg.username === disconnectedUsername) {
            return { ...msg, active: false };
          }
          return msg;
        });
      });
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('clientDisconnected');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', message);
      setMessage('');
    }
  };

  const handleSetUsername = () => {
    if (username.trim()) {
      socket.emit('setUsername', username);
      setIsUsernameSet(true);
    }
  };


  return (
    <div >
      {!isUsernameSet ? (
        <div >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="flex-1 p-2 border border-gray-300 rounded mr-2"
          />
          <button onClick={handleSetUsername} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Set Username</button>
        </div>
      ) : (
        <div className="flex flex-col justify-between h-screen w-full p-4">
          <div>
            {messages.map((msg: Message, index) => (
              <MessageCard 
                indexVal={index}
                photo=""
                username={msg.username} 
                isUser={msg.username == username}
                message={msg.message} 
                time={msg.time}
                active={msg.active}              
              />
            ))}
          </div>
          <div className='flex justify-center mx-10'>
            <div className="flex items-center w-full">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-1 p-2 border border-gray-300 rounded mr-2"
              />
              <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Send</button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Home;

interface User {
  indexVal: number;
  photo: string;
  username: string;
  isUser: boolean;
  active: boolean;
  message: string;
  time: string;
}

const MessageCard:React.FC<User> = 
  
  ({
    indexVal,
    photo,
    username,
    isUser,
    active,
    message,
    time
  }: User) => 
  {
  return(
    <div key={indexVal} className={`flex items-end mt-4 ${!isUser ? 'justify-start' : 'justify-end'}`}>
      {!isUser && 
      <Avatar isBordered color={`${active ? 'success' : 'danger'}`} src={photo} 
      fallback=
      {
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="text-white size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      } 
      className='mx-2.5 bg-gray-600'
      />}
      <Card className='inline-block max-w-xs bg-gray-600 flex-col'>
        <CardHeader className='pb-0 text-tiny text-white/60 uppercase font-bold'>{username}</CardHeader>
        <CardBody className='py-0 text-gray-100 font-medium text-medium'>
          {message}
        </CardBody>
        <CardFooter className={`pt-0 pb-1 text-tiny text-white/60 flex ${isUser ? 'justify-start' : 'justify-end'}`}>{time}</CardFooter>
      </Card>

      {isUser && 
      <Avatar src={photo} 
      fallback=
      {
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="text-white size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      } 
      className='mx-2.5'
      />}
    </div>
  )
}
