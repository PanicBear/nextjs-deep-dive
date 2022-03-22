import type { ResponseType } from '@customTypes/index';
import { client, withApiSession, withHandler } from '@libs/server/index';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const {
    query: { id },
    body,
    session: { user },
  } = req;
  switch (req.method) {
    case 'GET':
      if (!user || !user.id) {
        return res.json({
          ok: false,
          message: 'data not found',
        });
      }
      const users = await client.chatRoom.findMany({
        where: {
          productId: +id,
        },
        select: {
          buyer: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });
      return res.json({
        ok: true,
        users,
      });
    case 'POST':
      const product = await client.product.update({
        where: {
          id: +id,
        },
        data: {
          state: 'booked',
        },
      });
      if (product) {
        const purchase = await client.purchase.create({
          data: {
            user: {
              connect: {
                id: +body.id,
              },
            },
            product: {
              connect: {
                id: product.id,
              },
            },
          },
        });
        return res.json({ ok: Boolean(purchase) });
      }
      return res.json({ ok: false, message: "could't update state of product" });
    default:
      return res.json({
        ok: false,
        message: `${req.method} is not allowed`,
      });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler,
  }),
);
