const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const socketIo = require('../socket.io');
const Room = require('../models/Room');

router.get('/', async (req, res) => {
  const rooms = await Room.find();
  res.send(rooms);
});

router.post('/',async (req, res) => {
  await check('name').isString().notEmpty().run(req);
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(422).json({ errors: result.array() });
  }

  const room = new Room({
    name: req.body.name
  });
  room.save((err => {
    if (err) {
      return res.status(422).send(err);
    } else {
      const socket = socketIo.io.of(`/${req.body.name}`);
      socketIo.activeSockets[req.body.name] = socket;
      socket.on('connection', (s) => {
        console.log('new connection');
        s.on('chat_message', (m) => {
          console.log('sending chat_message', m);
          socket.emit('chat_message', m)
        })
      });
      return res.status(201).send(room);
    }
  }));
});



router.get('/:name', async (req, res) => {
  const room = await Room.findOne({ name: req.params.name });
  if (room === null) {
    return res.status(404).send('Not Found');
  }
  return res.send(room);
});

router.post('/:name/participants', async (req, res) => {
  await check('nickname').isString().notEmpty().run(req);
  await check('publicKey').isString().notEmpty().run(req);
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(422).json({ errors: result.array() });
  }

  try {
    const result = await Room.findOneAndUpdate(
      { name: req.params.name },
      { '$push': { participants: {
            nickname: req.body.nickname,
            publicKey: req.body.publicKey
          } } },
      { new: true }
    );
    if (result === null) {
      return res.status(404).send('Room Not Found');
    }
    if (result) {
      const addedParticipant = result.participants.find(p => p.publicKey === req.body.publicKey);
      socketIo.activeSockets[req.params.name].emit('add_participant', addedParticipant);
      return res.status(201).send(result);
    }
  } catch (e) {
    return res.status(400).send('Something went wrong');
  }

});

module.exports = router;
