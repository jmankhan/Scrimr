import p from '@prisma/client';
import createError from 'http-errors';
const prisma = new p.PrismaClient();

import bcrypt from 'bcryptjs';
import jwt from '../utils/jwt.js';
import SummonerService from './summoner.service.js';

class AuthService {
  static async register(data) {
    const { email, password, summonerName } = data;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw createError(409, 'This user already exists');
    }

    const existingSummoner = await prisma.summoner.findFirst({
      where: {
        name: summonerName,
      },
    });

    if (existingSummoner?.isClaimed) {
      throw createError(500, 'This summoner is already claimed');
    }

    const riotSummoner = await SummonerService.getSummonerByName(summonerName);
    if (!riotSummoner) {
      throw createError(404, 'This summoner was not found');
    }
    const summoner = await prisma.summoner.upsert({
      where: {
        id: riotSummoner.id,
      },
      update: {
        ...riotSummoner,
      },
      create: {
        ...riotSummoner,
      },
    });

    const user = await prisma.user.create({
      data: {
        email,
        password: bcrypt.hashSync(password, 8),
        summoner: {
          connect: {
            id: summoner.id,
          },
        },
      },
    });
    data.accessToken = await jwt.signAccessToken(user);

    return data;
  }

  static async login(data) {
    const { email, password } = data;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw createError.NotFound('Invalid credentials');
    }
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword) throw createError(401, 'Invalid credentials');
    delete user.password;
    console.log('got kinda far');
    const accessToken = await jwt.signAccessToken(user);
    return accessToken;
  }

  static async getCurrentUser(token) {
    const result = await jwt.verifyAccessToken(token);
    return result.payload;
  }
}

export default AuthService;
