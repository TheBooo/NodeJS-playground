const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { Customer, validate } = require("../models/customer");
//get all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().sort("name");
    res.send(customers);
  } catch (err) {
    console.log(err.message);
  }
});
//get single customer
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.send(customer);
  } catch (err) {
    console.log(err.message);
    res.status(404).send("Customer not found");
  }
});
// add customer
router.post("/", auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    });
    await customer.save();
    res.send(customer);
  } catch (err) {
    console.log(err.message);
    res.send(`something went wrong - ${err.message}`);
  }
});
//update customer
router.put("/:id", auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
      },
      { new: true }
    );
    res.send(customer);
  } catch (err) {
    console.log(err.message);
    res.send(`error occurred - ${err.message}`);
  }
});
//delete customer
router.delete("/:id", auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    res.send(customer);
  } catch (err) {
    console.log(err.message);
    res.send(`error occurred - ${err.message}`);
  }
});

module.exports = router;
