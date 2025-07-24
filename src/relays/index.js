import relays from "./relays.js";
import {Gpio} from "onoff";

const statusMap = {
    [Gpio.HIGH]: "on",
    [Gpio.LOW]: "off"
}

const reverseStatusMap = {
    "on": Gpio.HIGH,
    "off": Gpio.LOW
}

const getRelay = async (name) => {
    const {relay, pin} = relays[name];
    const status = statusMap[await relay.read()];
    return {
        status,
        pin,
        name
    }
}

const setRelay = async (name, newStatus) => {
    const {relay} = relays[name];
    await relay.write(newStatus);
}

const getRelays = async () => {
    const promises = Object.keys(relays)
        .map(getRelay)

    return Promise.all(promises);
}

export const relayStatusesHandler = async (request, h) => {
    return h.response(await getRelays());
}

export const relayStatusHandler = async (request, h) => {
    return h.response(await getRelay(request.params.name));
}

export const relayPatchHandler = async (request, h) => {
    try {
        if (!relays[request.params.name]) {
            return h.status(404);
        }
        console.log(request.payload)
        const body = request.payload;
        if (!body) {
            return h.status(400);
        }
        const newStatus = reverseStatusMap[body.status];
        if (!newStatus) {
            return h.status(400);
        }
        await setRelay(request.params.name, newStatus);
        return h
            .response(await getRelay(request.params.name))
            .status(202);
    } catch (err) {
        console.error(err);
        throw err;
    }
}