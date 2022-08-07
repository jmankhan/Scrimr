import prisma from '../utils/prisma.js';

export const queryUser = (id) => {
  return prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      summoner: true,
    },
  });
};
