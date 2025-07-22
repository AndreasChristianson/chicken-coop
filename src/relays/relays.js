import {Gpio} from "onoff";

const relays = [
    {gpio: new Gpio(23, "out"), name: "socket"},
    {gpio: new Gpio(24, "out"), name: "outlet"},
]

process.on('SIGINT', _ => {
    relays.map(({gpio}) => gpio.unexport());
});

export default relays;

