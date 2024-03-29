import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';
import enforce from 'express-sslify';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
const swaggerDocument = YAML.load('./swagger.yaml');
import createHttpError from 'http-errors';

import {
  memberRouter,
  scrimRouter,
  scrimRequestRouter,
  searchRouter,
  summonerRouter,
  teamRouter,
  userRouter,
} from './routes/index.js';

const app = express();

if (process.env.NODE_ENV !== 'dev') {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
  app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')));
}
logger.token('body', (req) => {
  return JSON.stringify(req.body);
});
app.use(logger(':method :url :body'));

const corsOptions = {
  origin: function (origin, callback) {
    const whitelist = process.env.WHITELISTED_DOMAINS?.split(',') ?? [];
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  preflightContinue: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', req.header('Origin') || 'localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/member/', memberRouter);
app.use('/api/scrim/', scrimRouter);
app.use('/api/scrimRequest', scrimRequestRouter);
app.use('/api/search/', searchRouter);
app.use('/api/summoner/', summonerRouter);
app.use('/api/team', teamRouter);
app.use('/api/user', userRouter);

app.get('*', (req, res) => {
  if (process.env.NODE_ENV === 'dev') {
    res.sendStatus(404);
  } else {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'));
  }
});

app.use((err, req, res, next) => {
  let response;
  console.log('entered error handler');
  if (err instanceof createHttpError.HttpError) {
    response = { message: err.message, status: err.status };
    if (process.env.NODE_ENV === 'dev') {
      response.stack = err.stack;
    } else {
      console.error(err.stack);
    }
  }

  if (process.env.NODE_ENV !== 'dev' && !response) {
    response = { message: 'Something went wrong', status: 500 };
  }

  if (response) {
    res.status(err.status).send({
      error: err.name,
      code: parseInt(response.status, 10),
      message: response.message,
      stack: response.stack,
    });
  } else {
    next(err);
  }
});

export default app;
