import type { ResponseType } from '@customTypes/index';
import { client, withApiSession, withHandler } from '@libs/server/index';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  switch (req.method) {
    case 'GET':
      const products = await client.product.findMany({
        include: {
          _count: {
            select: {
              favs: true,
            },
          },
        },
      });
      res.json({
        ok: true,
        products,
      });
      break;
    case 'POST':
      const {
        body: { name, price, description, photoId },
        session: { user },
      } = req;
      const product = await client.product.create({
        data: {
          name,
          price: +price,
          description,
          imageUrl: photoId ?? null,
          user: {
            connect: {
              id: user?.id,
            },
          },
        },
      });
      const sale = await client.sale.create({
        data: {
          product: {
            connect: {
              id: product.id,
            },
          },
          user: {
            connect: {
              id: product.userId,
            },
          },
        },
      });
      res.json({
        ok: true,
        product,
        sale: Boolean(sale),
      });
      break;
    case 'PUT':
    case 'DELETE':
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
