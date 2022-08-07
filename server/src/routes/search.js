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
  });

  // allow exact matches to be selectable options
  if (!records.find((r) => r.name === value)) {
    records.unshift({
      id: value,
      name: value,
    });
  }

  res.json({ results: records });
});

export default router;
