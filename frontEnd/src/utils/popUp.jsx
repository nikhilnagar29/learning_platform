import React from 'react';
import { createRoot } from 'react-dom/client';
import PopupMessage from '../components/PopUpMessage';

export const popUp = (message, duration = 3000) => {
  // Create a container element for the popup
  const container = document.createElement('div');
  document.body.appendChild(container);

  // Create a root for the container
  const root = createRoot(container);

  // Render the popup message
  root.render(<PopupMessage message={message} duration={duration} />);

  // Remove the popup after the specified duration
  setTimeout(() => {
    root.unmount(); // Unmount the component
    document.body.removeChild(container); // Remove the container
  }, duration + 500);
};
