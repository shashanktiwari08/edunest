const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const url = require('url');

const { initDb } = require('./db');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const teacherRouter = require('./routes/teacher');
const studentRouter = require('./routes/student');

const app = express();
const PORT = 5000;

// Enable CORS for frontend local development
app.use(cors({
  origin: '*', // We can allow all or adjust to frontend Vite port (usually 5173)
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Set up routes
const chatRouter = require('./routes/chat');
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/teacher', teacherRouter);
app.use('/api/student', studentRouter);
app.use('/api/chat', chatRouter);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', time: new Date() });
});

// Welcome message for root index
app.get('/', (req, res) => {
  res.send('Edunest Tuition Management Backend API is up and running.');
});

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server attached to HTTP server
const wss = new WebSocket.Server({ noServer: true });

// Handle WebSocket upgrade
server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;

  // We can upgrade all or check path
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// WebSocket connection handler
wss.on('connection', (ws, request) => {
  const parameters = url.parse(request.url, true).query;
  const userId = parameters.userId;

  if (userId) {
    ws.userId = userId;
    console.log(`WebSocket client connected for user: ${userId}`);
  } else {
    console.log('WebSocket client connected without userId.');
  }

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`Received WS message from client:`, data);
      
      // If client wants to register/update its userId
      if (data.type === 'REGISTER' && data.userId) {
        ws.userId = data.userId;
        console.log(`WebSocket registered userId for connection: ${data.userId}`);
        ws.send(JSON.stringify({ type: 'REGISTER_SUCCESS', userId: data.userId }));
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err);
    }
  });

  ws.on('close', () => {
    console.log(`WebSocket client disconnected for user: ${ws.userId || 'unknown'}`);
  });

  // Welcome message
  ws.send(JSON.stringify({ type: 'WELCOME', message: 'Connected to Tuition WS Server' }));
});

// WebSocket Broadcast Helper
const wssBroadcast = (payload) => {
  const dataStr = JSON.stringify(payload);
  console.log(`Broadcasting WS message to clients. Type: ${payload.type}`);
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      // If payload is restricted to specific students, check if client.userId is in the list
      if (payload.studentIds && Array.isArray(payload.studentIds)) {
        if (!client.userId || !payload.studentIds.includes(client.userId)) {
          return; // Skip this client
        }
      }
      client.send(dataStr);
    }
  });
};

// Expose WebSocket broadcast to Express app
app.set('wssBroadcast', wssBroadcast);

// Initialize DB and start server
const startServer = async () => {
  await initDb();
  server.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(` Tuition Backend running on port ${PORT} `);
    console.log(` WebSocket Server active on same port     `);
    console.log(`=========================================`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
});
