const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
//const Fawn = require("fawn");
const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const auth = require("../middleware/auth");

//Fawn.init(mongoose);

//get all rentals
router.get("/", async (req, res) => {
  try {
    const rentals = await Rental.find().sort("-date");
    res.send(rentals);
  } catch (error) {
    console.log(error.message);
    res.send(`error - ${error.message}`);
  }
});
//get single
router.get("/:id", async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    res.send(rental);
  } catch (error) {
    console.log(error.message);
    res.send(`error - ${error.message}`);
  }
});
//add rental
router.post("/", auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Invalid movie");

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid customer");

    if (movie.numberInStock === 0) return res.send("Movie out of stock");

    const rental = new Rental({
      movie: movie,
      customer: customer,
      days: req.body.days,
      totalPrice: movie.dailyRentalRate * req.body.days,
    });
    //two phase commit with Fawn
    /*new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: {
            numberInStock: -1,
          },
        }
      )
      .run();*/
    // SAVE BOTH RENTAL AND MOVIE - 1 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    res.send(rental);
  } catch (error) {
    console.log(error.message);
    res.send(`error - ${error.message}`);
  }
});

//
module.exports = router;
