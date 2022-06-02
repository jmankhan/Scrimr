import express from 'express';
import p from '@prisma/client';

const router = express.Router();
const prisma = new p.PrismaClient();
import requireAuth from '../middlewares/auth.js';
import AuthService from '../services/auth.service.js';

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const jwtUser = await AuthService.getCurrentUser(token);

    const user = await prisma.user.findFirst({
      where: {
        id: Number(jwtUser.id),
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

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const jwtUser = await AuthService.getCurrentUser(token);

    const result = await prisma.scrim.create({
      data: {
        hostId: jwtUser.id,
      },
    });
    res.json({ teams: [], pool: [], ...result });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'An error occurred creating this scrim',
    });
  }
});

router.get('/:id', async (req, res, next) => {
  const record = await prisma.scrim.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!record) {
    res.statusCode(404);
  }

  res.json(record);
});

router.patch('/:id', async (req, res, next) => {
  try {
    await prisma.scrim.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        ...req.body,
      },
    });

    res.status(200).json({
      message: 'Success',
    });
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred updating the scrim',
    });
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.scrim.delete({
      where: {
        id: Number(req.params.id),
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
