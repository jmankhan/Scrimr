import p from '@prisma/client';
const prisma = new p.PrismaClient();

export const queryScrim = async (id) => {
  return prisma.scrim.findUnique({
    where: { id: Number(id) },
    include: {
      pool: {
        include: {
          summoner: true,
        },
      },
      teams: {
        include: {
          members: {
            include: {
              summoner: true,
            },
          },
        },
      },
    },
  });
};
