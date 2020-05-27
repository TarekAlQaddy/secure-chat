import React from 'react';

function ChatMessage ({ message }) {
  const { content, participant } = message;
  return (
    <div>
      <p>{content}</p>
      <small>{participant.nickname}</small>
    </div>
  )
}

export default ChatMessage;
