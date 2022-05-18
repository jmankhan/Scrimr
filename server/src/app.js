import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
const swaggerDocument = YAML.load('./swagger.yaml');

import {
  memberRouter,
  scrimRouter,
  searchRouter,
  summonerRouter,
  userRouter
} from './routes/index.js';

// setup routes
var app = express();

// app.use(logger('dev'));
logger.token('body', req => { return JSON.stringify(req.body) });
app.use(logger(':method :url :body'))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/member/', memberRouter);
app.use('/api/scrim/', scrimRouter);
app.use('/api/search/', searchRouter);
app.use('/api/summoner/', summonerRouter);
app.use('/api/user', userRouter);

app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  return res.status(error.statusCode).json({ error: error.toString() });
});

export default app;
