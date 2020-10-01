// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiResponse, NextApiRequest } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const HTTP_OK = 200;
  res.statusCode = HTTP_OK;
  res.json({ name: 'John Doe' });
};
