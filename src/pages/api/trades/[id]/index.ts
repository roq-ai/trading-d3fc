import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { tradeValidationSchema } from 'validationSchema/trades';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.trade
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getTradeById();
    case 'PUT':
      return updateTradeById();
    case 'DELETE':
      return deleteTradeById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTradeById() {
    const data = await prisma.trade.findFirst(convertQueryToPrismaUtil(req.query, 'trade'));
    return res.status(200).json(data);
  }

  async function updateTradeById() {
    await tradeValidationSchema.validate(req.body);
    const data = await prisma.trade.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteTradeById() {
    const data = await prisma.trade.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
