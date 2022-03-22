import type { ResponseType } from '@customTypes/index';
import { withApiSession, withHandler } from '@libs/server/index';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  res.json({
    ok: true,
    url: '',
  });
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler,
  }),
);
