import * as http from 'http';

import server from './server';

http.createServer(server.app).listen(server.getPort(), () => {
  console.log(`Server is listening on port ${server.getPort()}`);
});
