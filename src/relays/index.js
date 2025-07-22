import relays from "./relays.js";
import {Gpio} from "onoff";

const statusMap = {
    [Gpio.HIGH]: "on",
    [Gpio.LOW]: "off"
}

const getStatus = async (gpio) => {
    const status = await gpio.read()
    return statusMap[status];
}

const getStatuses = async () => {
    const promises = relays
        .map(async ({gpio, name}) => ({
            [name]: await getStatus(gpio)
        }))

    return Promise.all(promises);
}

export const relayStatusHandler = async (request, h) => {
    return h.response(await getStatuses());
}