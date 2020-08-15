import express from "express";
import { initializeBenevOranges } from "./server/benev-oranges";
import { createRoom } from "./scripts/room";

const app = express();
app.use(express.json());
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 3001;
const path = require("path");

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.json());
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});
app.get("/create", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});
app.get("/game/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.post("/create-new-game", function (req, res, next) {
  const roomCode = createRoom(req.body);
  res.send(roomCode);
});

initializeBenevOranges(io);

// start the app
server.listen(PORT, (error) => {
  if (error) {
    return console.log("something bad happened", error);
  }
  console.log("listening on " + PORT + "...");
});