import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOption = {
  cookieName: 'carrotsession',
  password: process.env.COOKIE_PASSWORD!,
};

export function withApiSession(handlerFn: NextApiHandler<any>) {
  return withIronSessionApiRoute(handlerFn, cookieOption);
}
