import express from 'express';
import p from '@prisma/client';

const router = express.Router();
const prisma = new p.PrismaClient();

import AuthService from '../services/auth.service.js';
import withAuth from '../middlewares/auth.js';
import SummonerService from '../services/summoner.service.js';

router.post('/', withAuth, async (req, res, next) => {
  try {
    const name = req.body.name;
    const summoner = await SummonerService.getSummonerByName(name);
    await prisma.summoner.upsert({
      where: { id: summoner.id },
      update: {
        ...summoner,
      },
      create: {
        ...summoner,
      },
    });

    res.json({
      summoner,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/:id', withAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    let summoner = await prisma.summoner.findUnique({
      where: {
        id,
      },
    });

    if (summoner) {
      res.json({
        summoner,
      });
    } else {
      summoner = await SummonerService.getSummonerByName(id);
      await prisma.summoner.create({
        data: {
          ...summoner,
        },
      });

      res.json({
        summoner,
      });
    }

    res.status(500).json({
      message: 'There was an error finding this summoner',
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post('/:id/link', withAuth, async (req, res, next) => {
  try {
    const summonerId = req.params.id;
    const token = req.headers.authorization.split('Bearer ')[1];
    const jwtUser = await AuthService.getCurrentUser(token);

    const user = await prisma.user.findUnique({
      where: {
        id: jwtUser.id,
      },
    });

    await prisma.summoner.update({
      where: {
        id: summonerId,
      },
      data: {
        userId: user.id,
      },
    });

    res.status(200).json({
      message: 'Success',
    });
  } catch (err) {
    res.status(50).json({ message: err });
  }
});

router.post('/:id/sync', withAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const summoner = SummonerService.getSummonerById(id);

    await prisma.summoner.update({
      where: {
        id,
      },
      data: {
        ...summoner,
      },
    });

    res.status(200).json({
      message: 'Success',
    });
  } catch (err) {
    res.status(50).json({ message: err });
  }
});

export default router;
