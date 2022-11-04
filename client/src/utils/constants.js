export const ROLE_OPTIONS = [
  { text: "Top", value: "top" },
  { text: "Jungle", value: "jg" },
  { text: "Middle", value: "mid" },
  { text: "Marksman", value: "adc" },
  { text: "Support", value: "sup" },
  { text: "Fill", value: "fill" },
];

export const SCRIM_MODE_OPTIONS = [
  { text: "Manual", value: "MANUAL" },
  { text: "Random", value: "RANDOM" },
  { text: "Best Rank", value: "BEST_RANK" },
  // { text: "Worst Rank", value: "WORST_RANK" },
];

export const DEFAULT_SCRIM_MODE = "MANUAL";

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
    name: "play",
    title: "Play",
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
