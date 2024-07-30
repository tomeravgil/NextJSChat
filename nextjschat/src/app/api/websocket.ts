// // pages/api/websocket.ts
// import { Server } from 'ws';
// import { NextApiRequest, NextApiResponse } from 'next';

// let wss: Server | undefined;

// export default (req: NextApiRequest, res: NextApiResponse) => {
// //   if (!wss) {
// //     wss = new Server({ noServer: true });

// //     wss.on('connection', (ws:any) => {
// //       ws.on('message', (message:any) => {
// //         console.log(`Received message: ${message}`);
// //         ws.send(`Hello, you sent -> ${message}`);
// //       });
// //     });

// //     console.log('WebSocket server created');
// //   }

//   res.status(200).json({ message: 'WebSocket server is running' });
// };

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
