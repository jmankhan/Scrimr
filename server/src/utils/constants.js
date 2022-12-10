export const SCRIM_MODE = Object.freeze({
  MANUAL: 'manual',
  RANDOM: 'random',
  BEST_RANK: 'best_rank',
  // WORST_RANK: 'WORST_RANK',
});

export const SOCKET_EVENTS = Object.freeze({
  GET_SCRIM: 'GET_SCRIM',
  JOIN_SCRIM: 'JOIN_SCRIM',
  JOIN_SCRIM_APPROVE: 'JOIN_SCRIM_APPROVE',
});

export const SCRIMREQUEST_TYPES = Object.freeze({
  MEMBER_JOIN: 'MEMBER_JOIN',
});

export const SCRIMREQUEST_STATUS = Object.freeze({
  APPROVE: 'APPROVE',
  DENY: 'DENY',
  PENDING: 'PENDING',
});
