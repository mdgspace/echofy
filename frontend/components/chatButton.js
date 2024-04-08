import React from 'react';
import { useHistory } from 'react-router-dom';

function PublicButton({path}) {
  const history = useHistory();

  const handleClick = () => {
    localStorage.setItem('chatType', path); // Store the chat type in local storage
    history.push('/login');
  };

  return <button onClick={handleClick}>Public Chat</button>;
}
