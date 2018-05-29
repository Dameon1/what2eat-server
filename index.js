'use strict';


const scratch = require('./scratch/scratch');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
let mongoose = require('mongoose');
//const Cheese = require('./models/cheeses');
const { PORT, CLIENT_ORIGIN ,MONGODB_URI} = require('./config');
const { dbConnect } = require('./db-mongoose');







app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);




app.get('/', ( req, res, next) => {
  res.json(scratch);
});






function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
'use strict';



app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', { skip: (req, res) => process.env.NODE_ENV === 'test' }));
app.use(cors({ origin: CLIENT_ORIGIN }));

app.get('/api/cheeses',(req,res,next) => {
  res.json(cheeses);
}); 

app.get('/api/cheeses/:id', (req, res, next) => {
  let {id} = req.params;
  console.log(id);
  Cheese.findOne({_id:id})  
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});
app.get('/', ( req, res, next) => {
  Cheese.find()
    .then(results => {
      res.json(results);
    })
    .catch(next);
});

app.post('/',(req,res,next) => {
  let {title} = req.body;
  Cheese.create({title})
    .then(results => {
     
      res.status(201).json(results);
    }).catch(next);
} );

app.delete('/cheese/:id',(req,res,next) => {
  let {id} = req.params;
  
  Cheese.findOneAndRemove({_id:id})
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
});


function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

// if (require.main === module) {
//   dbConnect();
//   runServer();
// }
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