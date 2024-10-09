import { Server } from "socket.io";
import cors from "cors";

const socketconnection=(server)=>{
      
    const io = new Server(server, {
        cors: {
          origin: "http://localhost:5173",
          methods: ["GET", "POST"],
          allowedHeaders: ["Content-Type"],
          credentials: true,
        },
      });

      io.on("connection", (socket) => {
        console.log("A user is connected: ", socket.id);
      })
}

export {socketconnection}