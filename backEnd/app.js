const express = require('express');
const http = require('http');
const socketIo = require('socket.io'); // node --watch app.js
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server);
const socketFn = require('./socket/socket');
socketFn(io);

const main = require('./router/main');

app.get('/', (req, res) => {
    res.send('api working');
});

app.get('/check' , (req , res) => {
    res.send('ok');
}) 

app.use('/', main);

const port = process.env.PORT || 3000;

server.listen(port, () => { console.log(`Server running on port ${port}`) } );