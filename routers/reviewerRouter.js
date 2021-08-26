const router = require("express").Router();
const Reviewer = require("../models/reviewerModel");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ errorMessage: "Unauthorized." });
    }
    const reviewers = await Reviewer.find().populate("channel");
    res.json(reviewers);
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/create", auth, async (req, res) => {
  console.log("POSTING Reviewer");
  try {
    if (!req.user) {
      return res.status(401).json({ errorMessage: "Unauthorized." });
    }
    console.log(req.body);
    const { name, channel } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ errorMessage: "A reviewer's name is required" });
    }
    if (!channel) {
      return res
        .status(400)
        .json({ errorMessage: "A reviewer's channel is required" });
    }

    const newReviewer = new Reviewer({
      name,
      channel,
    });
    console.log("Here");
    const savedReviewer = await newReviewer.save();
    console.log("saved");

    res.json(savedReviewer);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
