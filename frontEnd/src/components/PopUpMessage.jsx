import React, { useState, useEffect } from 'react';

const PopupMessage = ({ message, duration = 3000 }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!show) return null;

  return (
    <div
      className="fixed top-5 right-5 z-50 flex items-center justify-between bg-white border border-gray-300 rounded-md shadow-lg p-4 w-96 animate-slide-in-right"
    >
      <span className="text-gray-800 text-sm">{message}</span>
      <button
        className="text-gray-400 hover:text-red-500 ml-4"
        onClick={() => setShow(false)}
      >
        ×
      </button>
    </div>
  );
};

export default PopupMessage;
