import express from 'express';
import { checkSchema, validationResult } from 'express-validator';
import p from '@prisma/client';

const router = express.Router();
const prisma = new p.PrismaClient();

import withAuth from '../middlewares/auth.js';
import SummonerService from '../services/summoner.service.js';
import { validateHost } from '../utils/validators.js';

router.get('/', async (req, res, next) => {
  const records = await prisma.member.findMany();
  res.json({
    members: records,
  });
});

router.post('/', withAuth, async (req, res, next) => {
  try {
    const { summonerId, scrimId } = req.body;
    const safeSummonerId = decodeURI(summonerId);
    let summoner = await prisma.summoner.findUnique({
      where: {
        id: safeSummonerId,
      },
    });

    if (!summoner) {
      try {
        const summonerResponse = await SummonerService.getSummonerByName(safeSummonerId);
        summoner = await prisma.summoner.create({
          data: {
            ...summonerResponse,
          },
        });
      } catch (err) {
        return next(err);
      }
    }

    const memberExists = await prisma.member.findFirst({
      where: {
        AND: [
          {
            summonerId: {
              equals: safeSummonerId,
            },
          },
          {
            scrimId: {
              equals: scrimId,
            },
          },
        ],
      },
    });

    if (memberExists) {
      return next(new Error('This member is already in the pool'));
    }

    const member = await prisma.member
      .create({
        data: {
          summonerId: summoner.id,
          scrimId,
        },
      })
      .catch(next);

    res.json({
      member,
    });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});

router.get('/:id', withAuth, async (req, res, next) => {
  try {
    const member = await prisma.member.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        summoner: true,
        team: true,
        scrim: true,
      },
    });

    if (member) {
      res.status(200).json({
        member,
      });
    } else {
      res.status(404).json({
        message: 'Member not found',
      });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.delete('/:id', withAuth, async (req, res, next) => {
  try {
    await prisma.member.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.status(200).json({
      message: 'Success',
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put('/:id', withAuth, async (req, res, next) => {
  try {
    await prisma.member.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        ...req.body,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

export default router;
