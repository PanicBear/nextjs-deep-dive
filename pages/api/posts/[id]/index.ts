import type { ResponseType } from '@customTypes/index';
import { client, withApiSession, withHandler } from '@libs/server/index';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  switch (req.method) {
    case 'GET':
      const {
        query: { id },
        session: { user },
      } = req;
      const post = await client.post.findUnique({
        where: {
          id: +id,
        },
        include: {
          answers: {
            select: {
              answer: true,
              id: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
            // take: 10,
            // skip: 20,
          },
          _count: {
            select: {
              wonderings: true,
              answers: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });
      const isWondered = Boolean(
        await client.wondering.findFirst({
          where: {
            userId: user?.id,
            postId: +id,
          },
          select: {
            id: true,
          },
        }),
      );
      res.json({
        ok: true,
        post,
        isWondered,
      });
      break;
    case 'POST':
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
    methods: ['GET'],
    handler,
  }),
);
