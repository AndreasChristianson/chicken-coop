import Hapi from '@hapi/hapi'
import {promisify} from 'node:util';
import child_process from 'node:child_process';
import {v4 as uuidv4} from 'uuid';
import Inert from '@hapi/inert'

const exec = promisify(child_process.exec);

async function takePhoto() {

    try {
        const filename = `/app/${uuidv4()}.jpeg`
        console.log(`filename: ${filename}`);
        const {stdout, stderr} = await exec(`rpicam-still -o ${filename}`);
        console.log(`camera stdout: ${stdout}`);
        console.log(`camera stderr: ${stderr}`);
        return filename;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const PORT = process.env.PORT || 3000

const init = async () => {

    const server = Hapi.server({
        port: PORT,
        host: '0.0.0.0'
    });

    await server.register(Inert);

    server.route({
        method: 'GET',
        path: '/snapshot.jpg',
        handler: async (request, h) => {
            const snapshot = await takePhoto();
            if (snapshot) {
                return h.file(snapshot)
            }
            return h.response("Snapshot error. One in flight").code(503)
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init()
    .then(r => console.log("server started"));
