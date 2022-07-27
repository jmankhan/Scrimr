import p from '@prisma/client';
const prisma = new p.PrismaClient();

export const getUser = (id) => {
  return prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      summoner: true,
    },
  });
};
