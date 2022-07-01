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
    res.status(e.statusCode).json({ message: e.message });
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
    next(e);
  }
});

router.post('/register', async function (req, res, next) {
  try {
    const user = await AuthService.register(req.body);
    await sendEmail({
      from: 'noreply@scrimr.gg',
      to: user.email,
      subject: 'Confirmation Code',
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${user.name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href="${process.env.DOMAIN}/confirm/${confirmationCode}">Click here</a>
        </div>`,
    });

    res.status(200).json({
      message: 'Confirmation email sent',
      user,
    });
  } catch (e) {
    next(e);
  }
});

router.post('/login', async function (req, res, next) {
  try {
    const token = await AuthService.login(req.body);
    res.cookie('token', token, { httpOnly: true }).sendStatus(200);
  } catch (e) {
    res.status(e.statusCode).json({ message: e.message });
  }
});

router.get('/me', withAuth, async function (req, res, next) {
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
});

router.post('/logout', withAuth, async function (req, res, next) {
  res.cookie('token', null).sendStatus(200);
});

router.get('/confirm/:code', withAuth, async (req, res, next) => {
  const userId = req.userId;
});

export default router;
