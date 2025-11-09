import fs from "node:fs/promises";
import convert from "convert";
import thermistors from "./thermistors.js";
import Boom from "@hapi/boom";

const readTemp = async (name) => {
    if (!name in thermistors) {
        throw Boom.notFound(name);
    }
    const {path} = thermistors[name];
    const data = await fs.readFile(`${path}/w1_slave`, {encoding: 'utf8'});
    console.log(`raw data for ${path}:\n${data}`);
    if (!/crc=.. YES/.test(data)) {
        console.log(`${path}: no crc match`);
        return {
            name,
            path,
            data,
            crcPass: false,
            f: null,
            c: null,
        }
    }
    const c = data.match(/.*t=(-?\d*)/)[1] / 1000;
    console.log(`${path}: ${c}C`);
    const f = convert(c, "celsius").to("fahrenheit");
    return {
        name,
        path,
        data,
        crcPass: true,
        f: f.toFixed(2),
        c: c.toFixed(2)
    }

}

export const readTemps = async () => {
    const promises = Object.keys(thermistors)
        .map(readTemp);

    return await Promise.all(promises);
}

export const tempsHandler = async (request, h) => {
    return h.response(await readTemps());
}

export const tempHandler = async (request, h) => {
    return h.response(await readTemp(request.params.name));
}
