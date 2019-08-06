'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const INDEX = path.join(__dirname, 'index.html');

const server = express()
    .use((req, res) => res.sendFile(INDEX) )
    .listen(process.env.PORT || 5002, () => console.log(`UGC server now Listening`));

const io = socketIO(server);

io.on('connection', (socket) => {

    socket.emit('serverMessage', 'Welcome, you are now connected to chat.');

    socket.on('disconnect', () => {
        console.log(socket.userNickname + " disconnected");
        socket.broadcast.emit('serverMessage', socket.userNickname + " leave the chat.");

    });

    socket.on('join', userNickname => {
        socket.userNickname = userNickname;

        console.log(socket.userNickname + " connected");
        socket.broadcast.emit('serverMessage',socket.userNickname + " join the chat.");

    });

    socket.on('newMessage', messageContent => {

        console.log(socket.userNickname + " : " + messageContent);
        socket.broadcast.emit('userMessageSent', {message : messageContent, senderNickname : socket.userNickname});
    });
});

setInterval(() => {
    io.emit('time', new Date().toTimeString());
}, 1000);
