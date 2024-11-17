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
const deleteImg = require("./routes/deleteImg");
const uploadImg = require("./routes/uploadImg");

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

app.get("", (req, res) => {
  res.send("WTM server is running!!!");
});

app.listen(8800, () => {
  console.log("Backend server is running!!!");
});
