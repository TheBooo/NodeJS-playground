const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const validateObjectId = require("../middleware/validateObjectId");
//

// ------------------------ GET all genres ----------------
router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    //throw new Error("fucked up, not working");
    const genres = await Genre.find().sort("name");
    res.send(genres);
  })
);
//get single
router.get(
  "/:id",
  validateObjectId,
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("No genre with given id");
    res.send(genre);
  })
);
// ----------------------- ADD genres ----------------
router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    //check errors with Joi
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //create genre and add to mongdb
    let genre = new Genre({
      name: req.body.name,
    });
    genre = await genre.save();
    res.send(genre);
  })
);
// ------------------------ EDIT genre -------------------
router.put(
  "/:id",
  auth,
  validateObjectId,
  asyncMiddleware(async (req, res) => {
    //validate edit
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //update course
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true } //return updated genre
    );
    res.send(genre);
    console.log(err);
    res.status(400).send("There is no genre with this id");
  })
);
// -------------------------- DELETE genre -----------------
router.delete(
  "/:id",
  [auth, admin],
  validateObjectId,
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    res.send(genre);
  })
);

module.exports = router;
