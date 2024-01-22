const http = require('http')
const express = require('express')
const cors = require('cors')
const socketIO = require('socket.io')
const users = [{}];
const app = express()
const port = 3000
app.use(cors())

app.get("/", (req,res) => {
    res.send("Its working party")
})

const server = http.createServer(app)
const io = socketIO(server);

io.on("connection", (socket) => { 

    console.log("new Connection");

    socket.on('joined', ({ user }) => {
        users[socket.id] = user
        console.log(`${user} has joined the group`);
        socket.broadcast.emit('userJoined', {user: "Admin",message: `${users[socket.id]} has Joined`})
        socket.emit('welcome', {user: "Admin", message: `Welcome to the Chat, ${users[socket.id]}`})
    })

    socket.on('message', ({message,id}) => {
        io.emit('sendMessage', {user: users[id], message, id})
    })

    socket.on('disconnect', () => {
        console.log(`${users[socket.id]} has left`);
        socket.broadcast.emit('userLeft', { user: "Admin", message: `${users[socket.id]} has left` });
        delete users[socket.id];
    });
})

server.listen(port, ()=> {
    console.log(`Server is running on port http://localhost:${port}`);
})

