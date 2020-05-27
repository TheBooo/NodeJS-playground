const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const { movieSchema } = require("./movie");
const { customerSchema } = require("./customer");

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 3,
          maxlength: 255,
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255,
        },
      }),
      required: true,
    },
    customer: {
      type: customerSchema,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    days: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    totalPrice: {
      type: Number,
      min: 0,
      max: 255,
    },
  })
);

const validateRental = (rental) => {
  const schema = {
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required(),
    days: Joi.number().min(0).max(255).required(),
  };
  return Joi.validate(rental, schema);
};

exports.Rental = Rental;
exports.validate = validateRental;
