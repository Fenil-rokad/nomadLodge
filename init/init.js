import mongoose from "mongoose";
import { data } from "./data.js";
import { Listing } from "../models/listing.js";
import dotenv from "dotenv";

dotenv.config();

async function Main() {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log(`Databse connected successfully...`);

    //clean databse
    const deletedListings = await Listing.deleteMany({});

    console.log(`Databse cleaned..`);

    //Initializing data
    const newData = await Listing.create(data);

    console.log(
      `------------------Data initialized-----------------\n ${newData}`,
    );
  } catch (err) {
    console.error(`Oops and Error => ${err}`);
  } finally {
    await mongoose.disconnect();

    console.log("MongoDB Disconnected...");
  }
}

Main();
