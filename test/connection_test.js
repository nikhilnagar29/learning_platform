const io = require('socket.io-client');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Configuration
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const NUM_CLIENTS = 200; // Reduced from 50 to 20 for initial testing
const TEST_DURATION = 60000; // Reduced from 60000 to 30000 for faster testing
const ELEMENT_SEND_INTERVAL = 100; // Send an element every 1 second
const SESSION_ID = uuidv4(); // Generate a unique session ID for this test
const RESULTS_FILE = './results.json';

// Connection options
const connectionOptions = {
  forceNew: true,
  reconnectionAttempts: 'Infinity',
  timeout: 10000,
  transports: ['websocket'],
};

console.log(`Starting connection test with ${NUM_CLIENTS} clients`);
console.log(`Session ID: ${SESSION_ID}`);
console.log(`Server URL: ${SERVER_URL}`);

// Create host client
const hostSocket = io.connect(SERVER_URL, connectionOptions);
const clients = [];
const latencies = [];
const connectionResults = {
  totalClients: NUM_CLIENTS,
  successfulConnections: 0,
  failedConnections: 0,
  averageConnectionTime: 0,
  averageLatency: 0,
  maxConcurrentConnections: 0,
  testDuration: TEST_DURATION / 1000,
  timestamp: new Date().toISOString(),
};

const connectionTimes = [];
let elementsReceived = 0;

// First create the room with host
hostSocket.on('connect', () => {
  console.log('Host connected, creating room...');
  
  hostSocket.emit('create-room', { sessionID: SESSION_ID, name: 'TestHost' });
  
  hostSocket.on('room-created', (data) => {
    console.log('Room created:', data);
    startTest();
  });
});

hostSocket.on('error', (err) => {
  console.error('Host connection error:', err);
});

hostSocket.on('connect_error', (err) => {
  console.error('Host connect error:', err);
});

function startTest() {
  // Connect clients
  for (let i = 0; i < NUM_CLIENTS; i++) {
    setTimeout(() => {
      connectClient(i);
    }, i * 200); // Stagger connections to avoid overwhelming the server
  }

  // Send test elements from host
  const sendInterval = setInterval(() => {
    const testElement = [
    {
      type: 'rectangle',
      offsetX: Math.random() * 100,
      offsetY: Math.random() * 100,
      storke: '#005000',
      height: Math.random() * 100,
      width: Math.random() * 100,

      timestamp: Date.now(), // Add timestamp for latency calculation
    },
    {
        type: 'rectangle',
        offsetX: Math.random() * 200,
        offsetY: Math.random() * 200,
        storke: '#005000',
        height: Math.random() * 100,
        width: Math.random() * 100,
        
        timestamp: Date.now(), // Add timestamp for latency calculation
    }
    ,
    {
        type: 'rectangle',
        offsetX: Math.random() * 300,
        offsetY: Math.random() * 300,
        storke: '#005000',
        height: Math.random() * 100,
        width: Math.random() * 100,
        
        timestamp: Date.now(), // Add timestamp for latency calculation
    }
    ,
    {
        type: 'highlight',
        shadowColor: ('#00' + Math.floor(Math.random() * 255).toString(16) + '0000'),
        stroke: ('#00' + Math.floor(Math.random() * 255).toString(16) + '0000'),
        strokeStyle: ('#00' + Math.floor(Math.random() * 255).toString(16) + '0000'),
        path: [
            [ Math.random() * 500, Math.random() * 1000],
            [ Math.random() * 500, Math.random() * 1000],    
            [ Math.random() * 500, Math.random() * 1000],
            [ Math.random() * 500, Math.random() * 1000],    
            [ Math.random() * 500, Math.random() * 1000],
            [ Math.random() * 500, Math.random() * 1000],    
            [ Math.random() * 500, Math.random() * 1000],
            [ Math.random() * 500, Math.random() * 1000],
            [ Math.random() * 500, Math.random() * 1000],    
            [ Math.random() * 500, Math.random() * 1000],
            [ Math.random() * 500, Math.random() * 1000],    
            [ Math.random() * 500, Math.random() * 1000],
            [ Math.random() * 500, Math.random() * 1000],    
            [ Math.random() * 500, Math.random() * 1000],
        ],

        
        timestamp: Date.now(), // Add timestamp for latency calculation
    }
    

];
    
    hostSocket.emit('add-element', { 
      sessionID: SESSION_ID, 
      element: testElement
    });
    
    // console.log(`Sent element: ${testElement.id}`);
  }, ELEMENT_SEND_INTERVAL);

  // End test after duration
  setTimeout(() => {
    clearInterval(sendInterval);
    endTest();
  }, TEST_DURATION);
}

