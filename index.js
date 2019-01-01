'use strict';

require('dotenv').config();
const express = require('express');

const cors = require('cors');
const morgan = require('morgan');
let mongoose = require('mongoose');
const passport = require('passport');
const app = express();

const { PORT, CLIENT_ORIGIN ,MONGODB_URI} = require('./config');
const {router: usersRouter} = require('./routes/users');
const {router: authRouter} = require('./routes/auth');
const {router: recipeRouter} = require('./routes/recipes');
const jwtStrategy = require('./passport/jwt');

//testing--remove when done
// app.get('/', (req,res) => {
//   res.json([{"working":"working"}])
// })

passport.use(jwtStrategy);

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', { skip: (req, res) => process.env.NODE_ENV === 'test' }));
app.use(cors({ origin: CLIENT_ORIGIN }));


app.use('/api/users', usersRouter);
app.use('/api/login', authRouter);
app.use('/api/recipes', recipeRouter);


if (require.main === module) {
  mongoose.connect(MONGODB_URI)
    .then(instance => {
      const conn = instance.connections[0];
      console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error('\n === Did you remember to start `mongod`? === \n');
      console.error(err);
    });

  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}
module.exports = { app };
