import jwt from 'jsonwebtoken';
const secret = process.env.ACCESS_TOKEN_SECRET;

const wrapper = {
  signAccessToken: async (payload) => {
    try {
      const token = await jwt.sign({ payload }, secret, {});
      return token;
    } catch (err) {
      throw Error('Invalid token');
    }
  },

  verifyAccessToken: async (token) => {
    try {
      const payload = await jwt.verify(token, secret);
      console.log('payload ' + payload);
      return payload;
    } catch (err) {
      throw Error(err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message);
    }
  },
};

export default wrapper;