function connectClient(index) {
  const startTime = Date.now();
  const client = io.connect(SERVER_URL, connectionOptions);
  
  client.on('connect', () => {
    const connectionTime = Date.now() - startTime;
    connectionTimes.push(connectionTime);
    
    console.log(`Client ${index} connected in ${connectionTime}ms`);
    connectionResults.successfulConnections++;
    
    if (connectionResults.successfulConnections > connectionResults.maxConcurrentConnections) {
      connectionResults.maxConcurrentConnections = connectionResults.successfulConnections;
    }
    
    // Join the room
    client.emit('join-room', { sessionID: SESSION_ID, name: `Viewer${index}` });
    
    client.on('room-joined', (data) => {
      console.log(`Client ${index} joined room:`, data);
      clients.push(client);
    });
    
    // Listen for elements and measure latency
    client.on('element-added', (data) => {
      const element = data.element[0];
      if (element && element.timestamp) {
        const latency = Date.now() - element.timestamp;
        latencies.push(latency);
        elementsReceived++;
        
        console.log(`Client ${index} received element with latency: ${latency}ms`);
      } else {
        console.log(`Client ${index} received element (no timestamp)`);
        elementsReceived++;
      }
    });
  });
  
  client.on('connect_error', (err) => {
    console.error(`Client ${index} connection error:`, err);
    connectionResults.failedConnections++;
  });
}

function endTest() {
  console.log('\n--- Test Results ---');
  
  // Calculate average connection time
  const totalConnectionTime = connectionTimes.reduce((sum, time) => sum + time, 0);
  connectionResults.averageConnectionTime = totalConnectionTime / connectionTimes.length || 0;
  
  // Calculate average latency
  const totalLatency = latencies.reduce((sum, latency) => sum + latency, 0);
  connectionResults.averageLatency = totalLatency / latencies.length || 0;
  
  // Add elements received
  connectionResults.elementsReceived = elementsReceived;
  
  // Log results
  console.log(`Successful Connections: ${connectionResults.successfulConnections}/${NUM_CLIENTS}`);
  console.log(`Failed Connections: ${connectionResults.failedConnections}`);
  console.log(`Max Concurrent Connections: ${connectionResults.maxConcurrentConnections}`);
  console.log(`Average Connection Time: ${connectionResults.averageConnectionTime.toFixed(2)}ms`);
  console.log(`Average Latency: ${connectionResults.averageLatency.toFixed(2)}ms`);
  console.log(`Elements Received: ${elementsReceived}`);
  
  // Save results to file
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(connectionResults, null, 2));
  console.log(`\nResults saved to ${RESULTS_FILE}`);
  
  // Disconnect all clients
  console.log('Disconnecting all clients...');
  clients.forEach(client => client.disconnect());
  hostSocket.disconnect();
  
  console.log('Test completed.');
  process.exit(0);
}

// Handle errors and cleanup
process.on('SIGINT', () => {
  console.log('Test interrupted. Cleaning up...');
  clients.forEach(client => client.disconnect());
  hostSocket.disconnect();
  process.exit(1);
}); 