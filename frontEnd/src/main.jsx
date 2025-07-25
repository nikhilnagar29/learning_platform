import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import io from 'socket.io-client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import RoomPage from './pages/RoomPage'
import Home from './pages/Home.jsx'
import ViewerLook from './pages/Viewer.jsx'

const server = "https://learning-platform-backend-tqmf.onrender.com" ;

const connectionOptions = {
  forceNew: true,
  reconnectionAttempts: 'Infinity',
  timeout: 10000,
  transports: ['websocket'],
};

// Initialize the socket connection
const socket = io.connect(server, connectionOptions);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home socket={socket} />} />
        <Route path="/host" element={<RoomPage socket={socket} />} />
        <Route path="/viewer" element={<ViewerLook socket={socket} />} />
      </Routes>
    </Router>
  </StrictMode>
)
