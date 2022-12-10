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

export const queryMembersByScrim = (scrimId) => {
  return prisma.member.findMany({
    where: {
      scrimId: Number(scrimId),
    },
    include: {
      summoner: true,
      team: true,
      scrim: true
    },
  });
}

export const createKey = (summonerId, scrimId) => {
  return scrimId + '_' + decodeURIComponent(summonerId);
}

export const createMember = (summonerId, scrimId) => {
  return ({
    summonerId: decodeURIComponent(summonerId),
    scrimId: scrimId,
    uniqueKey: createKey(summonerId, scrimId)
  })
}