import {Gpio} from "onoff";
/*
gpiochip0: GPIOs 512-565, parent: platform/20200000.gpio, pinctrl-bcm2835:
 gpio-512 (ID_SDA              )
 gpio-513 (ID_SCL              )
 gpio-514 (GPIO2               )
 gpio-515 (GPIO3               )
 gpio-516 (GPIO4               |onewire@0           ) out hi
 gpio-517 (GPIO5               )
 gpio-518 (GPIO6               )
 gpio-519 (GPIO7               )
 gpio-520 (GPIO8               )
 gpio-521 (GPIO9               )
 gpio-522 (GPIO10              )
 gpio-523 (GPIO11              )
 gpio-524 (GPIO12              )
 gpio-525 (GPIO13              )
 gpio-526 (GPIO14              )
 gpio-527 (GPIO15              )
 gpio-528 (GPIO16              )
 gpio-529 (GPIO17              )
 gpio-530 (GPIO18              )
 gpio-531 (GPIO19              )
 gpio-532 (GPIO20              )
 gpio-533 (GPIO21              )
 gpio-534 (GPIO22              )
 gpio-535 (GPIO23              )
 gpio-536 (GPIO24              )
 gpio-537 (GPIO25              )
 gpio-538 (GPIO26              )
 gpio-539 (GPIO27              )
 gpio-540 (SDA0                )
 gpio-541 (SCL0                )
 gpio-542 (NC                  )
 gpio-543 (LAN_RUN             )
 gpio-544 (CAM_GPIO1           )
 gpio-545 (NC                  )
 gpio-546 (NC                  )
 gpio-547 (PWR_LOW_N           |PWR                 ) in  lo
 gpio-548 (NC                  )
 gpio-549 (NC                  )
 gpio-550 (USB_LIMIT           )
 gpio-551 (NC                  )
 gpio-552 (PWM0_OUT            )
 gpio-553 (CAM_GPIO0           |cam1_regulator      ) out lo
 gpio-554 (NC                  )
 gpio-555 (NC                  )
 gpio-556 (ETH_CLK             )
 gpio-557 (PWM1_OUT            )
 gpio-558 (HDMI_HPD_N          |hpd                 ) in  hi ACTIVE LOW
 gpio-559 (STATUS_LED          |ACT                 ) out lo
 gpio-560 (SD_CLK_R            )
 gpio-561 (SD_CMD_R            )
 gpio-562 (SD_DATA0_R          )
 gpio-563 (SD_DATA1_R          )
 gpio-564 (SD_DATA2_R          )
 gpio-565 (SD_DATA3_R          )
 */
const relays = [
    {gpio: new Gpio(535, "out"), name: "light socket"},
    {gpio: new Gpio(536, "out"), name: "outlet"},
]

process.on('SIGINT', _ => {
    relays.map(({gpio}) => gpio.unexport());
});

export default relays;

