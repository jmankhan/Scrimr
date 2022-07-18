import express from 'express';
const router = express.Router();
import AuthService from '../services/auth.service.js';
import withAuth from '../middlewares/auth.js';
import p from '@prisma/client';
import { sendEmail } from '../utils/email.js';
const prisma = new p.PrismaClient();

router.get('/profile', withAuth, async function (req, res) {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return res.json({ user });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch('/profile', withAuth, async function (req, res, next) {
  const userId = req.userId;
  const user = req.body.user;

  if (userId !== user.id) {
    res.status(400);
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        email: user.email,
        primaryRole: user.primaryRole,
        secondaryRole: user.secondaryRole,
        summonerId: user.summonerId,
      },
    });
    res.status(200).json({ user: updatedUser });
  } catch (e) {
    res.status(500).json({ message: err });
  }
});

router.post('/register', async function (req, res, next) {
  try {
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

    const token = await AuthService.login(req.body);
    res
      .cookie('token', token, { httpOnly: true })
      .status(200)
      .json({
        message: `Confirmation email sent to ${user.email}`,
        user,
      });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post('/login', async function (req, res, next) {
  try {
    const token = await AuthService.login(req.body);
    res.cookie('token', token, { httpOnly: true }).sendStatus(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/me', withAuth, async function (req, res, next) {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        summoner: true,
      },
    });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post('/logout', withAuth, async function (req, res, next) {
  res.cookie('token', null).sendStatus(200);
});

router.get('/confirm', withAuth, async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (user.confirmationCode === req.query.code || user.verified) {
      await prisma.user.update({
        where: {
          id: Number(userId),
        },
        data: {
          verified: true,
        },
      });

      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

export default router;
