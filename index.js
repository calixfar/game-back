const express = require('express');
const connectDB = require('./config/db');
const router = require('./routes');
const cors = require('cors');
const http = require("http");
const socketIo = require("socket.io");

const app = express();

connectDB();
app.use(cors());
app.use(express.json({extended: true}));
const PORT = process.env.PORT || 4000;
app.use('/',router());

const server = http.createServer(app);
const io = socketIo(server); 
// app.use('/api/usuarios', require('./routes/usuarios'));

const socketEmit = (socket) => {
    try {
        socket.emit('message', () => {data: {name: 'Al'}})
    } catch (error) {
        console.log(error)
    }
}
let interval;
io.on('connection', socket => {
    console.log('new client connect');

    if(interval) clearInterval(interval);

    interval = setInterval(() => socketEmit(socket), 1000);
    
    socket.disconnect('disconnect', () => console.log('disconnect'));
})


server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
});
// server.listen(4001, () => console.log('server http socket'));