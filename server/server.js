const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const httpErrors = require("http-errors");
const cookieParser = require("cookie-parser");
require("dotenv").config({
  path: `.env.${String(process.env.NODE_ENV).trim()}.local`,
});

const corsConfig = require("./config/corsConfig");
const db = require("./config/mongoDBConfig");
const { AuthRouter } = require("./routers");

const app = express();
app.use(cors(corsConfig));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("NNMonday ChatApp");
});
app.use("/api/auth", AuthRouter);

app.use(async (req, res, next) => {
  next(httpErrors.NotFound());
});

app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    errors: {
      status: err.status || 500,
      message: err.message || "Unknown errors",
    },
  });
});

const PORT = process.env.PORT || 9999;
const HOST = process.env.HOST || "localhost";

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

db.connectDB();
