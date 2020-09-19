const { auth, admin } = require("../middleware/auth");
const { Genre, validateGenre } = require("../models/genre");
const express = require("express");
const validate = require('../middleware/validate')
const validateObjectId = require('../middleware/validateObjectId')
const router = express.Router();

router.get("/", async (req, res, next) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID does not exist");

  res.send(genre);
});

router.post("/", [auth, validate(validateGenre)], async (req, res) => {
  let genre = new Genre({
    name: req.body.name,
  });

  genre = await genre.save();
  res.send(genre);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre)
    return res.status(404).send("The genre with the given ID does not exist");

  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID does not exist");

  res.send(genre);
});

module.exports = router;
