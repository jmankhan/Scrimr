import express from 'express';
import p from '@prisma/client';

const router = express.Router();
const prisma = new p.PrismaClient();
import withAuth from '../middlewares/auth.js';

router.get('/:id', withAuth, async (req, res, next) => {
  try {
    const team = await prisma.team.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    res.status(200).json({
      team,
    });
  } catch (err) {
    console.log(err);
    res.statusCode(404);
  }
});

router.post('/', withAuth, async (req, res, next) => {
  try {
    const userId = req.userId;

    const scrimIds = new Set(req.body.map((team) => team.scrimId));

    const scrims = await prisma.scrim.findMany({
      where: {
        id: {
          in: [...scrimIds],
        },
      },
    });

    scrims.forEach((scrim) => {
      if (scrim.hostId !== userId) {
        res.status(400).json({
          message: 'Unauthorized',
        });
      }
    });

    // connect is not available for createMany, so perform insert in a loop D=
    const inserts = [];
    [...req.body].forEach((team) => {
      inserts.push(
        prisma.team.create({
          data: {
            ...team,
            members: {
              connect: team.members.map((member) => ({ id: member.id })),
            },
          },
        })
      );
    });
    const teamInserts = await Promise.all(inserts);
    const teams = await prisma.team.findMany({
      where: {
        id: {
          in: teamInserts.map((team) => team.id),
        },
      },
      include: {
        members: true,
      },
    });

    res.status(200).json({
      teams,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'An error occurred while creating the team',
    });
  }
});

router.patch('/', withAuth, async (req, res, next) => {
  try {
    const userId = req.userId;

    const scrimIds = new Set(req.body.map((team) => team.scrimId));

    const scrims = await prisma.scrim.findMany({
      where: {
        id: {
          in: [...scrimIds],
        },
      },
    });

    scrims.forEach((scrim) => {
      if (scrim.hostId !== userId) {
        res.status(400).json({
          message: 'Unauthorized',
        });
      }
    });

    // updateMany does not allow for different values per match, so we have to update each record separately
    const updates = [];
    [...req.body].forEach((team) => {
      updates.push(
        prisma.team.update({
          where: {
            id: team.id,
          },
          data: {
            ...team,
            members: {
              connect: team.members.map((member) => ({ id: member.id })),
            },
          },
        })
      );
    });
    const teams = await Promise.all(updates);
    res.status(200).json({
      teams,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'An error occurred while updating the team',
    });
  }
});

router.delete('/', withAuth, async (req, res, next) => {
  try {
    const userId = req.userId;

    const scrim = await prisma.scrim.findUnique({
      where: {
        id: Number(req.query.scrimId),
      },
    });

    if (scrim.hostId !== userId) {
      res.status(400).json({
        message: 'Unauthorized',
      });
    }

    await prisma.team.deleteMany({
      where: {
        scrimId: Number(req.query.scrimId),
      },
    });

    res.status(200).json({
      message: 'Success',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'An error occurred while deleting the team',
    });
  }
});
export default router;
