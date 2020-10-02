import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

module.exports = { run };

function run() {
  const port = Number(process.env.PORT || '3000');
  const app = next({ dev: !IS_PRODUCTION });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    }).listen(port);

    // tslint:disable-next-line:no-console
    console.log(
      `> ${
        IS_PRODUCTION ? 'Production' : 'Development'
      } server listening on http://localhost:${port}`
    );
  });
}
