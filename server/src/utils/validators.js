import prisma from '../utils/prisma.js';

export const validateHost = async (userId, scrimId) => {
  const scrim = await prisma.scrim.findUnique({
    where: {
      id: Number(scrimId),
    },
  });

  return scrim.hostId === userId;
};

export const validateScrim = async (userId, scrimId) => {
  const scrim = await prisma.scrim.findUnique({
    where: {
      id: Number(scrimId),
    },
    include: {
      pool: {
        include: {
          summoner: true,
        },
      },
    },
  });

  if (scrim.hostId === userId) {
    return true;
  } else if (scrim.pool) {
    const member = scrim.pool.find((member) => member.summoner?.userId === userId);
    const memberInPool = member != null;
    return memberInPool;
  } else {
    console.log('is not authorized');
    return false;
  }
};

export const validateTeamMember = async (teamId, userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });

  const members = await prisma.user.findUnique({
    where: {
      id: Number(teamId),
      members: {
        some: {
          summonerId: user.summoner.id,
        },
      },
    },
  });

  return members.length > 0;
};
