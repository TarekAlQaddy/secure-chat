import React, { useState }  from 'react';
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux';
import socketIo from '../../utils/socket.io';
import ChatMessage from './ChatMessage';
import './Room.scss'

function Room ({ room, me, jsEncrypt, otherParticipant }) {
  const [messageInput, setMessageInput] = useState('');
  const { roomName } = useParams();
  const getMessages = () =>{
    if (Array.isArray(room?.messages)) {
      return (
        room.messages.map(message => <ChatMessage message={message} />)
      )
    }
  };
  const handleSend = (e) => {
    e.stopPropagation();
    if (!otherParticipant) {} // TODO: show error popup
    if (messageInput && jsEncrypt) {
      const message = {
        content: jsEncrypt.encrypt(messageInput),
        participant: me,
        type: 'chatMessage'
      };
      socketIo.activeRooms[roomName].socket.emit('chat_message', message)
    }
  };
  return (
    <div className="room">
      <div className="chat-wrapper">
        This is the beginning of your chat in { roomName }
        { getMessages() }
      </div>
      <div className="input-wrapper">
        <input
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
          placeholder="Enter your message here"
        />
        <button onClick={handleSend} disabled={!messageInput}>Send</button>
      </div>
    </div>
  )
}

const mapStateToProps = ({ core }) => ({
  room: core.room,
  me: core.me,
  otherParticipant: core.otherParticipant,
  jsEncrypt: core.jsEncrypt
});

export default connect(mapStateToProps)(Room);
