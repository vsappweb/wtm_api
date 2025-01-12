const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const ws = require("ws");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const countryRoute = require("./routes/countries");
const cityRoute = require("./routes/cities");
const regionRoute = require("./routes/regions");
const mapRoute = require("./routes/maps");
const placeRoute = require("./routes/places");
const groupRoute = require("./routes/groups");
const deleteImg = require("./routes/deleteImg");
const uploadImg = require("./routes/uploadImg");
const favoriteRoute = require("./routes/favorites");

const fs = require("fs");
const util = require("util");
const path = require("path");
const cors = require("cors");
const port = process.env.PORT || 8800;
const ws_port = process.env.WS_PORT || 8900;
const cors_env = process.env.REACT_APP_ORIGIN;

dotenv.config();

// mongoose.connect(process.env.MONGO_URL)
try {
  mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to MongoDB!");
} catch (error) {
  console.error("Failed to connect to MongoDB:", error);
}

app.use("/images", express.static(path.join(__dirname, "public/images")));

// middleware
app.use(cors());
app.use(express.json());
// app.use(helmet());
app.use(morgan("common"));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// app.get("/users", (req,res)=>{
//     res.send("Welcome to user page!")
// });

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/countries", countryRoute);
app.use("/api/v1/cities", cityRoute);
app.use("/api/v1/regions", regionRoute);
app.use("/api/v1/maps", mapRoute);
app.use("/api/v1/places", placeRoute);
app.use("/api/v1/groups", groupRoute);
app.use("/api/v1/deleteImg", deleteImg);
app.use("/api/v1/uploadImg", uploadImg);
app.use("/api/v1/favorites", favoriteRoute);

app.get("", (req, res) => {
  res.send(`Welcome to WTM ${process.env.NODE_ENV_LOG} server!!!`);
  console.log(`Welcome to WTM ${process.env.NODE_ENV_LOG} server!!!`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}!!!`);
});

if (process.env.NODE_ENV_LOG === "production") {
  console.log("production");
} else {
  console.log("development");
  try {
    const log_file = fs.createWriteStream(__dirname + "/debug.log", {
      flags: "w",
    });
    const log_stdout = process.stdout;

    console.log = function (...args) {
      const output = args.join(" ");
      if (log_file && log_stdout) {
        log_file.write(util.format(output) + "\r\n");
        log_stdout.write(util.format(output) + "\r\n");
      }
    };
  } catch (err) {
    console.error("Error in setting up logging:", err);
  }
}

const wss = new ws.Server(
  {
    port: ws_port,
    cors: { origin: "*" },
  },
  () => {
    if (wss) {
      console.log(`WebSocket Server is running  on port ${ws_port}`);
    } else {
      console.error("Error creating WebSocket Server");
    }
  }
);

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (message) => {
    console.log("Received message:", message);
    message = JSON.parse(message);
    switch (message.event) {
      case "message":
        broadcastMessage(message);
        break;
      case "connection":
        broadcastMessage(message);
        break;
      case "disconnect":
        broadcastMessage(message);
        break;
      default:
        console.log("Invalid event type:", message.event);
        break;
    }
  });
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

function broadcastMessage(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === ws.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}
