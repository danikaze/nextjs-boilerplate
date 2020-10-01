// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiResponse, NextApiRequest } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200;
  res.json({ name: 'John Doe' });
};
