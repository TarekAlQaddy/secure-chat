import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import keypair from 'keypair';
import { setPrivateKey } from '../../store/core';
import { createRoom, setError } from './CreateRoomSlice';
import './CreateRoom.scss';

function CreateRoom ({ loading, error, redirect, setPrivateKey, setError, createRoom }) {
  const [formFields, setFormFields] = useState({ roomName: '', nickname: '' });
  const { roomName, nickname } = formFields;
  if (redirect) {
    return <Redirect to={redirect} />
  }
  const handleInput = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value
    })
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomName || !nickname) {
      setError('All fields are required')
    } else {
      const generatedKeypair = keypair({ bits: 1024 });
      setPrivateKey(generatedKeypair.private);
      createRoom(roomName, nickname, generatedKeypair.public);
    }
  };
  const renderError = () => {
    const { errors } = error;
    if (typeof(error) === 'string') {
      return <p>{error}</p>
    } else if (Array.isArray(errors)) {
      return errors.map(e => <p key={`${e.param}${e.msg}`}><b>{e.param}: </b>{e.msg}</p>)
    } else if (typeof(errors) === 'object') {
      return Object.keys(errors).map((key, i) => {
        return <p key={`${key}${errors[key].message}${i}`}><b>{key}: </b>{errors[key].message}</p>
      })
    }
  };
  return (
    <section className="create-room">
      <h1>Create a Room</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="roomName"
          placeholder="Room name"
          name="roomName"
          value={roomName}
          onChange={handleInput}
        />
        <input
          type="text"
          id="nickname"
          placeholder="Nickname"
          name="nickname"
          value={nickname}
          onChange={handleInput}
        />
        <button type="submit">Create</button>
        { error && renderError() }
        { loading && <p>loading...</p> }
      </form>
    </section>
  )
}

const mapStateToProps = ({ createRoom }) => ({
  loading: createRoom.loading,
  error: createRoom.error,
  redirect: createRoom.redirect
});
const mapDispatchToProps = {
  createRoom,
  setPrivateKey,
  setError
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateRoom)
