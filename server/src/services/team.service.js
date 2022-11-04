import createHttpError from 'http-errors';
import prisma from '../utils/prisma.js';

export const createTeams = async (teams) => {
  if (!teams || !Array.isArray(teams) || teams.length === 0) {
    throw new createHttpError.BadRequest('Cannot create teams based on inputs');
  }

  // connect is not available for createMany, so perform insert in a loop
  const inserts = [];
  teams.forEach((team, teamIndex) => {
    inserts.push(
      prisma.team.create({
        data: {
          draftOrder: team.draftOrder,
          name: team.name || `${teams[teamIndex].members[0].summoner.name}'s Team`,
          scrimId: Number(team.scrimId),
          sideOrder: team.sideOrder,
          members: {
            connect: team.members.map((member) => ({ id: member.id })),
          },
        },
      })
    );
  });

  return await Promise.all(inserts);
};

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
