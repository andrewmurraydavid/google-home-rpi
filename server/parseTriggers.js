var constants = require('../constants');
const axios = require('axios');

module.exports.parseTriggerByName = function name(triggerName) {
  switch (triggerName) {
  case constants.ROOM_TEMPERATURE_SENSOR:
    comunicateWithSerialDevice();
    break;
  }
};

function comunicateWithSerialDevice() {
  const SerialPort = require('serialport');
  const Readline = require('@serialport/parser-readline');
  const serialPort = new SerialPort(process.env.SERIAL_PORT, {
    baudRate: 9600
  });

  const lineStream = serialPort.pipe(new Readline({ delimiter: '\r\n' }));

  lineStream.on('data', data => {
    if (data === 'OK') {
      setTimeout(() => {
        serialPort.write('temp\n', function(err) {
          if (err) {
            // eslint-disable-next-line no-console
            return console.error('Error on write: ', err.message);
          }
        });
      }, 10);
    } else {
      axios
        .post(
          'https://maker.ifttt.com/trigger/got_room_temp/with/key/kcTGZwMEaoRdFsr7rs5EvZpcdVhNYgHbKQ4hIW8biFB',
          {
            value1: data
          }
        )
        .then(function() {})
        .catch(function(error) {
          // eslint-disable-next-line no-console
          console.error(error);
        });
      lineStream.destroy();
      serialPort.close();
    }
  });
}
