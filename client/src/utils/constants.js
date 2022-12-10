export const ERROR_TOAST = { title: 'Error', status: 'error', duration: 2500, isClosable: true, position: 'top-right' };

export const ROLE_OPTIONS = [
  { label: "Fill", value: "fill" },
  { label: "Top", value: "top" },
  { label: "Jungle", value: "jg" },
  { label: "Middle", value: "mid" },
  { label: "Marksman", value: "adc" },
  { label: "Support", value: "sup" },
];

export const SCRIM_MODE_OPTIONS = [
  { label: "Manual", value: "manual" },
  { label: "Random", value: "random" },
  { label: "Best Rank", value: "best_rank" },
];

export const DEFAULT_SCRIM_MODE = { label: 'Manual', value: 'manual' };


export const STEPS = [
  {
    name: "pool",
    title: "Pool",
    description: "Add candidate players",
    icon: "list ul",
    order: 1,
  },
  {
    name: "select-captains",
    title: "Select Captains",
    description: "Choose who leads",
    icon: "star outline",
    order: 2,
  },
  {
    name: "prize-wheel",
    title: "Prize Wheel",
    description: "Pray to the RNG gods",
    icon: "compass outline",
    order: 3,
  },
  {
    name: "draft",
    title: "Draft",
    description: "Cull the weak",
    icon: "user outline",
    order: 4,
  },
  {
    name: "bracket",
    title: "Form Bracket",
    description: "Start playing!",
    icon: "gamepad",
    order: 5,
  },
];

export const SOCKET_EVENTS = Object.freeze({
  JOIN_SCRIM: "JOIN_SCRIM",
  GET_SCRIM: "GET_SCRIM",
});

export const SCRIMREQUEST_STATUS = Object.freeze({
  APPROVE: "APPROVE",
  DENY: "DENY",
  PENDING: "PENDING",
});

export const CREATEPOOL_SORT_ADDED = { label: 'Added', value: 'added' };
export const CREATEPOOL_SORT_NAME = { label: 'Name', value: 'name' };
export const CREATEPOOL_SORT_RANK = { label: 'Rank', value: 'rank' };

export const CREATEPOOL_SORT_OPTIONS = [
  CREATEPOOL_SORT_ADDED,
  CREATEPOOL_SORT_NAME,
  CREATEPOOL_SORT_RANK, 
]

export const DRAFT_CONTROLS_VIEW_CAPTAIN = { label: 'Captain', value: 'captain' };
export const DRAFT_CONTROLS_VIEW_TEAM = { label: 'Team', value: 'team' };
export const DRAFT_CONTROLS_VIEW_OPTIONS = [
  DRAFT_CONTROLS_VIEW_CAPTAIN,
  DRAFT_CONTROLS_VIEW_TEAM
];