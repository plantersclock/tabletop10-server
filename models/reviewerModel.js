const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  channel: { type: ObjectId, ref: "channel", required: true },
});

module.exports = mongoose.model("reviewer", reviewerSchema);
