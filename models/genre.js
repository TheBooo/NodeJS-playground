const mongoose = require("mongoose");
const Joi = require("joi");
// mongoose schema
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    lowercase: true,
    trim: true,
  },
});
const Genre = mongoose.model("Genre", genreSchema);

// ---------------------- VALIDATE FUNCTION
const validateGenre = (genre) => {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
  };
  return Joi.validate(genre, schema);
};

exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;
