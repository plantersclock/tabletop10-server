const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  url: { type: String, required: false },
});

module.exports = mongoose.model("channel", channelSchema);
