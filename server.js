const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { createServer } = require("http"); // you can use https as well
const socketIo = require("socket.io");
const server = createServer(app);
const cors = require("cors");
const io = socketIo(server, {
  cors: { origin: "*" },
  Credential: false,
}); // you can change the cors to your own domain

const apiRoutes = express.Router();

const { socket } = require("./sockets/socket");
socket(io);

//BODY-PARSER
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROUTES
// const chatRoutes = require("./api/routes/chat");
// const userRoutes = require("./api/routes/users");
// const scriptRoutes = require("./api/routes/scripts");
//DB Connect
const connection = require("./config/connection.js");
connection();

apiRoutes.use(cors());

// apiRoutes.use("/scripts", scriptRoutes);

app.use("/api", apiRoutes);

const port = process.env.PORT;

server.listen(port, () => {
  console.log("🚀 Server listening to port:", port);
});
