import {promisify} from 'node:util';
import child_process from 'node:child_process';
import {v4 as uuidv4} from 'uuid';
import {Mutex} from 'async-mutex';

const exec = promisify(child_process.exec);
const mutex = new Mutex();

const takePhoto = async () => {
    const filename = `/app/${uuidv4()}.jpeg`
    console.log(`filename: ${filename}`);
    const {stdout, stderr} = await mutex.runExclusive(async () => await exec(`rpicam-still --rotation 90 -o ${filename}`));
    console.log(`camera stdout: ${stdout}`);
    console.log(`camera stderr: ${stderr}`);
    return filename;
}

export const snapshotHandler = async (request, h) => {
    const snapshot = await takePhoto();
    return h.file(snapshot)
}