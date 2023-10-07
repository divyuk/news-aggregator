const mongoose = require("mongoose");

const favouriteSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  newsArticle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
    required: true,
  },
});

module.exports = mongoose.model("Favourite", favouriteSchema);
