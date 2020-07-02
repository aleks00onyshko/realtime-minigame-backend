import * as http from 'http';

import { Container } from 'DI';
import { Server } from './server';

const server = Container.injectSingleton(Server);

http.createServer(server.app).listen(server.getPort(), () => {
  console.log(`Server is listening on port ${server.getPort()}`);
});
