import express from 'express';
const router = express.Router();

import prisma from '../utils/prisma.js';

router.get('/', async (req, res, next) => {
  const value = req.query.q;
  const records = await prisma.summoner.findMany({
    where: {
      name: {
        contains: value.replace(/[\\$'"]/g, '\\$&'),
        mode: 'insensitive',
      },
    },
    take: 4
  });

  res.json({ results: records });
});

export default router;
