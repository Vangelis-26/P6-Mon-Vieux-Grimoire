require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur de connexion à MongoDB", err));

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use(express.json());

app.use("/api/book", bookRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
