// requiring the mongoose module
const mongoose = require("mongoose");
// requiring the dotenv module
const dotenv = require("dotenv");

// every uncaught exception is goint to emit an event
// that is going to be caught by this listener
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1); // shutting down the node process
});

dotenv.config({ path: "./config.env" }); // accessing the config.env file globally

// requiring the app module
const app = require("./app");

// Replacing the database password string (<PASSWORD>)
// in the db string
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// Connecting the app to the database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!")); // if the db connected successfully

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// every unhandled rejection is goint to emit an event
// that is going to be caught by this listener
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  // Stop getting requests
  server.close(() => {
    // Shutting down the server
    process.exit(1);
  });
});
