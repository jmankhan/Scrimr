import express from 'express';
const router = express.Router();
import prisma from '../utils/prisma.js';

import withAuth from '../middlewares/auth.js';
import createHttpError from 'http-errors';
import { createKey, createMember, queryMember, queryMembersByScrim } from '../services/member.service.js';
import { validateHost } from '../utils/validators.js';

router.post('/', withAuth, async (req, res, next) => {
  const { summonerIds, scrimId } = req.body;

  if (!summonerIds || !scrimId || !Array.isArray(summonerIds) || summonerIds.length < 1) {
    throw new createHttpError.BadRequest('Invalid members');
  }

  const safeSummonerIds = summonerIds.map(id => decodeURI(id));
  const existingSummoners = await prisma.summoner.findMany({
    where: {
      id: {
        in: safeSummonerIds
      }
    }
  });

  if (existingSummoners.length !== summonerIds.length) {
    throw new createHttpError.BadRequest('Some summoners could not be found');
  }

  const uniqueKeys = summonerIds.map(id => createKey(id, scrimId));
  const existingMembers = await prisma.member.findMany({
    where: {
      uniqueKey: {
        in: uniqueKeys
      }
    },
  });

  const existingMemberKeys = new Set(existingMembers.map(m => m.uniqueKey));
  const recordsToCreate = safeSummonerIds
    .map(id => createMember(id, scrimId))
    .filter(member => !existingMemberKeys.has(member.uniqueKey));

  const result = await prisma.member.createMany({
      data: recordsToCreate,
      skipDuplicates: true
    })
    .catch(next);

  const allMembers = await queryMembersByScrim(scrimId);
  res.status(200).json({ members: allMembers });
});

router.get('/:id', withAuth, async (req, res, next) => {
  const memberId = req.params.id;
  const member = await queryMember(memberId).catch(next);
  res.status(200).json({ member });
});

router.delete('/:id', withAuth, async (req, res, next) => {
  const memberId = req.params.id;
  await prisma.member
    .delete({
      where: {
        id: Number(memberId),
      },
    })
    .catch(next);

  res.sendStatus(200);
});

router.delete('/', withAuth, async (req, res, next) => {
  const userId = req.userId;
  const scrimId = req.query.scrimId;

  if (!scrimId) {
    next(new createHttpError.BadRequest('Invalid scrim id'));
  }

  if (!validateHost(userId, scrimId)) {
    next(new createHttpError.Unauthorized());
  }

  await prisma.member
    .deleteMany({
      where: {
        scrimId: Number(req.query.scrimId),
      },
    })
    .catch(next);

  res.status(200).json({
    message: 'Success',
  });
})

router.put('/:id', withAuth, async (req, res, next) => {
  const memberId = req.params.id;
  await prisma.member
    .update({
      where: {
        id: Number(memberId),
      },
      data: {
        ...req.body,
      },
    })
    .catch(next);

  const updatedMember = await queryMember(memberId).catch(next);
  res.status(200).json({ member: updatedMember });
});

router.patch('/', withAuth, async (req, res, next) => {
  // validate all members are in same scrim and if user is host of that scrim
  const members = [...req.body.members];
  const scrimIds = new Set(members.map((m) => m.scrimId));

  if (scrimIds.size !== 1) {
    next(new createHttpError.BadRequest('All members must be in the same scrim'));
  }

  const updates = [];
  members.forEach((member) => {
    const { team, summoner, scrim, ...rest } = member;
    updates.push(
      prisma.member.update({
        where: {
          id: Number(member.id),
        },
        data: {
          ...rest,
        },
      })
    );
  });

  const memberUpdates = await Promise.all(updates).catch(next);
  const updatedMembers = await prisma.member.findMany({
    where: {
      id: {
        in: memberUpdates.map((m) => m.id),
      },
    },
    include: {
      summoner: true,
      team: true,
      scrim: true,
    },
  });

  res.json({ members: updatedMembers });
});


export default router;
