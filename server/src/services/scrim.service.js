import prisma from '../utils/prisma';
import { SCRIM_MODE } from '../utils/constants';
import createHttpError from 'http-errors';
import { createTeams, queryTeams } from './team.service';

export const automateScrim = async (scrimId, pool, mode, teamSize) => {
  if (
    !pool ||
    !Array.isArray(pool) ||
    pool.length === 0 ||
    !teamSize ||
    teamSize === 0 ||
    !mode ||
    mode === SCRIM_MODE.MANUAL ||
    !scrimId
  ) {
    throw new createHttpError.BadRequest('Cannot create scrim based on these inputs.');
  }

  // based on teamsize, create n teams sorted by mode
  const numTeams = Math.ceil(pool.length / teamSize);
  let sortedPool;

  if (mode === SCRIM_MODE.RANDOM) {
    sortedPool = pool.sort(() => (Math.random() > 0.5 ? 1 : -1));
  } else if (mode === SCRIM_MODE.BEST_RANK) {
    sortedPool = pool.sort((a, b) => b.summoner.rank - a.summoner.rank);
  }

  const teams = sortedPool
    .reduce((result, member, index) => {
      const chunkIdx = index % numTeams;
      if (!result[chunkIdx]) {
        result[chunkIdx] = { members: [] };
      }
      result[chunkIdx].members.push(member);
      return result;
    }, [])
    .flat()
    .map((team, draftOrder) => {
      return {
        members: team.members,
        draftOrder,
        sideOrder: numTeams - 1 - draftOrder,
        scrimId,
      };
    });

  const teamInserts = await createTeams(teams);
  const newTeams = await queryTeams(teamInserts.map((t) => t.id));

  const captainIds = new Set([...newTeams].map((t) => t.members[0].id));
  await prisma.member.update({
    where: {
      id: {
        in: captainIds,
      },
      data: {
        isCaptain: true,
      },
    },
  });

  const result = {
    id: scrimId,
    teams: newTeams,
    pool: sortedPool,
    step: 'play',
  };

  await updateScrim(result);
  return await queryScrim(scrimId);
};

export const updateScrim = async ({ id, draftOrder, mode, sideOrder, step, teamSize, pool, teams }) => {
  return await prisma.scrim.update({
    where: {
      id: Number(id),
    },
    data: {
      draftOrder,
      mode,
      sideOrder,
      step,
      teamSize,
      pool: {
        connect: Array.isArray(pool) ? pool.map((member) => ({ id: member.id })) : [],
      },
      teams: {
        connect: Array.isArray(teams) ? teams.map((team) => ({ id: team.id })) : [],
      },
    },
  });
};

export const queryScrim = async (id) => {
  return prisma.scrim.findUnique({
    where: { id: Number(id) },
    include: {
      pool: {
        include: {
          summoner: true,
        },
      },
      requests: {
        include: {
          user: true,
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
