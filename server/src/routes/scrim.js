import express from 'express';
const router = express.Router();

import prisma from '../utils/prisma.js';
import createHttpError from 'http-errors';
import withAuth from '../middlewares/auth.js';
import { validateHost, validateScrim } from '../utils/validators.js';
import { SCRIMREQUEST_TYPES, SCRIM_MODE, SOCKET_EVENTS } from '../utils/constants.js';
import { automateScrim, createScrimRequest, createTeams, notifyUser, queryScrim, updateScrim } from '../services/index.js';

router.get('/', withAuth, async (req, res, next) => {
  const scrimId = req.params.id;
  if (!validateHost(req.userId, scrimId)) {
    next(new createHttpError.Unauthorized());
  }

  const user = await prisma.user
    .findUnique({
      where: {
        id: Number(req.userId),
      },
    })
    .catch(next);

  const scrims = [];
  const hostedScrims = await prisma.scrim
    .findMany({
      where: {
        hostId: user.id,
      },
    })
    .catch(next);
  scrims.concat(hostedScrims);

  if (user.summoner) {
    const members = await prisma.member
      .findMany({
        where: {
          summonerId: user.summoner.id,
        },
      })
      .catch(next);

    if (members) {
      const scrimIds = new Set(members.map((member) => member.scrimId));
      const scrimsJoined = await prisma.scrim
        .findMany({
          where: {
            id: {
              in: scrimIds,
            },
          },
        })
        .catch(next);
      scrims.concat(scrimsJoined);
    }
  }
  res.json(scrims);
});

router.post('/', withAuth, async (req, res, next) => {
  const userId = req.userId;

  const result = await prisma.scrim
    .create({
      data: {
        hostId: Number(userId),
      },
    })
    .catch(next);

  const scrim = await queryScrim(result.id).catch(next);
  res.status(200).json(scrim);
});

router.post('/:id/join', withAuth, async (req, res, next) => {
  // const scrimId = req.params.id;
  // const userId = req.userId;
  // const scrimRequest = await createScrimRequest(scrimId, userId, SCRIMREQUEST_TYPES.MEMBER_JOIN).catch(next);
  // const scrim = await queryScrim(scrimId).catch(next);
  // await notifyUser(req, SOCKET_EVENTS.JOIN_SCRIM, { scrim, scrimRequest });
});

router.get('/:id', withAuth, async (req, res, next) => {
  const scrimId = req.params.id;
  const canViewScrim = await validateScrim(req.userId, scrimId);

  if (!canViewScrim) {
    next(new createHttpError.Unauthorized());
  }

  const record = await queryScrim(scrimId).catch(next);
  if (!record) {
    next(new createHttpError.NotFound());
  }
  res.json(record);
});

router.patch('/:id', withAuth, async (req, res, next) => {
  const scrimId = req.params.id;
  const userId = req.userId;
  const scrim = { ...req.body };
  if (!validateHost(userId, scrimId)) {
    next(new createHttpError.Unauthorized());
  }

  let updatedScrim;
  const { mode, teamSize, pool } = scrim;
  if (mode !== SCRIM_MODE.MANUAL) {
    try {
      updatedScrim = await automateScrim(scrimId, pool, mode, teamSize);
    } catch (err) {
      next(err);
    }
  } else {
    updateScrim(scrim);
    // await notifyUser(req, SOCKET_EVENTS.GET_SCRIM, await queryScrim(scrimId));
    updatedScrim = await queryScrim(scrimId);
  }

  res.status(200).json({ scrim: updatedScrim });
});

router.delete('/:id', withAuth, async (req, res, next) => {
  const scrimId = req.params.id;
  const userId = req.userId;
  if (!validateHost(userId, scrimId)) {
    next(new createHttpError.Unauthorized());
  }

  await prisma.scrim
    .delete({
      where: {
        id: Number(scrimId),
      },
    })
    .catch(next);

  res.sendStatus(200);
});

export default router;
