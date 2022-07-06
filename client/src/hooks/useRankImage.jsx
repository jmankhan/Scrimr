const importAll = (require) =>
  require.keys().reduce((acc, next) => {
    acc[next.replace("./", "")] = require(next);
    return acc;
  }, {});

const images = importAll(
  require.context("../assets/rank_emblems", false, /\.(png|jpe?g|svg)$/)
);
const tierMap = {
  0: "IRON",
  4: "BRONZE",
  8: "SILVER",
  12: "GOLD",
  16: "PLATINUM",
  20: "DIAMOND",
  24: "MASTER",
  28: "GRANDMASTER",
  32: "CHALLENGER",
};

const divisionMap = {
  0: "IV",
  1: "III",
  2: "II",
  3: "I",
};

const useRankImages = (rank) => {
  let imageKey,
    tier,
    division,
    title = "UNRANKED";

  if (!rank) {
    return [undefined, undefined];
  } else if (rank < 0) {
    imageKey = "-1.png";
  } else {
    tier = rank - (rank % 4);
    division = rank % 4;
    imageKey = `0${Math.floor(rank / 4)}.png`;

    title = tierMap[tier] + " " + divisionMap[division];
  }

  return [images[imageKey], title];
};

export default useRankImages;
