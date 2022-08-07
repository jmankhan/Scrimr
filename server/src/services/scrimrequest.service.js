import prisma from '../utils/prisma';
import { SCRIMREQUEST_STATUS } from '../utils/constants';

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
