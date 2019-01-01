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
    return mongoose.connect(TEST_DATABASE_URL,);
  });
  
  beforeEach(function () {
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
        Recipe.insertMany([{    
          "recipeId": "1111111",
          "userId":testUser.id
        },
        {    
          "recipeId": "222222",
          "userId":testUser.id
        },
        {    
          "recipeId": "3333333",
          "userId":testUser.id
        }])
      });
  });  

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });
  
  after(function () {
    return mongoose.disconnect();
  });

  //testing that the server is running by sending a GET request
  describe('Server running', function() {
    it('Should return an 200', function () {
      return chai.request(app)
        .get('/api/recipes')        
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res).to.have.status(200);
        });
    });
  });
  // describe('Server running', function() {
  //   it('Should return an 200', function () {
  //     return chai.request(app)
  //       .get('/api/recipes/')        
  //       .set('Authorization', `Bearer ${token}`)
  //       .then((res) => {
  //         testRecipe = res.body[0];
  //         console.log("body",testRecipe.id)
  //         expect(res).to.have.status(200);
  //       })
  //       .then(() => {
  //         //console.log(testRecipe)
  //         return chai.request(app)
  //         .delete(`/api/recipes/${testRecipe.id}`)        
  //         .set('Authorization', `Bearer ${token}`);
  //       })
  //       .then((res) => {
  //         //console.log("body",testRecipe.id)
  //         expect(res).to.have.status(204);
        
  //       });
  //   });
  // });
});

