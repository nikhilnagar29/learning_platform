import { Pencil, Circle, Square, Type, Highlighter, Eraser, Undo, Redo, Trash2, Download, Users, MessageCircle } from "lucide-react";

// Toolbar Component
const Toolbar = ({ 
    tool, 
    setTool, 
    color, 
    setColor, 
    elements, 
    setElements, 
    history, 
    setHistory, 
    historyIndex, 
    setHistoryIndex,
    onClear,
    onSave
  }) => {
    const tools = [
      { id: 'pen', icon: Pencil, label: 'Pen' },
      { id: 'pencil', icon: Pencil, label: 'Pencil' },
      { id: 'highlighter', icon: Highlighter, label: 'Highlighter' },
      { id: 'eraser', icon: Eraser, label: 'Eraser' },
      { id: 'rectangle', icon: Square, label: 'Rectangle' },
      { id: 'circle', icon: Circle, label: 'Circle' },
      { id: 'text', icon: Type, label: 'Text' },
    ];
    
    const handleUndo = () => {
      if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        setElements(history[historyIndex - 1] || []);
      }
    };
    
    const handleRedo = () => {
      if (historyIndex < history.length - 1) {
        setHistoryIndex(historyIndex + 1);
        setElements(history[historyIndex + 1] || []);
      }
    };
    
    const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'];
    
    return (
      <div className="bg-white border-b border-gray-300 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          {tools.map((toolItem) => (
            <button
              key={toolItem.id}
              onClick={() => setTool(toolItem.id)}
              className={`p-2 rounded-lg transition-colors ${
                tool === toolItem.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={toolItem.label}
            >
              <toolItem.icon size={20} />
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {colors.map((colorOption) => (
              <button
                key={colorOption}
                onClick={() => setColor(colorOption)}
                className={`w-8 h-8 rounded-full border-2 ${
                  color === colorOption ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: colorOption }}
              />
            ))}
          </div>
          
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo size={20} />
          </button>
          
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo size={20} />
          </button>
          
          <button
            onClick={onClear}
            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
            title="Clear Canvas"
          >
            <Trash2 size={20} />
          </button>
          
          <button
            onClick={onSave}
            className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700"
            title="Save Canvas"
          >
            <Download size={20} />
          </button>
        </div>
      </div>
    );
  };

  export default Toolbar ;