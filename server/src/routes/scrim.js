import express from 'express';
import p from '@prisma/client';

const router = express.Router();
const prisma = new p.PrismaClient();
import withAuth from '../middlewares/auth.js';
import { validateHost, validateScrim } from '../utils/validators.js';
import { SCRIMREQUEST_TYPES, SOCKET_EVENTS } from '../utils/constants.js';
import { notifyUser, queryScrim } from '../services';

router.get('/', withAuth, async (req, res, next) => {
  try {
    const scrimId = req.params.id;
    if (!validateHost(req.userId, scrimId)) {
      res.status(401);
    }

    const user = await prisma.user.findFirst({
      where: {
        id: Number(req.userId),
      },
    });

    const scrims = [];
    const scrimsHosted = await prisma.scrim.findMany({
      where: {
        hostId: user.id,
      },
    });
    scrims.concat(scrimsHosted);

    if (user.summoner) {
      const members = await prisma.member.findMany({
        where: {
          summonerId: user.summoner.id,
        },
      });

      const scrimIds = new Set(members.map((member) => member.scrimId));
      const scrimsJoined = await prisma.scrim.findMany({
        where: {
          id: {
            in: scrimIds,
          },
        },
      });
      scrims.concat(scrimsJoined);
    }
    res.json(scrims);
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred retrieving this scrim',
    });
  }
});

router.post('/', withAuth, async (req, res, next) => {
  try {
    const result = await prisma.scrim.create({
      data: {
        hostId: req.userId,
      },
    });
    res.json({ teams: [], pool: [], ...result });
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred creating this scrim',
    });
  }
});

router.post('/:id/join', withAuth, async (req, res, next) => {
  try {
    const scrimId = req.params.id;
    const userId = req.userId;

    await prisma.ScrimRequest.create({
      data: {
        scrimId: Number(scrimId),
        userId: Number(userId),
        type: SCRIMREQUEST_TYPES.MEMBER_JOIN,
      },
    });

    const scrim = await queryScrim(scrimId);
    await notifyUser(req, SOCKET_EVENTS.JOIN_SCRIM, scrim);
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred making the request',
    });
  }
});

router.get('/:id', withAuth, async (req, res, next) => {
  try {
    const scrimId = req.params.id;
    const canViewScrim = await validateScrim(req.userId, scrimId);
    if (!canViewScrim) {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      const record = await queryScrim(scrimId);
      if (!record) {
        res.statusCode(404);
      }
      res.json(record);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.patch('/:id', withAuth, async (req, res, next) => {
  try {
    const scrimId = req.params.id;
    if (!validateHost(req.userId, scrimId)) {
      res.status(401);
    }

    const scrim = { ...req.body };
    await prisma.scrim.update({
      where: {
        id: Number(scrimId),
      },
      data: {
        id: scrim.id,
        autoDraft: scrim.autoDraft,
        autoBalance: scrim.autoBalance,
        draftOrder: scrim.draftOrder,
        sideOrder: scrim.sideOrder,
        step: scrim.step,
        teamSize: scrim.teamSize,
        pool: {
          connect: Array.isArray(scrim.pool) ? scrim.pool.map((member) => ({ id: member.id })) : [],
        },
        teams: {
          connect: Array.isArray(scrim.teams) ? scrim.teams.map((team) => ({ id: team.id })) : [],
        },
      },
    });

    await notifyUser(req, SOCKET_EVENTS.GET_SCRIM, await queryScrim(scrimId));

    res.status(200).json({
      message: 'Success',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'An error occurred updating the scrim',
    });
  }
});

router.delete('/:id', withAuth, async (req, res, next) => {
  try {
    const scrimId = req.params.id;
    if (!validateHost(req.userId, scrimId)) {
      res.status(401);
    }

    await prisma.scrim.delete({
      where: {
        id: Number(scrimId),
      },
    });
    res.json({
      message: 'Success',
    });
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred deleting this scrim',
    });
  }
});

export default router;
