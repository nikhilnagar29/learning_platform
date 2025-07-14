// Chat Component
const Chat = ({ isOpen, onClose, messages, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    
    const handleSend = () => {
      if (newMessage.trim()) {
        onSendMessage(newMessage);
        setNewMessage('');
      }
    };
    
    if (!isOpen) return null;
    
    return (
      <div className="absolute right-4 top-20 w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
        <div className="p-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold">Chat</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {messages.map((msg, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded text-sm">
              <span className="font-semibold text-blue-600">{msg.user}:</span> {msg.text}
            </div>
          ))}
        </div>
        
        <div className="p-3 border-t border-gray-200 flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-2 py-1 border border-gray-300 rounded-l text-sm"
          />
          <button
            onClick={handleSend}
            className="px-3 py-1 bg-blue-500 text-white rounded-r hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    );
  };