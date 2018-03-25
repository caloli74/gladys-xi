var gateway = require('./gateway.js');

module.exports = function setColor(param) {

    return new Promise(function (resolve, reject) {
        var color = { intensity: 10, r: 0, g: 0, b: 0 };
        if (typeof param == 'string') {
            switch (param.toLowerCase()) {
                case 'red':
                    color.r = 255;
                    break;
                case 'blue':
                    color.b = 255;
                    break;
                case 'green':
                    color.g = 255;
                    break;
                case 'yellow':
                    color.r = 255;
                    color.g = 255;
                    break;
                case 'purple':
                    color.r = 255;
                    color.b = 255;
                    break;
                case 'cyan':
                    color.b = 255;
                    color.g = 255;
                    break;
                case 'white':
                    color.r = 255;
                    color.g = 255;
                    color.b = 255;
                    break;
            }
        }
        else {
            color = param;
        }
        var p1 = gladys.device.get({ service: "xiaomi-gateway" });
        var p2 = gladys.param.getValue('Xiaomi_password');

        Promise.all([p1, p2])
            .then((results) => {
                gateway('setColor', [results[0][0].identifier, results[1], color])
                    .then((results) => {
                        return resolve('success');
                    })
                    .catch((err) => {
                        return reject(new Error(err));
                    })
            })
            .catch((err) => {
                return reject(new Error(err));
            });
    })
}