import relays from "./relays.js";
import Boom from '@hapi/boom';
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
    if (!name in relays) {
        throw Boom.notFound(name)
    }
    const {relay, pin} = relays[name];;
    try {
        const status = statusMap[await relay.read()];
        return {
            status,
            pin,
            name
        }
    } catch (err) {
        throw Boom.badImplementation(err);
    }

}

const setRelay = async (name, status) => {
    if (!name in relays) {
        throw Boom.notFound(name)
    }
    const {relay} = relays[name];


    if (!status in reverseStatusMap) {
        throw new Boom.badRequest(status)
    }
    const newStatus = reverseStatusMap[status];

    try {
        await relay.write(newStatus);
    } catch (err) {
        throw Boom.badImplementation(err);
    }
}

export const readRelays = async () => {
    const promises = Object.keys(relays)
        .map(getRelay)

    return await Promise.all(promises);
}

export const relayStatusesHandler = async (request, h) => {
    return h.response(await readRelays());
}

export const relayStatusHandler = async (request, h) => {
    return h.response(await getRelay(request.params.name));
}

export const relayPatchHandler = async (request, h) => {
    const body = request.payload;
    if (!body) {
        throw Boom.badRequest("no body");
    }
    await setRelay(request.params.name, body.status);
    return h
        .response(await getRelay(request.params.name))
        .code(202);
}