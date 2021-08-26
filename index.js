const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

// set up express

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://tabletop10.netlify.app",
      "https://tabletop10.com",
      "https://www.tabletop10.com",
    ],
    credentials: true,
  })
);
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));

app.get("/test", (req, res) => {
  res.status(200).json({ message: "The backend is working" });
});

// set up mongoose
// connect to mongoDB

mongoose.connect(
  process.env.MDB_CONNECT_STRING,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("Connected to MongoDB");
  }
);

// set up routes

app.use("/auth", require("./routers/userRouter"));
app.use("/channel", require("./routers/channelRouter"));
app.use("/reviewer", require("./routers/reviewerRouter"));
app.use("/rating", require("./routers/ratingRouter"));
app.use("/game", require("./routers/gameRouter"));
