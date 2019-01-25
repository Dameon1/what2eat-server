"use strict";

const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema(
  {
    recipeId: Number,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

recipeSchema.set("toObject", {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model("Recipe", recipeSchema);
