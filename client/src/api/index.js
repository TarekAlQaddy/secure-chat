import axios from 'axios';
axios.defaults.baseURL = process.env.REACT_APP_API_BASE;

export const createRoom = (name) => {
  return axios.post('/rooms', { name })
};

export const addParticipant = (roomName, nickname, publicKey) => {
  return axios.post(`/rooms/${roomName}/participants`, { nickname, publicKey })
};

export default {
  createRoom,
  addParticipant
}
