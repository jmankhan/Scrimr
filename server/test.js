import twisted from 'twisted';
const riotApi = new twisted.LolApi();
const riotResponse = await riotApi.Summoner.getByName('ninjafroggi', twisted.Constants.Regions.AMERICA_NORTH);
console.log(JSON.stringify(riotResponse));
