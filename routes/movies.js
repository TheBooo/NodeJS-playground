const express = require("express");
const router = express.Router();
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/auth");

//get all
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort("name");
    res.send(movies);
  } catch (err) {
    console.log(err.message);
    res.send(`error - ${err.message}`);
  }
});
//get single
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.send(movie);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(`there is no movie with this id`);
  }
});
//add new
router.post("/", auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //get genre
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre");

    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });
    await movie.save();
    res.send(movie);
  } catch (err) {
    console.log(err.message);
    res.send(`error - ${err.message}`);
  }
});
//edit movie
router.put("/:id", auth, async (req, res) => {
  try {
    //validate edit
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genreId: req.body.genreId,
        dailyRentalRate: req.body.dailyRentalRate,
        numberInStock: req.body.numberInStock,
      },
      { new: true }
    );
    res.send(movie);
  } catch (err) {
    console.log(err.message);
    res.send(`error - ${err.message}`);
  }
});
//delete movie
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    res.send(movie);
  } catch (err) {
    console.log(err.message);
    res.send(`error - ${err.message}`);
  }
});

module.exports = router;
