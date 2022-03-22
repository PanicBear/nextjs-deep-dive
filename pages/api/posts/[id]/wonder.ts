import type { ResponseType } from '@customTypes/index';
import { client, withApiSession, withHandler } from '@libs/server/index';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  switch (req.method) {
    case 'POST':
      const {
        query: { id },
        session: { user },
      } = req;
      const alreadyExists = await client.wondering.findFirst({
        where: {
          userId: user?.id,
          postId: +id,
        },
        select: {
          id: true,
        },
      });
      if (alreadyExists) {
        await client.wondering.delete({
          where: {
            id: alreadyExists.id,
          },
        });
      } else {
        await client.wondering.create({
          data: {
            user: {
              connect: {
                id: user?.id,
              },
            },
            post: {
              connect: {
                id: +id,
              },
            },
          },
        });
      }
      res.json({
        ok: true,
      });
      break;
    case 'GET':
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
    methods: ['POST'],
    handler,
  }),
);
