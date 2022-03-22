import { ProductState } from '.prisma/client';
import type { ResponseType } from '@customTypes/index';
import { client, withApiSession, withHandler } from '@libs/server/index';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  switch (req.method) {
    case 'GET':
      return res.json({
        ok: true,
      });
    case 'POST':
      const {
        body: { id, kind },
        session: { user },
      } = req;
      const isSeller = Boolean(
        await client.product.findFirst({
          where: {
            userId: user?.id,
            id: +id,
          },
        }),
      );
      if (!isSeller) {
        return res.json({ ok: false, message: 'only seller can change state with product' });
      }
      switch (kind as ProductState) {
        case 'onList':
          const product = await client.product.update({
            where: {
              id: +id,
            },
            data: {
              state: 'onList',
            },
          });
          if (product) {
            const isDeleted = await client.purchase.deleteMany({
              where: {
                productId: product.id,
              },
            });
            return res.json({ ok: Boolean(isDeleted) });
          }
          return res.json({ ok: false });
        case 'sold':
          const isUpdated = await client.product.update({
            where: {
              id: +id,
            },
            data: {
              state: 'sold',
            },
          });
          return res.json({ ok: Boolean(isUpdated) });
        default:
          return res.json({
            ok: false,
            message: 'unknown product state',
          });
      }
    default:
      res.json({
        ok: false,
        message: 'Method not allowed',
      });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler,
  }),
);
