import relays from "./relays.js";


const getStatuses = async () => {
    const promises = relays
        .map(async ({gpio, name}) => ({
            [name]: await gpio.read()
        }))

    return Promise.all(promises);
}

export const relayStatusHandler = async (request, h) => {
    return h.response(await getStatuses());
}