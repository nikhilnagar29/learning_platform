import ReactDOM from 'react-dom';
import React from 'react';
import PopupMessage from '../components/PopUpMessage';

export const popUp = (message, duration = 3000) => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  ReactDOM.render(
    <PopupMessage message={message} duration={duration} />,
    container
  );

  setTimeout(() => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
  }, duration + 500);
};
