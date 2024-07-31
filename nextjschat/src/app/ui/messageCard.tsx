import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";

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
    );
}

export default MessageCard;