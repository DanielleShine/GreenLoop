const express = require("express");
const app = express();
// const cors = require("cors");
const prodOrigin = [process.env.ORIGIN_1, process.env.ORIGIN_2];
const devOrigin = ["http://localhost:5173"];
const allowedOrigins =
  process.env.NODE_ENV === "production" ? prodOrigin : devOrigin;

console.log("allowedOrigins: ", allowedOrigins)

app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  const origin = req.headers.origin;
  console.log("origin: ", origin)
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
});

const dotenv = require("dotenv");
dotenv.config();

// Connect DB
require("./db/connection");

app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(express.urlencoded({ extended: false }));

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (allowedOrigins.includes(origin)) {
//         console.log(origin, allowedOrigins);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );

const port = process.env.PORT || 8000;

require("./controllers/socket");

app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/user"));
app.use("/api", require("./routes/waste"));
app.use("/api", require("./routes/conversation"));
app.use("/api", require("./routes/message"));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});
