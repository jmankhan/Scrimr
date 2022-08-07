import prisma from '../utils/prisma.js';

export const queryTeam = (teamId) => {
  return prisma.team.findUnique({
    where: {
      id: Number(teamId),
    },
  });
};

export const queryTeams = (teamIds) => {
  return prisma.team.findMany({
    where: {
      id: {
        in: teamIds,
      },
    },
    include: {
      members: {
        include: {
          summoner: true,
        },
      },
    },
  });
};
