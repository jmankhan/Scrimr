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
