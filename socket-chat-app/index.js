import http from "node:http";
import { Server } from "socket.io";
import "dotenv/config";
import path from "path";
import express from "express";

// IO server created
async function main(){
    const app = express();
    app.use(express.static(path.resolve("./public")))

    const server = http.createServer(app);
    const io = new Server();

    io.attach(server);

    io.on('connection', (socket) => {
        console.log(`A new socket has connected`, socket.id);

        socket.on("user:message", (data) => {
            console.log("Message from socket", data);
            socket.broadcast.emit('server:message', data);
        });

        socket.on('user:typing', (data) => {
            console.log("User is typing", socket.id, data);
            socket.broadcast.emit('server:user:typing', {id: socket.id});
        });
    });

    

    const port = process.env.PORT;
    server.listen(port, () => {
        console.log(`Http server is running on PORT http://localhost:${port}`);
    });
}

main();