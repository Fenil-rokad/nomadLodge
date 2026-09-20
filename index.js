import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Listing } from "./models/listing.js";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";

dotenv.config();

const app = express();

const port = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

async function Main() {
  try {
    //Establishing a connection
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`DataBase connected Succesfully......`);

    //root path
    app.get("/", (req, res) => {
      res.send("<h1>Welcome to Our page...</h1>");
    });

    //show all listings
    app.get("/listings", async (req, res) => {
      const allListings = await Listing.find();

      // console.log(allListings);
      res.render("listings/allListings", { allListings });
    });

    //new listing form
    app.get("/listings/new", (req, res) => {
      res.render("listings/new");
    });

    //create route
    app.post("/listings", async (req, res) => {
      const listing = req.body;
      const newListing = await Listing.create(listing);
      console.log(newListing);
      res.redirect("/listings");
    });

    //show route
    app.get("/listings/:id", async (req, res) => {
      const id = req.params.id;
      const listing = await Listing.findById(id);
      const price = listing.price.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      });
      res.render("listings/show", { listing, price });
    });

    //edit form route
    app.get("/listings/:id/edit", async (req, res) => {
      const id = req.params.id;
      const listing = await Listing.findById(id);
      res.render(`listings/edit`, { listing });
    });

    //update route
    app.put("/listings/:id", async (req, res) => {
      const id = req.params.id;
      const listing = req.body;
      const updatedListing = await Listing.findByIdAndUpdate(id, listing, {
        new: true,
      });
      console.log(updatedListing);
      res.redirect(`/listings/${id}`);
    });

    //delete route
    app.delete("/listings/:id", async (req, res) => {
      const id = req.params.id;
      const deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);  
      res.redirect(`/listings`);
    });

  } catch (err) {
    console.error(`There is an error: ${err}`);
  }
}

Main();

app.listen(port, () => {
  console.log(`App is listening on port localhost:${port}`);
});
