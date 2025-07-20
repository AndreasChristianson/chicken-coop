import Hapi from '@hapi/hapi'
import {promisify} from 'node:util';
import child_process from 'node:child_process';
import {v4 as uuidv4} from 'uuid';
import Inert from '@hapi/inert'
import {Mutex} from 'async-mutex';
import fs from 'node:fs/promises';
import convert from "convert";

const thermistors = [
    {path: '/sys/bus/w1/devices/28-00000037cd2f', name: "one"},
    {path: '/sys/bus/w1/devices/28-0000005393bc', name: "two"},
    {path: '/sys/bus/w1/devices/28-0000005668d0', name: "three"},
    {path: '/sys/bus/w1/devices/28-000000bf3f2e', name: "four"},
]

const exec = promisify(child_process.exec);
const mutex = new Mutex();

async function takePhoto() {
    try {
        const filename = `/app/${uuidv4()}.jpeg`
        console.log(`filename: ${filename}`);
        const {stdout, stderr} = await mutex.runExclusive(async () => await exec(`rpicam-still -o ${filename}`));
        console.log(`camera stdout: ${stdout}`);
        console.log(`camera stderr: ${stderr}`);
        return filename;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function readTemp(path) {
    try {
        console.log(`reading ${path}`);
        const data = await fs.readFile(`${path}/w1_slave`, {encoding: 'utf8'});
        console.log(`raw data for ${path}:\n${data}`);
        if (!/crc=\d\d YES/g.test(data)) {
            return null
        }
        const temp = data.match(/.*t=(\d*)/g)[1] / 1000;
        return convert(temp, "fahrenheit").to("celsius");
    } catch (err) {
        console.error(err);
    }
    return null;
}

async function readTemps() {
    const promises = thermistors.map(async ({name, path}) => {
        console.log(`thermistor - ${name}: ${path}`);
        return {[name]: await readTemp(path)};
    })

    return await Promise.all(promises)
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
            return h.response("Snapshot error. See logs.").code(503)
        }
    });

    server.route({
        method: 'GET',
        path: '/temps',
        handler: async (request, h) => {
            return h.response(await readTemps());
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
