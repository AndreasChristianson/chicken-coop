import {readTemps} from "../temperature/index.js";

const convertTempsToProm = (temps) =>
    temps
        .map(temp => `coop_temp{name="${temp.name}",path="${temp.path}"} ${temp.c}`)
        .join("\n")


export const promHandler = async (request, h) => {
    const temps = await readTemps();
    // await readRelays();

    return h
        .response(`
# HELP coop_temp temperature in the coop in C.
# TYPE coop_temp gauge
${convertTempsToProm(temps)}
`);
}