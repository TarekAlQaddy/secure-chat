const mongoose = require('mongoose');

const schema = mongoose.Schema({
  nickname: String,
  publicKey: String,
});

module.exports = mongoose.model("Participant", schema);
