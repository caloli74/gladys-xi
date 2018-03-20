var gateway = require('./gateway.js');

module.exports = function install() {
    return new Promise(function (resolve, reject) {
        gateway('getSid')
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
                            type: 'binary',
                            unit: '',
                            min: 0,
                            max: 1,
                            sensor: false
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
                            type: 'illumination',
                            unit: '',
                            min: 0,
                            max: 9999,
                            sensor: true
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
                var p1 = gladys.device.create(myDevice)
                var p2 = gladys.param.setValue({ name: 'Xiaomi_password', value: 'Gateway password' })

                Promise.all([p1, p2])
                    .then(() => {
                        console.log("Indiquer le mot de passe du gateway dans le paramètre Xiaomi_password de Gladys");
                        return resolve('success');
                    })
                    .catch((err) => {
                        return reject(new Error(err));
                    });
            })
            .catch((err) => {
                return reject(new Error(err));
            });
    });
}