import express from 'express';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import next from 'next';

module.exports = { run };

function run() {
  const port = Number(process.env.PORT || '3000');
  const app = next({ dev: !IS_PRODUCTION });
  const handle = app.getRequestHandler();

  const server = express();
  server.disable('x-powered-by');
  server.use(compress());
  server.use(cookieParser());

  app.prepare().then(() => {
    // server.get('/customRoute', (req, res) => {
    //   return app.render(req, res, '/customRoute', req.query);
    // });

    server.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, () => {
      // tslint:disable-next-line:no-console
      console.log(
        `> ${
          IS_PRODUCTION ? 'Production' : 'Development'
        } server listening on http://localhost:${port}`
      );
    });
  });
}
