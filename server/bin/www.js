#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../src/app.js';
import debug from 'debug';
debug('server:server');
import http from 'http';
import jwt from '../src/utils/jwt.js';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// create websocket server on top of http server
const io = new Server(server, {
  cors: {
    origin: ['https://admin.socket.io', 'http://localhost:3000'],
    credentials: true,
  },
  origins: '*',
});
io.use(async (socket, next) => {
  const cookie = socket.handshake.headers.cookie;
  if (!cookie || cookie == '' || cookie.indexOf('=') === -1) {
    return next(new Error('Unauthorized'));
  }

  const token = cookie.substring(cookie.indexOf('=') + 1);
  if (token) {
    try {
      const { payload } = await jwt.verifyAccessToken(token);
      socket.userId = payload.id;
      return next();
    } catch (err) {
      next(err);
    }
  } else {
    return next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  if (socket.userId) {
    const message = `user ${socket.userId} joined`;
    console.log('message: ' + message);
    socket.join(socket.userId);
  }

  socket.on('disconnect', () => {
    console.log('disconnect');
  });

  socket.on('error', (err) => {
    console.log(err);
    if (err && err.message === 'unauthorized event') {
      socket.disconnect();
    }
  });

  instrument(io, {
    auth: false,
  });
});
app.set('io', io);
