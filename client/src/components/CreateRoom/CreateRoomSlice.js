import { createSlice } from '@reduxjs/toolkit';
import JSEncrypt from 'jsencrypt';
import socketIo from '../../utils/socket.io';
import { setRoom, setMe, setJsEncrypt, setOtherParticipant, appendChatMessage } from '../../store/core';
import api from '../../api';

export const CreateRoomSlice = createSlice({
  name: 'createRoom',
  initialState: {
    loading: false,
    error: null,
    redirect: null
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setRedirect: (state, action) => {
      state.redirect = action.payload
    }
  }
});

export const { setLoading, setError, setRedirect } = CreateRoomSlice.actions;

export const createRoom = (roomName, nickname, publicKey) => dispatch => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  api.createRoom(roomName)
    .then(response => {
      dispatch(setRoom(response.data));
      dispatch(addParticipant(roomName, nickname, publicKey));
    })
    .catch(error => {
      handleApiError(error, dispatch);
      dispatch(setLoading(false));
    })
};

export const addParticipant = (roomName, nickname, publicKey) => dispatch => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  api.addParticipant(roomName, nickname, publicKey)
    .then(response => {
      const room = response.data;
      const socket = socketIo.io(`${process.env.REACT_APP_API_BASE}/${roomName}`);
      socket.on('chat_message', message => {
        dispatch(appendChatMessage(message))
      });
      socket.on('add_participant', message => {
        const jsEncrypt = new JSEncrypt();
        jsEncrypt.setPublicKey(message.publicKey);
        dispatch(setJsEncrypt(jsEncrypt));
        dispatch(setOtherParticipant(message));
        dispatch(appendChatMessage({
          ...message,
          type: 'addParticipant'
        }))
      });
      socketIo.activeRooms[roomName] = {
        socket
      };
      dispatch(setRoom(room));
      dispatch(setMe(room.participants.find(p => p.publicKey === publicKey)));
      dispatch(setRedirect(`/rooms/${roomName}`))
    })
    .catch(error => {
      handleApiError(error, dispatch);
    })
    .finally(() => {
      dispatch(setLoading(false));
    })
};

function handleApiError (error, dispatch) {
  if (error.response && error.response.status === 422) {
    dispatch(setError(error.response.data))
  } else {
    dispatch(setError('An error occurred while making your request'))
  }
}

export default CreateRoomSlice.reducer;
