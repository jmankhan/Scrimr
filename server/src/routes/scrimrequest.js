import express from 'express';
const router = express.Router();

import prisma from '../utils/prisma.js';
import withAuth from '../middlewares/auth.js';
import { createScrimRequest, notifyUser } from '../services/index.js';
import { SCRIMREQUEST_STATUS, SOCKET_EVENTS } from '../utils/constants.js';
import createHttpError from 'http-errors';

router.get('/:id', withAuth, async (req, res, next) => {
  const requestId = req.params.id;
  const scrimRequest = await prisma.ScrimRequest.findUnique({
    where: {
      id: Number(requestId),
      include: {
        user: {
          include: {
            summoner: true,
          },
        },
        scrim: true,
      },
    },
  }).catch(next);

  if (scrimRequest.userId === req.userId) {
    res.status(200).json({ scrimRequest });
  }

  next(new createHttpError.Unauthorized());
});

router.post('/', withAuth, async (req, res, next) => {
  const scrimRequest = await createScrimRequest(req.body.scrimId, req.userId, req.body.type).catch(next);
  res.status(200).json({ scrimRequest });
});

router.patch('/:id', withAuth, async (req, res, next) => {
  const requestId = req.params.id;

  // preserve the initial userId, we will discard the approver id entirely
  const newScrimRequest = await prisma.ScrimRequest.update({
    where: {
      id: Number(requestId),
    },
    data: {
      ...req.body,
    },
  }).catch(next);

  const status = req.body.status;
  if (status && status === SCRIMREQUEST_STATUS.APPROVE) {
    await notifyUser(req, SOCKET_EVENTS.JOIN_SCRIM_APPROVE, newScrimRequest);
  }
  res.status(200).json({ scrimRequest: newScrimRequest });
});

export default router;
