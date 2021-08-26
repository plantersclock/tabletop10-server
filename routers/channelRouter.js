const router = require("express").Router();
const Channel = require("../models/channelModel");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const channels = await Channel.find();

    res.json(channels);
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/create", auth, async (req, res) => {
  console.log("POSTING CHANNEL");
  try {
    if (!req.user) {
      return res.status(401).json({ errorMessage: "Unauthorized." });
    }
    console.log(req.body);
    const { name, url } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ errorMessage: "A channel name is required" });
    }
    if (!url) {
      return res
        .status(400)
        .json({ errorMessage: "A channel url is required" });
    }

    const newChannel = new Channel({
      name,
      url,
    });

    const savedChannel = await newChannel.save();

    res.json(savedChannel);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
