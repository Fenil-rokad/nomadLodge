import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Listing } from "./models/listing.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const port = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

async function Main(){
    try{
        //Establishing a connection
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`DataBase connected Succesfully......`);

        //root path
        app.get("/", (req, res) => {
            res.send("<h1>Welcome to Our page...</h1>")
        });

        //show all listings
        app.get("/listings", async (req, res) => {
            const allListings = await Listing.find();

            // console.log(allListings);
            res.render("allListings", {allListings});
        });

    }catch(err){
        console.error(`There is an error: ${err}`);
    }
}

Main();

app.listen(port, () => {
    console.log(`App is listening on port localhost:${port}`);
})