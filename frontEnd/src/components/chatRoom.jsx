import React, { useCallback, useEffect, useState } from 'react';

const ChatRoom = ({roomData , socket , role = "ME"}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
//   const [role, setRole] = useState(role) ;

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
        // Listen for incoming messages
        socket.on("message-received", (data) => {
            // console.log("Received message:", data);
            const { message, name, role } = data;

            setMessages((prev) => [
                ...prev,
                { role, name, message, id: Date.now() },
            ]);
        });

        // Cleanup the event listener on component unmount
        return () => {
            socket.off("message-received");
        };
    }, [socket]);


  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.trim()) {

      setMessages( (prev) => 
            [...prev, 
            { role , name:roomData.name , message, id: Date.now() }]);

                // console.log(role  , message) ;
        var updatedRole = role ;
        if(role === "ME"){
            updatedRole = "VIEWER" ;
        }
      socket.emit("new-message" , { role: updatedRole , name: roomData.name , sessionID: roomData.sessionID , message, id: Date.now() } )
      
      setMessage('');
    }
  };

  const handleColoreOfMsg = useCallback((role) => {
    // console.log(role);
    if(role === "HOST"){
        return "text-red-300" ;
    }
    else if(role === "ME"){
        return "text-green-300" ;
    }
    else{
        return "text-blue-300"
    }
  } , [])

  return (
    <div className="relative">
        {/* Chat Button - Positioned at the bottom right */}
        <button
            onClick={toggleChat}
            className="fixed bottom-8 right-8 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
            <span className="sr-only">Open Chat</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        </button>

        {/* Chat Room - Fixed at the bottom right, with rounded corners on top */}
        <div
            id="chatArea"
            className={`fixed bottom-0 right-0 w-1/3 max-w-96 h-3/4 bg-gray-900 bg-opacity-90 text-white shadow-2xl rounded-t-2xl transform transition-transform duration-500 ease-in-out ${
            isOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
        >
            {/* Chat Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h3 className="text-lg font-bold text-blue-400">Chat </h3>
            <button
                onClick={toggleChat}
                className="bg-red-600 text-white px-3 py-1 rounded-md shadow-md hover:bg-red-700 transition-all duration-300"
                aria-label="Close Chat"
            >
                ×
            </button>
            </div>

            {/* Chat Display - Scrollable area for messages */}
            <div 
            className="chat-container overflow-y-auto p-4"
            style={{ height: 'calc(100% - 170px)' }}  // Adjust height to fit input area
            >
            {messages.map((msg) => (
                <div key={msg.id} className="mb-2">
                    <p className={`text-sm ${handleColoreOfMsg(msg.role)} font-semibol`}>  {msg.name}</p>
                    <p className= {`text-sm text-white bg-gray-700 p-2 rounded-lg`} >
                        {msg.message}
                    </p>
                </div>
            ))}
            </div>

            {/* Message Input - Form at the bottom of the chat */}
            <form onSubmit={handleSendMessage} className="p-4 bg-gray-800">
            
                <div className="relative">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        rows="2"
                        className="w-full p-2 bg-gray-800 text-white border border-blue-600 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all ease-in-out duration-200 resize-none"
                        required
                        
                    ></textarea>
                    <button
                        // type="submit"
                        onClick={handleSendMessage}
                        className="absolute right-2 bottom-2 bg-blue-600 text-white font-semibold rounded-full px-2 py-2 shadow-md hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                <path d="M22 2L11 13" />
                                <path d="M22 2L15 22L11 13L2 9L22 2z" />
                            </svg>
                        </button>
                </div>
            </form>
        </div>
        </div>
  );
};

export default ChatRoom;
