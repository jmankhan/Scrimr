import axios from 'axios';
const API_URL = '/api';

const API = {
  login: function (email, password) {
    return axios
      .post(API_URL + '/user/login', {
        email,
        password,
      })
      .then((response) => {
        if (response.data.user.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        options.headers.Authorization = `Bearer: ${response.data.user.accessToken}`;
        return response.data;
      });
  },

  register: function (email, name, password) {
    return axios
      .post(API_URL + '/user/register', {
        email,
        name,
        password,
      })
      .then((response) => {
        return response.data;
      });
  },

  logout: function () {
    localStorage.removeItem('user');
  },

  getCurrentUser: function () {
    return JSON.parse(localStorage.getItem('user'));
  },

  search: async function (name) {
    const response = await axios.get(API_URL + '/search?q=' + name, options);
    return response.data.results;
  },

  syncSummoner: async function (memberId, summonerId) {
    await axios.post(API_URL + `/summoner/${summonerId}/sync`, {}, options);
    const response = await axios.get(API_URL + `/member/${memberId}`, options);
    return response.data;
  },

  getMyScrims: async function () {
    const response = await axios.get(API_URL + '/scrim', options);
    return response.data;
  },

  createScrim: async function () {
    const response = await axios.post(API_URL + '/scrim', {}, options);
    return response.data;
  },

  updateScrim: async function (scrim) {
    const response = await axios.patch(API_URL + `/scrim/${scrim.id}`, {}, options);
    return response.data;
  },

  getMember: async function (id) {
    const response = await axios.get(API_URL + `/member/${id}`, options);
    return response.data;
  },

  createMember: async function (summonerId, scrimId) {
    const member = {
      summonerId,
      scrimId,
    };
    const response = await axios.post(API_URL + '/member', { ...member }, options);
    return response.data;
  },
};

const options = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(API.getCurrentUser()?.accessToken),
  },
};

export default API;
