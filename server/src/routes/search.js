import express from 'express';
import p from '@prisma/client';

const prisma = new p.PrismaClient();
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
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

    res.json({
      results: records,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

export default router;
