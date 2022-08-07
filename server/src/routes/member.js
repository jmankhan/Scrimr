import express from 'express';
const router = express.Router();
import prisma from '../utils/prisma.js';

import withAuth from '../middlewares/auth.js';
import { SummonerService } from '../services/';
import createHttpError from 'http-errors';
import { queryMember } from '../services/member.service.js';

router.post('/', withAuth, async (req, res, next) => {
  const { summonerId, scrimId } = req.body;

  const safeSummonerId = decodeURI(summonerId);
  let summoner = await prisma.summoner.findUnique({
    where: {
      id: safeSummonerId,
    },
  });

  if (!summoner) {
    const summonerResponse = await SummonerService.getSummonerByName(safeSummonerId).catch(next);
    summoner = await prisma.summoner
      .create({
        data: {
          ...summonerResponse,
        },
      })
      .catch(next);
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
            equals: Number(scrimId),
          },
        },
      ],
    },
  });

  if (memberExists) {
    return next(new createHttpError.BadRequest('This member is already in the pool'));
  }

  const member = await prisma.member
    .create({
      data: {
        summonerId: summoner.id,
        scrimId: Number(scrimId),
      },
    })
    .catch(next);

  res.status(200).json({
    member,
  });
});

router.get('/:id', withAuth, async (req, res, next) => {
  const memberId = req.params.id;

  const member = await queryMember(memberId).catch(next);

  if (!member) {
    next(new createHttpError.NotFound());
  }

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
  const scrimIds = new Set(members.map(member.scrimId));

  if (scrimIds.size() !== 1) {
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
