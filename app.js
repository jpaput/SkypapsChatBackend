'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
    .use((req, res) => res.sendFile(INDEX) )
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected')
    });

    socket.on('join', userNickname => {

        console.log(userNickname +" : has joined the chat "  )
        socket.broadcast.emit('userjoinedthechat',userNickname +" : has joined the chat ")

    });

    socket.on('chat message', msg => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

setInterval(() => {
    io.emit('time', new Date().toTimeString())
}, 1000);
