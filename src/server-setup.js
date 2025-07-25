import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'
import {tempHandler, tempsHandler} from "./temperature/index.js";
import {snapshotHandler} from "./snapshots/index.js";
import {PORT} from "./env.js";
import "./handle-rejection.js";
import {relayPatchHandler, relayStatusesHandler, relayStatusHandler} from "./relays/index.js";

export const init = async () => {

    const server = Hapi.server({
        port: PORT,
        host: '0.0.0.0'
    });

    await server.register(Inert);

    server.route({
        method: 'GET',
        path: '/api/snapshot.jpg',
        handler: snapshotHandler
    });

    server.route({
        method: 'GET',
        path: '/api/temps/{name}',
        handler: tempHandler
    });

    server.route({
        method: 'GET',
        path: '/api/temps',
        handler: tempsHandler
    });

    server.route({
        method: 'GET',
        path: '/api/relays',
        handler: relayStatusesHandler
    });

    server.route({
        method: 'GET',
        path: '/api/relays/{name}',
        handler: relayStatusHandler
    });

    server.route({
        method: 'PATCH',
        path: '/api/relays/{name}',
        handler: relayPatchHandler
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};
