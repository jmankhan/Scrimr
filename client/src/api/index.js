import axios from "axios";
const API_URL = "/api";

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
class API {
  static createMember = async (summonerId, scrimId) => {
    const member = {
      summonerId,
      scrimId,
    };
    const response = await client.post("/member", { ...member });
    return response.data;
  };

  static createScrim = async () => {
    const response = await client.post("/scrim", {}, { withCredentials: true });
    return response.data;
  };

  static createTeams = async (teams) => {
    const response = await client.post("/team", [...teams]);
    return response.data;
  };

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

  static register = async (email, password, name) => {
    const response = await client.post("/user/register", {
      email,
      password,
      name,
    });
    return response.statusText;
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

  static updateScrim = async (scrim) => {
    const response = await client.patch(`/scrim/${scrim.id}`, scrim);
    return response.data;
  };

  static updateTeams = async (teams) => {
    const response = await client.patch("/team", [...teams]);
    return response.data;
  };
}

export default API;
