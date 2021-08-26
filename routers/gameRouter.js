const router = require("express").Router();
const axios = require("axios");

const auth = require("../middleware/auth");

const searchBGAtlas = async (name) => {
  return axios.get(
    `https://api.boardgameatlas.com/api/search?name=${name}&client_id=${process.env.BG_ATLAS_CLIENT_ID}`
  );
};

const getBGAtlasGame = async (gameId) => {
  return axios.get(
    `https://api.boardgameatlas.com/api/search?ids=${gameId}&client_id=${process.env.BG_ATLAS_CLIENT_ID}`
  );
};

router.get("/search", auth, async (req, res) => {
  try {
    let name = req.query.name;

    if (!name) {
      return res.status(400).json({ errorMessage: "No Game Name Given" });
    }
    const searchResponse = await searchBGAtlas(name);

    res.json({ data: searchResponse.data });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/", auth, async (req, res) => {
  try {
    let gameId = req.query.gameId;

    if (!gameId) {
      return res.status(400).json({ errorMessage: "No Game ID Given" });
    }
    const gameResponse = await getBGAtlasGame(gameId);

    res.json({ data: gameResponse.data });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
