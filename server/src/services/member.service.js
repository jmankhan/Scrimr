import prisma from '../utils/prisma.js';

export const queryMember = (memberId) => {
  return prisma.member.findUnique({
    where: {
      id: Number(memberId),
    },
    include: {
      summoner: true,
      team: true,
      scrim: true,
    },
  });
};
