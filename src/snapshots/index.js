import {promisify} from 'node:util';
import child_process from 'node:child_process';
import {v4 as uuidv4} from 'uuid';
import {Mutex} from 'async-mutex';
import sharp from 'sharp'

const exec = promisify(child_process.exec);
const mutex = new Mutex();

const takePhoto = async () => {
    const uuid = uuidv4();
    const filename = `/app/${uuid}.jpeg`
    console.log(`filename: ${filename}`);
    const {stdout, stderr} = await mutex.runExclusive(async () => await exec(`rpicam-still -o ${filename}`));
    console.log(`camera stdout: ${stdout}`);
    console.log(`camera stderr: ${stderr}`);
    const rotatedFilename = `/app/${uuid}-out.jpeg`
    await sharp(filename)
        .rotate(90)
        .toFile(rotatedFilename);
    return rotatedFilename;
}

export const snapshotHandler = async (request, h) => {
    const snapshot = await takePhoto();
    return h.file(snapshot)
}