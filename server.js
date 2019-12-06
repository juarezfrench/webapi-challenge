const express = require('express');
const helmet = require('helmet');
// const cors = require('cors');

const projectRouter = require('./routers/projectRouter');
const actionRouter = require('./routers/actionRouter');

const server = express();

server.use(logger);
server.use(helmet());
server.use(express.json());
// server.use(cors());

server.use('/api/projects', projectRouter);
server.use('/api/actions', actionRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Hello world from Express and Node.js Sprint Challenge!</h2>`);
});

// Custom Middleware
function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);

  next();
}

module.exports = server;