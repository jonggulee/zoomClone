import http from "http";
import WebSocket from "ws"; //! 추가
import express from "express";

const app = express(); 

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req,res) => res.render("home"));
const handleListen = () => console.log("✅ server starts!", __dirname);

const server = http.createServer(app); //! 이건 기본 http 서버
const wss = new WebSocket.Server({server}); //! 이건 ws 서버\

const sockets = [];
wss.on("connection", (socket) => {
    console.log ("Connected to Browser 👻");
    socket.on("close", () => console.log("Disconnected from the Browser ❌"));
    socket["nickname"] = "Anon";
    sockets.push(socket);
    socket.on("message", (msg) => {
        // console.log(msg.toString());
    //     // sockets.forEach((aSocket) => aSocket.send(message.toString()));   
    const message = JSON.parse(msg);    
        switch (message.type) {
          case "new_message":
            sockets.forEach((aSocket) =>
              aSocket.send(`${socket.nickname}: ${message.payload}`)
            );
          case "nickname":
            socket["nickname"] = message.payload;
          };
    })
});
server.listen(3000, handleListen);  