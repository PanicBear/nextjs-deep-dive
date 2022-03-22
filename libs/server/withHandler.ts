import { NextApiRequest, NextApiResponse } from 'next';

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

type Method = 'POST' | 'GET' | 'DELETE' | 'PUT';

interface HandlerConfig {
  methods: Method[];
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  isPrivate?: boolean;
}

export default function withHandler({ methods, handler, isPrivate = true }: HandlerConfig) {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
    if (req.method && !methods.includes(req.method as Method)) {
      return res.status(405).end();
    }
    if (isPrivate && !req.session.user) {
      return res.status(401).json({ ok: false, error: 'Login required' });
    }
    try {
      handler(req, res);
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
}
