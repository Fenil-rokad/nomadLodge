import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const port = 8080;

async function Main(){
    try{
        //Establishing a connection
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`DataBase connected Succesfully......`);

    }catch(err){
        console.error(`There is an error: ${err}`);
    }
}

Main();

app.listen(port, () => {
    console.log(`App is listening on port localhost:${port}`);
})