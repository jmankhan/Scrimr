import jwt from 'jsonwebtoken';
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const wrapper = {
  signAccessToken: async (payload) => {
    try {
      const token = await jwt.sign({ payload }, accessTokenSecret, {});
      return token;
    } catch(err) {
      throw Error('Invalid token');
    }
  },

  verifyAccessToken: async (token) => {
    try {
      const payload = await jwt.verify(token, accessTokenSecret);
      return payload
    } catch(err) {
      throw Error(err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message);
    }

  }
}

export default wrapper;
