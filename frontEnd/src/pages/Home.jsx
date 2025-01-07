import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

const Room = ({socket}) => {
  const [sessionId, setSessionId] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [uuidv , setUuidv] = useState("") ;

  const navigate = useNavigate() ;

    // Generate a random UUID
    useEffect(() => {
        setUuidv(uuidv4()) ;
        // setSessionId(uuidv) ;
    }
    , []);

    // dark mode 
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setIsDarkMode(JSON.parse(savedMode));
    } else {
      setIsDarkMode(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  //socket set 
  useEffect(() => {
    socket.on('room-created' , (data) => {
        console.log('Room Created: ', data) ;

        navigate('/host' , {state: data}) ;
    })

    socket.on('room-joined' , (data)=> {
        console.log('Room join: ', data) ;

        navigate('/viewer' , {state: data}) ;
    })

    socket.on('error' , (err) => {
        console.error('Socket error:', err);
        alert(err.message || 'An error occurred.');
    } )

    // Cleanup listeners on unmount
    return () => {
        socket.off('room-created');
        socket.off('room-joined') ;
        socket.off('error');
      };

  } , [socket])

  const handleCreateRoom = () => {
    console.log("Room created!" , {sessionId: uuidv , name: 'HostName'});
    // Add logic to create a room
    
    socket.emit('create-room' , {sessionID: uuidv , name: 'HostName'}) ;
  };

  const handleJoinRoom = () => {
    if (sessionId.trim()) {
      console.log(`Joining room with Session ID: ${sessionId}`);
      // Add logic to join a room

      socket.emit('join-room' , {sessionID: sessionId , name: 'viewerName'})
    } else {
      alert("Please enter a valid Session ID.");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <button 
        onClick={toggleDarkMode} 
        className={`mb-6 px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'} text-sm transition-colors duration-300`}
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <div className="flex flex-col md:flex-row items-center justify-center gap-10">
        {/* Create Room Box */}
        <div className={`flex flex-col items-center justify-center gap-4 border shadow-lg rounded-lg p-6 w-[400px] h-[350px] max-w-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Create Room
            </h2>
            <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Create a session and share the ID with your friends to collaborate.
            </p>
            <button 
            className={`px-4 py-2 rounded-lg w-full text-lg font-medium transition-colors duration-300 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            onClick={handleCreateRoom}
            >
            Create Room
            </button>
            <div className="flex flex-col items-center mt-4 gap-2">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Session ID:
            </p>
            <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-lg text-sm font-mono ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {uuidv}
                </span>
                <button 
                className={`px-3 py-1 text-sm rounded-md font-medium transition-colors duration-300 ${isDarkMode ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-blue-400 hover:bg-blue-500 text-white'}`}
                onClick={() => {
                    navigator.clipboard.writeText(uuidv);
                    alert('Session ID copied to clipboard!');
                }}
                >
                Copy
                </button>
            </div>
            </div>
            <p className={`text-xs text-center mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Copy this session ID and share it with your friends.
            </p>
        </div>

        {/* Join Room Box */}
        {/* Join Room Box */}
        <div className={`flex flex-col items-center justify-center gap-4 border shadow-lg rounded-lg p-6 w-[400px] h-[350px] max-w-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Join Room
            </h2>
            <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Enter the session ID shared by the host to join the room and start collaborating.
            </p>
            <input 
                type="text" 
                className={`border rounded-lg w-full p-3 focus:outline-none focus:ring-2 text-sm font-mono transition-colors duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600 focus:ring-green-600 text-white' : 'bg-gray-50 border-gray-300 focus:ring-green-300 text-gray-800'}`}
                placeholder="Enter Room Session ID"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
            />
            <button 
                className={`px-4 py-2 rounded-lg w-full text-lg font-medium transition-colors duration-300 ${isDarkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                onClick={handleJoinRoom}
            >
                Join Room
            </button>
            <div className="text-xs mt-4">
                <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Don’t have a session ID? Ask the host to create a room and share the ID with you.
                </p>
            </div>
        </div>


      </div>
    </div>
  );
};

export default Room;