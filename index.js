import Hapi from '@hapi/hapi'
import * as util from 'util';
import exec from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import fs from  'fs'

const execPromise = util.promisify(exec);

async function takePhoto() {
    const filename = `${uuidv4()}.jpeg`
    const {stdout, stderr} = await execPromise(`rpicam-still -o ${filename}`);
    console.log(`camera stdout: ${stdout}`);
    console.log(`camera stderr: ${stderr}`);

    const data = await fs.promises.readFile(filename, "binary");
    return Buffer.from(data);
}

const PORT = process.env.PORT || 3000

const init = async () => {

    const server = Hapi.server({
        port: PORT,
        host: '0.0.0.0'
    });

    server.route({
        method: 'GET',
        path: '/snapshot',
        handler: async (request, h) => {
            return h.response(await takePhoto())
                .type('image/jpeg')
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
