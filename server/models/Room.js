const { Schema, model } = require("mongoose");

const roomSchema = new Schema({
  roomName: {
    type: String,
    required: true,
  },
  roomCode: {
    type: String,
    required: true,
    unique: true, // IMPORTANT
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  actualResult: {
    type: String,
    enum: ["boy", "girl", null],
    default: null,
  },
});

const Room = model("Room", roomSchema);
module.exports = Room;
