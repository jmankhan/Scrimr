import express from 'express';
import p from '@prisma/client';

const router = express.Router();
const prisma = new p.PrismaClient();
import withAuth from '../middlewares/auth.js';
import { validateHost, validateTeamMember } from '../utils/validators.js';
import createHttpError from 'http-errors';
import { createTeams, queryTeam, queryTeams } from '../services/team.service.js';

router.get('/:id', withAuth, async (req, res, next) => {
  const teamId = req.params.id;
  const userId = req.userId;

  if (!validateTeamMember(teamId, userId)) {
    next(new createHttpError.Unauthorized());
  }

  const team = await queryTeam(teamId).catch(next);
  res.status(200).json({ team });
});

router.post('/', withAuth, async (req, res, next) => {
  const userId = req.userId;
  const scrimIds = new Set(req.body.map((team) => team.scrimId));
  const teams = [...req.body];

  if (scrimIds.size !== 1) {
    next(new createHttpError.BadRequest('All teams must be for the same scrim'));
  }

  const scrimId = [...scrimIds][0];
  if (!validateHost(userId, scrimId)) {
    next(new createHttpError.Unauthorized());
  }

  const teamInserts = await createTeams(teams);
  const newTeams = await queryTeams(teamInserts.map((t) => t.id)).catch(next);

  res.status(200).json({ teams: newTeams });
});

router.patch('/', withAuth, async (req, res, next) => {
  const userId = req.userId;
  const scrimIds = new Set(req.body.map((team) => team.scrimId));

  if (scrimIds.size() !== 1) {
    next(new createHttpError.BadRequest('All teams must be for the same scrim'));
  }

  const [scrimId] = scrimIds;
  if (!validateHost(userId, scrimId)) {
    next(new createHttpError.Unauthorized());
  }

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
  const teams = await Promise.all(updates).catch(next);
  res.status(200).json({ teams });
});

router.delete('/', withAuth, async (req, res, next) => {
  const userId = req.userId;
  const scrimId = req.query.scrimId;

  if (!scrimId) {
    next(new createHttpError.BadRequest('scrimId is required'));
  }

  if (!validateHost(userId, scrimId)) {
    next(new createHttpError.Unauthorized());
  }

  await prisma.team
    .deleteMany({
      where: {
        scrimId: Number(req.query.scrimId),
      },
    })
    .catch(next);

  res.status(200).json({
    message: 'Success',
  });
});

export default router;
