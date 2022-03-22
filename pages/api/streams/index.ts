import type { ResponseType } from '@customTypes/index';
import { client, withApiSession, withHandler } from '@libs/server/index';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  switch (req.method) {
    case 'GET':
      const streams = await client.stream.findMany({
        take: 10,
        skip: 0,
      });
      return res.json({
        ok: true,
        streams,
      });
    case 'POST':
      const {
        body: { name, price, description },
        session: { user },
      } = req;
      const {
        result: {
          uid,
          rtmps: { url, streamKey },
        },
      } = await (
        await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/stream/live_inputs`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.CF_STREAM_TOKEN}`,
          },
          body: `{"meta": {"name":"${name}"},"recording": { "mode": "automatic", "timeoutSeconds": 10}}`,
        })
      ).json();
      const stream = await client.stream.create({
        data: {
          name,
          price: +price,
          description,
          cloudflareId: uid,
          cloudflareUrl: url,
          cloudflareKey: streamKey,
          user: {
            connect: {
              id: user?.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      return res.json({
        ok: true,
        stream,
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
    methods: ['GET', 'POST'],
    handler,
  }),
);
