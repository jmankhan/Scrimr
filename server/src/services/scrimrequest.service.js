import prisma from '../utils/prisma.js';
import { SCRIMREQUEST_STATUS } from '../utils/constants.js';

export const createScrimRequest = async (scrimId, userId, type) => {
  return prisma.ScrimRequest.create({
    data: {
      scrimId: Number(scrimId),
      userId: Number(userId),
      type,
      status: SCRIMREQUEST_STATUS.PENDING,
    },
  });
};
