const { Schema, model } = require("mongoose");

const voteSchema = new Schema({
  voterName: {
    type: String,
    required: true,
  },

  guess: {
    type: String,
    enum: ["boy", "girl"],
    required: true,
  },
  reason: {
    type: String,
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: "Room",
  },
});

const Vote = model("Vote", voteSchema);

module.exports = Vote;
