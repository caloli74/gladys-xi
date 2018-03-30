module.exports = function setDeviceState(data) {

    return new Promise(function (resolve, reject) {
        gladys.device.get({ service: "xiaomi-gateway" })
            .then((gatewayDevice) => {
                gladys.deviceType.getByDevice(gatewayDevice[0])
                    .then((results) => {
                        var p = [];
                        var value;
                        for (var i = 0; i < results.length; i++) {
                            // si le gateway est éteint (rgb = 0, alors on ne modifie pas les valeurs de red, blue, ...)
                            switch (results[i].type) {
                                case 'intensity':
                                    value = data.rgb === 0 ? results[i].lastValue : Math.trunc(data.rgb / Math.pow(2, 24));
                                    break;
                                case 'red':
                                    value = data.rgb === 0 ? results[i].lastValue : Math.trunc((data.rgb % Math.pow(2, 24)) / Math.pow(2, 16));
                                    break;
                                case 'green':
                                    value = data.rgb === 0 ? results[i].lastValue : Math.trunc((data.rgb % Math.pow(2, 16)) / Math.pow(2, 8));
                                    break;
                                case 'blue':
                                    value = data.rgb === 0 ? results[i].lastValue : data.rgb % Math.pow(2, 8);
                                    break;
                                case 'binary':
                                    value = data.rgb === 0 ? 0 : 1;
                                    break;
                                case 'illumination':
                                    value = data.illumination;
                                    break;
                            }
                            if (value != results[i].lastValue)
                                p.push(gladys.deviceState.create({ devicetype: results[i].id, value: value }));
                        }

                        Promise.all(p)
                            .then((results) => {
                                return resolve('success');
                            })
                            .catch((err) => {
                                return reject(new Error(err));
                            });

                    })
                    .catch((err) => {
                        return reject(new Error(err));
                    });
            })
            .catch((err) => {
                return reject(new Error(err));
            });
    })
}