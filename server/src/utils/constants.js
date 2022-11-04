export const SCRIM_MODE = Object.freeze({
  MANUAL: 'MANUAL',
  RANDOM: 'RANDOM',
  BEST_RANK: 'BEST_RANK',
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
