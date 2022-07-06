import twisted from 'twisted';
import riotUtils from '../utils/riot.js';
const riotApi = new twisted.LolApi();

class SummonerService {
  static async getSummonerByName(name) {
    try {
      const summonerResponse = await riotApi.Summoner.getByName(name, twisted.Constants.Regions.AMERICA_NORTH);
      return SummonerService.getSummonerByResponse(summonerResponse.response);
    } catch (err) {
      console.log('could not find summoner ' + name);
      throw Error('Summoner not found');
    }
  }

  static async getSummonerById(id) {
    const summonerResponse = await riotApi.Summoner.getById(id, twisted.Constants.Regions.AMERICA_NORTH);
    if (summonerResponse.response) {
      return SummonerService.getSummonerByResponse(summonerResponse.response);
    } else {
      throw Error('Summoner not found');
    }
  }

  static async getSummonerByResponse(response) {
    const { id, name, profileIconId, summonerLevel } = response;
    const summoner = {
      id,
      name,
      icon: profileIconId,
      level: summonerLevel,
      rank: -1,
    };

    const leagueDataResponse = await riotApi.League.bySummoner(id, twisted.Constants.Regions.AMERICA_NORTH);
    if (leagueDataResponse) {
      const leagues = leagueDataResponse.response;
      const rankedSolo = leagues.find((l) => l.queueType === 'RANKED_SOLO_5x5');
      if (rankedSolo) {
        summoner.rank = riotUtils.getRank(rankedSolo.tier, rankedSolo.rank);
      }
    } else {
      throw Error('League data not found');
    }

    return summoner;
  }
}

export default SummonerService;
