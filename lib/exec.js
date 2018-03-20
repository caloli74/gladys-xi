var gateway = require('./gateway.js');

module.exports = function exec(params) {

    return new Promise(function (resolve, reject) {
        if (params.deviceType.type === 'binary') {
            if (params.state.value === 1)
                gateway('setColor', ['34ce00966f9b', 'wkj8q0gi2nmaugth', { intensity: 100, r: 0, g: 0, b: 255 }])
            else
                gateway('setColor', ['34ce00966f9b', 'wkj8q0gi2nmaugth', { intensity: 0, r: 0, g: 0, b: 0 }])
        }
        console.log('exec ' + params);
        return resolve('success');
    })
}