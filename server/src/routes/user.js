import express from 'express';
const router = express.Router();
import withAuth from '../middlewares/auth.js';
import { sendEmail } from '../utils/email.js';
import { AuthService, queryUser } from '../services';
import prisma from '../utils/prisma.js';
import createHttpError from 'http-errors';

router.get('/profile', withAuth, async function (req, res) {
  const userId = req.userId;
  const user = await prisma.user
    .findUnique({
      where: {
        id: Number(userId),
      },
    })
    .catch(err);

  return res.json({ user });
});

router.patch('/profile', withAuth, async function (req, res, next) {
  const userId = req.userId;
  const user = req.body.user;

  if (userId !== user.id) {
    next(new createHttpError.Unauthorized());
  }

  await prisma.user
    .update({
      where: {
        id: userId,
      },
      data: {
        email: user.email,
        primaryRole: user.primaryRole,
        secondaryRole: user.secondaryRole,
        summonerId: user.summonerId,
      },
    })
    .catch(next);

  const updatedUser = queryUser(userId);
  res.status(200).json({ user: updatedUser });
});

router.post('/register', async function (req, res, next) {
  const user = await AuthService.register(req.body);
  if (!process.env.NODE_ENV !== 'dev') {
    await sendEmail({
      from: 'jmankhan1@gmail.com',
      to: user.email,
      subject: 'Confirmation Code',
      text: `Confirm at ${process.env.DOMAIN}/confirm?code=${user.confirmationCode}`,
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${user.name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href="${process.env.DOMAIN}/confirm/${user.confirmationCode}">Click here</a>
        </div>`,
    });
  }

  try {
    const token = await AuthService.login(req.body);
    res
      .cookie('token', token, { httpOnly: true })
      .status(200)
      .json({
        message: `Confirmation email sent to ${user.email}`,
        user,
      });
  } catch (err) {
    next(new createHttpError.InternalServerError());
  }
});

router.post('/login', async function (req, res, next) {
  try {
    const token = await AuthService.login(req.body).catch(next);
    res.cookie('token', token, { httpOnly: true }).sendStatus(200);
  } catch (e) {
    next(new createHttpError.InternalServerError());
  }
});

router.get('/me', withAuth, async function (req, res, next) {
  const id = req.userId;
  const user = await queryUser(id).catch(next);

  res.json({ user });
});

router.post('/logout', withAuth, async function (req, res, next) {
  res.cookie('token', null).sendStatus(200);
});

router.get('/confirm', withAuth, async (req, res, next) => {
  const userId = req.userId;
  const user = await prisma.user
    .findUnique({
      where: {
        id: Number(userId),
      },
    })
    .catch(next);

  if (user.confirmationCode === req.query.code || user.verified) {
    await prisma.user
      .update({
        where: {
          id: Number(userId),
        },
        data: {
          verified: true,
        },
      })
      .catch(next);

    res.sendStatus(200);
  } else {
    next(new createHttpError.Unauthorized());
  }
});

export default router;
