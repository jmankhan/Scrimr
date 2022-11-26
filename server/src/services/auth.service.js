import prisma from '../utils/prisma.js';
import createHttpError from 'http-errors';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from '../utils/jwt.js';
import { SummonerService } from './';

export class AuthService {
  static async register(data) {
    const { email, password, summonerName } = data;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw createHttpError(409, 'This user already exists', { validation: true });
    }

    const existingSummoner = await prisma.summoner.findFirst({
      where: {
        name: summonerName,
      },
    });

    if (existingSummoner?.isClaimed) {
      throw createHttpError(500, 'This summoner is already claimed', { validation: true });
    }

    const riotSummoner = await SummonerService.getSummonerByName(summonerName);
    if (!riotSummoner) {
      throw createHttpError(404, 'This summoner was not found', { validation: true });
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

    const confirmationCode = crypto.randomBytes(32).toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
    const user = await prisma.user.create({
      data: {
        email,
        confirmationCode,
        password: bcrypt.hashSync(password, 8),
        name: summonerName,
        summoner: {
          connect: {
            id: summoner.id,
          },
        },
      },
    });
    data.accessToken = await jwt.signAccessToken({ id: user.id });
    const fullUser = await prisma.user
      .findUnique({
        where: {
          id: user.id,
        },
        include: {
          summoner: true,
        },
      })
      .catch((err) => {
        throw createHttpError(404, err);
      });
    return { ...fullUser };
  }

  static async login(data) {
    const { email, password } = data;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw createHttpError.NotFound('Invalid credentials');
    }
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword) throw new createHttpError.Unauthorized();
    const accessToken = await jwt.signAccessToken({ id: user.id });
    return accessToken;
  }

  static async getCurrentUser(token) {
    const result = await jwt.verifyAccessToken(token);
    return result.payload;
  }
}
