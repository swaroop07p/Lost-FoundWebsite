const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  itemName: String,
  description: String,
  category: String,
  location: String,
  contactInfo: String,

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  claimed: {
    type: Boolean,
    default: false
  },

  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  claimedAt: {
    type: Date,
    default: null
  }
});


module.exports = mongoose.model("Item", ItemSchema);
