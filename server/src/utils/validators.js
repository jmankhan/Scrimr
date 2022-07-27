import p from '@prisma/client';
const prisma = new p.PrismaClient();

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
