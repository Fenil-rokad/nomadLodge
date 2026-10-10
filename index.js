import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const port = 8080;

async function Main() {
  try {
    //Establishing a connection
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not configured.");
    }
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`DataBase connected Succesfully......`);

    app.listen(port, () => {
      console.log(`App is listening on port localhost:${port}`);
    });

  } catch (err) {
    console.error("Failed to start application:", err.message);
    process.exitCode = 1;
  }
}

Main();