import logger from 'ylz-logger';

// import IConfig from './config/IConfig';
import config from './config';
import Server from './Server';
import * as Database from './services/Database';


logger.debug( 'Initial Configuration:', config );

const { nodeEnv, port, mongoUrl } = config;

const server = Server.getInstance(config).application.listen(port);

server.on('listening', () => {
   const ann = `|| App is running at port '${port}' in '${nodeEnv}' mode ||`;
   logger.debug(`
      ${ann.replace(/[^]/g, "-")}
      ${ann}
      ${ann.replace(/[^]/g, "-")}
      ${"Press CTRL-C to stop"}
   `);

   Database.open(mongoUrl)
      .then(() => {
         logger.debug('Database connected.');

         Database.createInitials(['LH']);
      })
      .catch(err => {
         logger.error('::: GOT ERROR WHEN CONNECTING TO THE DATABASE :::');
         logger.error( err );
      });
});

server.on('error', (err) => {
   logger.error('::: GOT ERROR IN STARTING SERVER :::');
   logger.error( err );
});