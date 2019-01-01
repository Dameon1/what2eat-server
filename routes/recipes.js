'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Recipe = require('../models/recipes');
const passport = require('passport');

//protecting the endpoints/////////////////////////////////////////////////////////
router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));
///////////////////////////////////////////////////////////////////////////////////
router.get('/', (req, res, next) => {
  const userId = req.user.id;
  Recipe.find()
    .where({userId})
    .sort({ 'updatedAt': 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});
/////////////////////////////////////////////////////////////////////////////////////
router.post('/', (req, res, next) => {
  const { recipeId } = req.body;
  const userId = req.user.id;
  if (!recipeId ) {
    const err = new Error('Missing `recipe` in request body');
    err.status = 400;
    return next(err);
  }
  Recipe.create({ recipeId, userId })
    .then(result => {
      res
        .location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      next(err);
    });
});
///////////////////////////////////////////////////////////////////////////////////
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  Recipe.findOneAndRemove({recipeId:id,userId})
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = { router };