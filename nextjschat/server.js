import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { WebSocketServer } from 'ws';

const app = next({ dev: true });
const handle = app.getRequestHandler();
const userMap = new Map();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    if (req.url) {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }
  });

  const wss = new WebSocketServer({ port: 8080 });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
      console.log('received: %s', message);
      const vals = process(ws, JSON.parse(message));
      console.log('sending: ' + vals);
      if (vals) {
        ws.send(vals);
      }
    });

    ws.on('close', () => {
      userMap.delete(ws);
      console.log('Client disconnected');
    });
  });

  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
  });

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});

function process(ws, args) {
  if (args[0] == 'chat') {
    const user = userMap.get(ws);
    const chatValues = {
      email: user,
      message: args[1],
      time: Date.now(),
    };
    return JSON.stringify(chatValues);
  }

  if (args[0] == 'config') {
    const user = args[1];
    userMap.set(ws, user);
    const configValues = {
      email: user,
      time: Date.now(),
    };
    return JSON.stringify(configValues);
  }

  if (args[0] == 'quit') {
    const user = userMap.get(ws);
    const quitTime = {
      email: user,
      quit: true,
      time: Date.now(),
    };
    return JSON.stringify(quitTime);
  }

  return null;
}
