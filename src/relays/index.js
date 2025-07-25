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
    const foundRelay = relays[name];
    if (!foundRelay) {
        throw Boom.notFound(name)
    }
    const {relay, pin} = foundRelay;
    const status = statusMap[await relay.read()];
    return {
        status,
        pin,
        name
    }
}

const setRelay = async (name, status) => {
    const foundRelay = relays[name];
    if (!foundRelay) {
        throw Boom.notFound(name)
    }
    const {relay} = foundRelay;

    const newStatus = reverseStatusMap[status];
    if (!newStatus) {
        throw new Boom.badRequest(status)
    }

    await relay.write(newStatus);
}

export const relayStatusesHandler = (request, h) => {
    const promises = Object.keys(relays)
        .map(getRelay)

    return h.response(Promise.all(promises));
}

export const relayStatusHandler = (request, h) => {
    return h.response(getRelay(request.params.name));
}

export const relayPatchHandler = async (request, h) => {
    if (!relays[request.params.name]) {
        throw Boom.notFound(request.params.name);
    }
    const body = request.payload;
    if (!body) {
        throw Boom.badRequest("no body");
    }
    await setRelay(request.params.name, body.status);
    return h
        .response(await getRelay(request.params.name))
        .code(202);
}