import React, { useState, useEffect } from "react";

const Room = () => {
  const [sessionId, setSessionId] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setIsDarkMode(JSON.parse(savedMode));
    } else {
      setIsDarkMode(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  const handleCreateRoom = () => {
    console.log("Room created!");
    // Add logic to create a room
  };

  const handleJoinRoom = () => {
    if (sessionId.trim()) {
      console.log(`Joining room with Session ID: ${sessionId}`);
      // Add logic to join a room
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
        <div className={`flex flex-col items-center justify-center gap-3 border shadow-lg rounded-lg p-6 w-[400px] h-[300px]  max-w-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className="text-xl font-bold mb-4">Create Room</h2>
          <button 
            className={`px-4 py-2 rounded-lg w-full transition-colors duration-300 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            onClick={handleCreateRoom}
          >
            Create Room
          </button>
        </div>

        {/* Join Room Box */}
        <div className={`flex flex-col items-center justify-center gap-3 border shadow-lg rounded-lg p-6 w-[400px] h-[300px] max-w-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className="text-xl font-bold mb-4">Join Room</h2>
          <input 
            type="text" 
            className={`border rounded w-full p-2 mb-4 focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 focus:ring-blue-600' : 'bg-white border-gray-300 focus:ring-blue-300'} text-inherit`}
            placeholder="Enter Room Session ID"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
          />
          <button 
            className={`px-4 py-2 rounded-lg w-full transition-colors duration-300 ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
            onClick={handleJoinRoom}
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room;