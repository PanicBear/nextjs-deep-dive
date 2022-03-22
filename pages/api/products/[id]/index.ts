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
      const product = await client.product.findUnique({
        where: {
          id: +id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });
      const terms = product?.name.split(' ').map((word) => ({ name: { contains: word } }));
      const relatedProducts = await client.product.findMany({
        where: {
          OR: terms,
          NOT: {
            id: product?.id,
          },
        },
      });
      const isLiked = Boolean(
        await client.fav.findFirst({
          where: {
            userId: user?.id,
            productId: product?.id,
          },
          select: { id: true },
        }),
      );
      res.json({
        ok: true,
        product,
        isLiked,
        relatedProducts,
      });
      break;
    default:
      return res.json({
        ok: false,
        message: 'Method not allowed',
      });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  }),
);
