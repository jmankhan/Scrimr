import express from 'express';
const router = express.Router();

import prisma from '../utils/prisma.js';
import { AuthService, queryUser, SummonerService } from '../services/index.js';
import withAuth from '../middlewares/auth.js';
import createHttpError from 'http-errors';

router.post('/', withAuth, async (req, res, next) => {
  const name = req.body.name;

  if (!name) {
    next(new createHttpError.BadRequest('name is required'));
  }

  const summoner = await SummonerService.getSummonerByName(name).catch(next);
  await prisma.summoner
    .upsert({
      where: { id: summoner.id },
      update: {
        ...summoner,
      },
      create: {
        ...summoner,
      },
    })
    .catch(next);

  res.status(200).json({ summoner });
});

router.get('/:id', withAuth, async (req, res, next) => {
  const id = req.params.id;
  let summoner = await prisma.summoner
    .findUnique({
      where: {
        id,
      },
    })
    .catch(next);

  if (!summoner) {
    summoner = await SummonerService.getSummonerByName(id);
    await prisma.summoner
      .create({
        data: {
          ...summoner,
        },
      })
      .catch(next);

    res.status(200).json({ summoner });
  }
});

router.post('/:id/link', withAuth, async (req, res, next) => {
  const summonerId = req.params.id;
  const userId = req.userId;

  const user = await queryUser(userId).catch(next);

  await prisma.summoner
    .update({
      where: {
        id: summonerId,
      },
      data: {
        userId: user.id,
      },
    })
    .catch(next);

  res.sendStatus(200);
});

router.post('/:id/sync', withAuth, async (req, res, next) => {
  const summonerId = req.params.id;
  console.log('about to update summoner: ' + summonerId);
  const summoner = await SummonerService.getSummonerById(summonerId);

  console.log('updated summoner: ' + summoner);
  await prisma.summoner
    .update({
      where: {
        id: summonerId,
      },
      data: {
        ...summoner,
      },
    })
    .catch(next);
  res.sendStatus(200);
});

export default router;
