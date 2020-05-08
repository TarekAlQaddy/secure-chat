const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  participants: [],
});
schema.plugin(uniqueValidator);

module.exports = mongoose.model("Room", schema);
