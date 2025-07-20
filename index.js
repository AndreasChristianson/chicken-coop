import Hapi from '@hapi/hapi'
import {promisify} from 'node:util';
import child_process from 'node:child_process';
import {v4 as uuidv4} from 'uuid';

const exec = promisify(child_process.exec);

async function takePhoto() {
    const filename = `/app/${uuidv4()}.jpeg`
    console.log(`filename: ${filename}`);
    const {stdout, stderr} = await exec(`rpicam-still -o ${filename}`);
    console.log(`camera stdout: ${stdout}`);
    console.log(`camera stderr: ${stderr}`);

    return filename;
}

const PORT = process.env.PORT || 3000

const init = async () => {

    const server = Hapi.server({
        port: PORT,
        host: '0.0.0.0'
    });

    server.route({
        method: 'GET',
        path: '/snapshot.jpg',
        handler: async (request, h) => {
            return h.file(await takePhoto())
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
