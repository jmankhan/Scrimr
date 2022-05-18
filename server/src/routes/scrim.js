import express from 'express';
import p from '@prisma/client';

const router = express.Router();
const prisma = new p.PrismaClient();
import requireAuth from '../middlewares/auth';
import AuthService from '../services/auth.service';

router.get('/', async (req, res, next) => {
  const records = prisma.scrim.findMany();
  res.json({
    scrims: records
  });
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const jwtUser = await AuthService.getCurrentUser(token);

    const result = await prisma.scrim.create({
      data: {
        hostId: jwtUser.id
      }
    })
    res.json({ teams: [], pool: [], ...result});
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: 'An error occurred creating this scrim'
    })
  }
})

router.get('/:id', async (req, res, next) => {
  const record = await prisma.scrim.findUnique({
    where: { id: Number(req.params.id) }
  });

  if(!record) {
    res.statusCode(404)
  }

  res.json(record);
});

router.patch('/:id', async (req, res, next) => {
  try {
    await prisma.scrim.update({
      where: {
        id: Number(req.params.id)
      },
      data: {
        ...req.body
      }
    });

    res.status(200).json({
      message: 'Success'
    });
  } catch(err) {
    res.status(500).json({
      message: 'An error occurred updating the scrim'
    })
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.scrim.delete({
      where: {
        id: Number(req.params.id)
      }
    });
    res.json({
      message: 'Success'
    })
  } catch(err) {
    res.status(500).json({
      message: 'An error occurred deleting this scrim'
    })
  }
})

export default router;
