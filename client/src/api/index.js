import axios from "axios";
const API_URL = window.location.hostname === 'localhost' ? "http://localhost:3001/api" : "/api";

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
client.defaults.withCredentials = true;

class API {
  static confirmCode = async (code) => {
    await client.get(`/user/confirm?code=${code}`);
  };

  static createMembers = async (summonerIds, scrimId) => {
    const response = await client.post("/member", { summonerIds, scrimId });
    return response.data;
  };

  static createScrim = async () => {
    const response = await client.post("/scrim", {});
    return response.data;
  };

  static createScrimRequestJoin = async (scrimId) => {
    const response = await client.post(`/scrim/${scrimId}/join`);
    return response.data;
  };

  static createSummoner = async (name) => {
    const response = await client.post(`/summoner`, { name });
    return response.data;
  }

  static createTeams = async (teams) => {
    const response = await client.post("/team", [...teams]);
    return response.data;
  };

  static deleteMember = async (id) => {
    const response = await client.delete(`/member/${id}`);
    return response.data;
  };

  static deleteMembersForScrim = async (scrimId) => {
    const response = await client.delete(`/member?scrimId={scrimId}`);
    return response.data;
  }

  static deleteTeamsForScrim = async (scrimId) => {
    const response = await client.delete(`/team?scrimId=${scrimId}`);
    return response.data;
  };

  static getCurrentUser = async () => {
    const response = await client.get("/user/me");
    return response.data;
  };

  static getMember = async (id) => {
    const response = await client.get(`/member/${id}`);
    return response.data;
  };

  static getMyScrims = async () => {
    const response = await client.get("/scrim");
    return response.data;
  };

  static getProfile = async () => {
    const response = await client.get("/user/profile");
    return response.data;
  };

  static getScrim = async (id) => {
    const response = await client.get(`/scrim/${id}`);
    return response.data;
  };

  static getTeam = async (id) => {
    const response = await client.get(`/team/${id}`);
    return response.data;
  };

  static login = async (email, password) => {
    const response = await client.post("/user/login", { email, password });
    return response.statusText;
  };

  static logout = async () => {
    const response = await client.post("/user/logout");
    return response.statusText;
  };

  static register = async (email, summonerName, password) => {
    const response = await client.post("/user/register", {
      email,
      summonerName,
      password,
    });
    return response.data;
  };

  static saveProfile = async (profile) => {
    const response = await client.patch("/user/profile", { user: profile });
    return response.data;
  };

  static search = async (name) => {
    const response = await client.get(`/search?q=${name}`);
    return response.data;
  };

  static syncSummoner = async (memberId, summonerId) => {
    await client.post(`/summoner/${summonerId}/sync`);
    const response = await client.get(`/member/${memberId}`);
    return response.data;
  };

  static updateMembers = async (members) => {
    const response = await client.patch("/member/", { members });
    return response.data;
  };

  static updateScrim = async (scrim) => {
    const response = await client.patch(`/scrim/${scrim.id}`, scrim);
    return response.data;
  };

  static updateScrimRequest = async (id, status) => {
    const response = await client.patch(`/scrimrequest/${id}`, { status });
    return response.data;
  };

  static updateTeams = async (teams) => {
    const response = await client.patch("/team", [...teams]);
    return response.data;
  };
}

export default API;
