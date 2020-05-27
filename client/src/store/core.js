import { createSlice } from '@reduxjs/toolkit'

export const coreSlice = createSlice({
  name: 'core',
  initialState: {
    room: null,
    me: null,
    privateKey: null,
    otherParticipant: null,
    jsEnrypt: null
  },
  reducers: {
    setRoom: (state, action) => {
      state.room = action.payload
    },
    setMe: (state, action) => {
      state.me = action.payload
    },
    setPrivateKey: (state, action) => {
      state.privateKey = action.payload
    },
    setOtherParticipant: (state, action) => {
      state.otherParticipant = action.payload
    },
    setJsEncrypt: (state, action) => {
      state.jsEncrypt = action.payload
    },
    appendChatMessage: (state, action) => {
      if (state.room && Array.isArray(state.room.messages)) {
        state.room.messages.push(action.payload)
      } else if (state.room && !state.room.messages) {
        state.room.messages = [action.payload]
      }
    }
  }
});

export const {
  setRoom,
  setMe,
  setPrivateKey,
  setOtherParticipant,
  setJsEncrypt,
  appendChatMessage
} = coreSlice.actions;

export default coreSlice.reducer;
