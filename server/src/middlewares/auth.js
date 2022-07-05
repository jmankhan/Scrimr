import createHttpError from 'http-errors';
import jwt from '../utils/jwt.js';

const withAuth = async function (req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;

  if (!token) {
    next(new createHttpError.Unauthorized());
  } else {
    try {
      const result = await jwt.verifyAccessToken(token);
      req.userId = result.payload.id;
      next();
    } catch (err) {
      next(new createHttpError.Unauthorized());
    }
  }
};

export default withAuth;
