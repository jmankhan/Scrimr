import p from '@prisma/client';
const prisma = new p.PrismaClient();

import bcrypt from 'bcryptjs';
import jwt from '../utils/jwt.js';

class AuthService {
  static async register(data) {
      const { email } = data;
      const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

      if(existingUser) {
        throw createError(409, 'This user already exists');
      }

      data.password = bcrypt.hashSync(data.password, 8);
      const user = await prisma.user.create({
          data
      })
      data.accessToken = await jwt.signAccessToken(user);
      return data;
    }

    static async login(data) {
        const { email, password } = data;
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            throw createError.NotFound('Invalid credentials');
        }
        const checkPassword = bcrypt.compareSync(password, user.password)
        if (!checkPassword) throw createError(401, 'Invalid credentials');
        delete user.password
        const accessToken = await jwt.signAccessToken(user)
        return { ...user, accessToken }
    }

    static async all() {
        const allUsers = await prisma.user.findMany();
        return allUsers;
    }

    static async getCurrentUser(token) {
      const result = await jwt.verifyAccessToken(token)
      return result.payload;
    }
}

export default AuthService;
