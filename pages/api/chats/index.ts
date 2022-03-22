import type { ResponseType } from '@customTypes/index';
import { client, withApiSession, withHandler } from '@libs/server/index';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  switch (req.method) {
    case 'GET':
      const {
        session: { user },
      } = req;
      if (!user || !user.id) {
        return res.json({
          ok: false,
          message: 'cannot get user data',
        });
      }
      const chatRooms = await client.chatRoom.findMany({
        where: {
          OR: [
            {
              product: {
                userId: user.id,
              },
            },
            {
              buyerId: user.id,
            },
          ],
        },
        select: {
          id: true,
          buyer: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          product: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
          },
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      });
      return res.json({
        ok: true,
        chatRooms,
      });
    default:
      return res.json({
        ok: false,
        message: `${req.method} is not allowed`,
      });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  }),
);
