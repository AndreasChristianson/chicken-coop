import {promisify} from 'node:util';
import child_process from 'node:child_process';
import {v4 as uuidv4} from 'uuid';
import {Mutex} from 'async-mutex';

const exec = promisify(child_process.exec);
const mutex = new Mutex();

const takePhoto = async () => {
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

export const snapshotHandler = async (request, h) => {
    const snapshot = await takePhoto();
    if (snapshot) {
        return h.file(snapshot)
    }
    return h.response("Snapshot error. See logs.").code(503)
}