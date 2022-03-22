import type { ResponseType } from '@customTypes/index';
import { client, withApiSession, withHandler } from '@libs/server/index';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  switch (req.method) {
    case 'POST':
      const {
        body,
        query: { id },
        session: { user },
      } = req;
      const message = await client.message.create({
        data: {
          message: body.message,
          stream: {
            connect: {
              id: +id,
            },
          },
          user: {
            connect: {
              id: user?.id,
            },
          },
        },
      });
      return res.json({
        ok: true,
        message,
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
    methods: ['POST'],
    handler,
  }),
);
