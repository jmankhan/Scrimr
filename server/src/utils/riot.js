const tierMap = {
  IRON: 0,
  BRONZE: 4,
  SILVER: 8,
  GOLD: 12,
  PLATINUM: 16,
  DIAMOND: 20,
  MASTER: 24,
  GRANDMASTER: 28,
  CHALLENGER: 32,
};

const divisionMap = {
  IV: 0,
  III: 1,
  II: 2,
  I: 3,
};

const wrapper = {
  getRank: (tier, division) => {
    const base = tierMap[tier] || -1;
    const extra = divisionMap[division] || 0;

    return base + extra;
  },
};

export default wrapper;
