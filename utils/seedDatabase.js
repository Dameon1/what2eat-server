"use strict";

const mongoose = require("mongoose");
const { MONGODB_URI } = require("../config");
const Recipe = require("../models/recipes");
const User = require("../models/users");

let seedRecipes = require("../scratch/recipeIds.json");
let seedUsers = require("../scratch/users.json");

mongoose
  .connect(MONGODB_URI)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Recipe.insertMany(seedRecipes),
      Recipe.createIndexes(),
      User.insertMany(seedUsers),
      User.createIndexes()
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });
