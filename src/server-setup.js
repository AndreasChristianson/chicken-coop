import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'
import {tempsHandler} from "./temperature/index.js";
import {snapshotHandler} from "./snapshots/index.js";
import {PORT} from "./env.js";
import "./handle-rejection.js";

export const init = async () => {

    const server = Hapi.server({
        port: PORT,
        host: '0.0.0.0'
    });

    await server.register(Inert);

    server.route({
        method: 'GET',
        path: '/snapshot.jpg',
        handler: snapshotHandler
    });

    server.route({
        method: 'GET',
        path: '/temps',
        handler: tempsHandler
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};
