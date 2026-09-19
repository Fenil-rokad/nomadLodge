import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Listing } from "./models/listing.js";

dotenv.config();

const app = express();

const port = 8080;

async function Main(){
    try{
        //Establishing a connection
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`DataBase connected Succesfully......`);

        const newListing = await Listing.create({
            title: "Fenil's Place",
            description: "2BK with attached washroom and connected balcony.",
            price: 2500,
            location: "Soul",
            country: "South Korea"
        })

        console.log("New Listing added");
        console.log(newListing);

    }catch(err){
        console.error(`There is an error: ${err}`);
    }
}

Main();

app.listen(port, () => {
    console.log(`App is listening on port localhost:${port}`);
})