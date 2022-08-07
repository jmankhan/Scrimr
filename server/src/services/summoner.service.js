import createHttpError from 'http-errors';
import twisted from 'twisted';
import riotUtils from '../utils/riot.js';
const riotApi = new twisted.LolApi();

export class SummonerService {
  static async getSummonerByName(name) {
    try {
      const riotResponse = await riotApi.Summoner.getByName(name, twisted.Constants.Regions.AMERICA_NORTH).catch(next);
      return SummonerService.getSummonerByResponse(riotResponse.response);
    } catch (err) {
      throw new createHttpError.NotFound();
    }
  }

  static async getSummonerById(id) {
    const riotResponse = await riotApi.Summoner.getById(id, twisted.Constants.Regions.AMERICA_NORTH).catch(next);
    if (riotResponse.response) {
      return SummonerService.getSummonerByResponse(riotResponse.response);
    } else {
      throw new createHttpError.NotFound();
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

    const riotResponse = await riotApi.League.bySummoner(id, twisted.Constants.Regions.AMERICA_NORTH).catch(next);
    if (riotResponse) {
      const leagues = riotResponse.response;
      const rankedSolo = leagues.find((l) => l.queueType === 'RANKED_SOLO_5x5');
      if (rankedSolo) {
        summoner.rank = riotUtils.getRank(rankedSolo.tier, rankedSolo.rank);
      }
    } else {
      throw new createHttpError.NotFound();
    }

    return summoner;
  }
}
