import jwt from '../utils/jwt.js';
import createError from 'http-errors';

const auth = async (req, res, next) => {
  console.log('authorizing for url ' + req.protocol + '://' + req.get('host') + req.originalUrl);
  console.log('with token ' + req.headers.authorization);
  if (!req.headers.authorization) {
    return next(createError.Unauthorized('Access token is required'))
  }
  const token = req.headers.authorization.split(' ')[1]
  if (!token) {
    return next(createError.Unauthorized())
  }
  jwt.verifyAccessToken(token).then(user => {
    req.user = user
    next()
  }).catch (e => {
    console.log('did not find user - ' + token);
    next(createError.Unauthorized(e.message))
  })
}

export default auth;
