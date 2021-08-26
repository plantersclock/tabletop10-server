const router = require("express").Router();
const Rating = require("../models/ratingModel");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ errorMessage: "Unauthorized." });
    }
    const ratings = await Rating.find()
      .populate("reviewer")
      .sort("reviewer.name")
      .sort("year")
      .sort("rank");
    res.json(ratings);
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/create", auth, async (req, res) => {
  console.log("POSTING Ranking");
  try {
    if (!req.user) {
      return res.status(401).json({ errorMessage: "Unauthorized." });
    }

    const { reviewer, game, year, rank, bgAtlasId } = req.body;

    if (!reviewer) {
      return res
        .status(400)
        .json({ errorMessage: "A rating name is required" });
    }
    if (!game) {
      return res.status(400).json({ errorMessage: "A game name is required" });
    }
    if (!bgAtlasId) {
      return res
        .status(400)
        .json({ errorMessage: "A board game atlas ID is required" });
    }
    if (!year) {
      return res.status(400).json({ errorMessage: "A year is required" });
    }
    if (!rank) {
      return res.status(400).json({ errorMessage: "A rank is required" });
    }

    const newRating = new Rating({
      reviewer,
      bgAtlasId,
      game,
      year,
      rank,
    });

    const savedRating = await newRating.save();

    res.json(savedRating);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
