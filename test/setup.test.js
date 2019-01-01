'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app} = require('../index');
const mongoose = require('mongoose');
const testingRecipeData = require('../db/seed/testingRecipeData');
const testingUserData = require('../db/seed/testingUserData');
const Recipe = require('../models/recipes');
const User = require('../models/users');
const expect = chai.expect;
chai.use(chaiHttp);
const jwt = require('jsonwebtoken');
const { TEST_DATABASE_URL , JWT_SECRET, JWT_EXPIRY } = require('../config');

chai.use(chaiHttp);
// Set NODE_ENV to `test` to disable http layer logs
// You can do this in the command line, but this is cross-platform
process.env.NODE_ENV = 'test';

// Clear the console before each run
process.stdout.write('\x1Bc\n');

describe('What2Eat - Endpoints', function () {
  const username = 'testUser';
  const password = 'password';
  let token;
  let testUser;
  let testRecipe; 
  before(function () {
    return mongoose.connect(TEST_DATABASE_URL,{ useNewUrlParser: true })
    .then(()=>mongoose.connection.db.dropDatabase())
    .then(() => {
     return User.hashPassword(password)
      .then(digest => User.create({  
        username,
        password: digest}))        
      .then(user => {
        testUser = user;
        token = jwt.sign({user}, JWT_SECRET, {
          subject: user.username,
          expiresIn: '7d',
          algorithm: 'HS256'
        });
      })
      .then(() => {
        testingRecipeData.forEach((recipe) => {
          Recipe.create({recipeId:recipe.id,userId:testUser.id})
        })
      });
    });  
  });
    
  after(function () {
    return mongoose.disconnect();
  });

  //testing that the server is running by sending a GET request
  describe('Server running and returns all current users saved recipes', function() {
    
    it('Should return an 200', function () {
      return chai.request(app)
        .get('/api/recipes')        
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res).to.have.status(200);
        });
    });

    it('should respond with 404 when given a bad path', () => {
    return chai.request(app)
      .get('/bad/path')
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404);
      });
    });

  });

  describe('POST recipe endpoint', function() {
    it('Should return an 201', function () {
      return chai.request(app)
        .post('/api/recipes')        
        .set('Authorization', `Bearer ${token}`)
        .send({recipeId:777777,userId:testUser.id})
        .then((res) => {
          testRecipe = res.body[0];
          expect(res.body.recipeId).to.equal(777777)
          expect(res.body.userId).to.equal(testUser.id)
          expect(res).to.have.status(201);
        });        
    });
  });

  describe('DELETE recipe endpoint', function() {
    it('Should return an 204', function () {
      return chai.request(app)
        .delete('/api/recipes/1111111')        
        .set('Authorization', `Bearer ${token}`)
        .send({userId:testUser.id})
        .then((res) => {
          expect(res).to.have.status(204);
        });        
    });
  });
});

//TESTING ENDPOINTS
/*
1. RECIPES
    -Get
    -Post
    -Delete
2. USERS
    -Post
    -Get
3. AUTH
    -Post
      -'/'
      -'/refresh'
 */