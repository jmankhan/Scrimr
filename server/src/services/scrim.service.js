import prisma from '../utils/prisma';
import { SCRIM_MODE } from '../utils/constants';

export const createTeams = (scrimId, pool, mode, teamSize) => {
  // based on teamsize, create n teams sorted by mode
  const numTeams = Math.ceil(pool.length / teamSize);
  let sortedPool;

  if (mode === SCRIM_MODE.MANUAL) {
    sortedPool = pool;
  } else if (mode === SCRIM_MODE.RANDOM) {
    sortedPool = pool.sort(() => (Math.random() > 0.5 ? 1 : -1));
  } else if (mode === SCRIM_MODE.BEST_RANK) {
    sortedPool = pool.sort((a, b) => a.summoner.rank - b.summoner.rank);
  } else if (mode === SCRIM_MODE.WORST_RANK) {
    sortedPool = pool.sort((a, b) => b.summoner.rank - a.summoner.rank);
  }

  let teams = new Array(numTeams).fill({ members: [], name: null, scrimId });

  for (let i = 0; i < sortedPool.length; i++) {
    const t = i % numTeams;
    teams[t].members.push(sortedPool);
  }

  return teams.map((team) => ({ ...team, name: `${team.members[0].summoner.name}'s Team` }));
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
