import fs from "node:fs/promises";
import convert from "convert";
import thermistors from "./thermistors.js";

const readTemp = async (path) => {
    try {
        const data = await fs.readFile(`${path}/w1_slave`, {encoding: 'utf8'});
        console.log(`raw data for ${path}:\n${data}`);
        if (!/crc=.. YES/.test(data)) {
            console.log(`${path}: no crc match`);
            return null
        }
        const c = data.match(/.*t=(\d*)/)[1] / 1000;
        console.log(`${path}: ${c}C`);
        const f = convert(c, "celsius").to("fahrenheit");
        return `${f.toFixed(2)}f`
    } catch (err) {
        console.error(err);
    }
    return null;
}

export const readTemps = async () => {
    const promises = thermistors.map(async ({name, path}) => {
        return {[name]: await readTemp(path)};
    })

    return await Promise.all(promises)
}