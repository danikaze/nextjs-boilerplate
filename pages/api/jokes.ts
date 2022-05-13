// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { restApiHandler } from '@api';
import { csrfProtection } from '@utils/api/csrf';
import { jokesApiHandler } from '@api/jokes';

export default restApiHandler(
  { GET: jokesApiHandler },
  // note that the default `ignoreMethods` is ['GET', 'HEAD', 'OPTIONS']
  // and this tries to protect a GET route...
  csrfProtection({ ignoreMethods: ['HEAD', 'OPTIONS'] })
);
