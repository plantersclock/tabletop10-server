const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ratingSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  reviewer: { type: ObjectId, ref: "reviewer", required: true },
  bgAtlasId: { type: String, required: true },
  game: { type: String, required: true },
  rank: { type: Number, required: true },
});

module.exports = mongoose.model("rating", ratingSchema);
