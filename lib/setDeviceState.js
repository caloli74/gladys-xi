module.exports = function setDeviceState(data) {

    return new Promise(function (resolve, reject) {
        gladys.device.get({ service: "xiaomi-gateway" })
            .then((gatewayDevice) => {
                gladys.deviceType.getByDevice(gatewayDevice[0])
                    .then((results) => {
                        results.forEach(subDevice => {
                            console.log(JSON.stringify(subDevice));
                            switch (subDevice.type) {
                                case 'intensity':
                                    var DEVICE_INTENSITY = subDevice.id;
                                    break;
                                case 'red':
                                    var DEVICE_RED = subDevice.id;
                                    break;
                                case 'green':
                                    var DEVICE_GREEN = subDevice.id;
                                    break;
                                case 'blue':
                                    var DEVICE_BLUE = subDevice.id;
                                    break;
                                case 'binary':
                                    var DEVICE_BINARY = subDevice.id;
                                    break;
                            }
                        });
                        /*
                        illumination = data.illumination;
                        rgb = data.rgb;
                        intensity = Math.trunc(rgb / Math.pow(2, 24));
                        r = Math.trunc((rgb % Math.pow(2, 24)) / Math.pow(2, 16));
                        g = Math.trunc((rgb % Math.pow(2, 16)) / Math.pow(2, 8));
                        b = rgb % Math.pow(2, 8);
                        */
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