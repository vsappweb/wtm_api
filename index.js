const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const countryRoute = require("./routes/countries");
const cityRoute = require("./routes/cities");
const regionRoute = require("./routes/regions");
const mapRoute = require("./routes/maps");
const placeRoute = require("./routes/places");
const groupRoute = require("./routes/groups");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    // cb(null, file.originalname);
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.any("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully.");
  } catch (err) {
    console.log(err);
  }
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/countries", countryRoute);
app.use("/api/cities", cityRoute);
app.use("/api/regions", regionRoute);
app.use("/api/maps", mapRoute);
app.use("/api/places", placeRoute);
app.use("/api/groups", groupRoute);

app.get("", (req, res) => {
  res.send("Backend server is running!!!");
});

app.listen(8800, () => {
  console.log("Backend server is running!!!");
});
