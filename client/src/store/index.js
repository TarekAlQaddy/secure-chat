import { configureStore } from '@reduxjs/toolkit';
import coreReducer from './core'
import createRoomReducer from '../components/CreateRoom/CreateRoomSlice';

export default configureStore({
  reducer: {
    core: coreReducer,
    createRoom: createRoomReducer
  },
});
