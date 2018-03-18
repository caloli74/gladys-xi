var command = require('./command.js');

module.exports = function install() {
    return new Promise(function (resolve, reject) {
        gateway('discover')
            .then((sid) => {
                var myDevice = {
                    device: {
                        name: 'Xiaomi gateway',
                        identifier: sid,
                        protocol: 'zigbee',
                        service: 'xi'
                    },
                    types: [
                        {
                            identifier: sid,
                            type: 'illumination',
                            unit: '',
                            min: 0,
                            max: 9999,
                            sensor: true
                        },
                        {
                            identifier: sid,
                            type: 'intensity',
                            unit: '',
                            min: 0,
                            max: 100,
                            sensor: false
                        },
                        {
                            identifier: sid,
                            type: 'red',
                            unit: '',
                            min: 0,
                            max: 255,
                            sensor: false
                        },
                        {
                            identifier: sid,
                            type: 'green',
                            unit: '',
                            min: 0,
                            max: 255,
                            sensor: false
                        },
                        {
                            identifier: sid,
                            type: 'blue',
                            unit: '',
                            min: 0,
                            max: 255,
                            sensor: false
                        },
                        {
                            identifier: sid,
                            type: 'volume',
                            unit: '',
                            min: 0,
                            max: 100,
                            sensor: false
                        },
                        {
                            identifier: sid,
                            type: 'sound',
                            unit: '',
                            min: 0,
                            max: 10099,
                            sensor: false
                        }
                    ]
                };
                gladys.device.create(myDevice)
                    .then(function (device) {
                        console.log("Indiquer le mot de passe du gateway dans les paramètres de Gladys");
                        return resolve('success');
                    })
                    .catch(function (err) {
                        return reject(new Error(err));
                    });

            })
            .catch((err) => {
                return reject(new Error(err));
            });
    });
}