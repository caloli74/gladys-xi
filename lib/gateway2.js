const dgram = require('dgram')
var shared = require('./shared.js');

module.exports = function gateway2(action, params) {
    return new Promise(function (resolve, reject) {
        var timers = setTimeout(() => {
            _failure("Timeout");
        }, 1000);
        var nbAnswers = 0
        shared.emitter.on('message', handleMessage)

        switch (action) {
            case 'discover':
                _sendMessage('{"cmd": "whois"}');
                break;
            case 'setColor':
                const sid = params[0];
                const password = params[1];
                const color = params[2];
                const value = color.intensity * Math.pow(2, 24) + color.r * Math.pow(2, 16) + color.g * Math.pow(2, 8) + color.b;
                const cipher = crypto.createCipheriv('aes-128-cbc', password, shared.AQARA_IV);
                key = cipher.update(shared.token, 'ascii', 'hex');
                _sendMessage(JSON.stringify({ cmd: "write", model: "gateway", sid: sid, short_id: 0, data: { rgb: value, key: key } }));
                break;
            case 'getState':
                sid = params[0];
                _sendMessage(JSON.stringify({ cmd: "read", sid: sid }));
                break;
            default:
                _failure("action " + action + " non supportée...");
        }

        const handleMessage = (msg) => {
            switch (action + "|" + msg.cmd) {
                case 'discover|iam':
                    _success(msg.sid);
                    break;

                case 'setColor|write_ack':
                    _success('success');
                    break;

                case 'getState|read_ack':
                    data = JSON.parse(msg.data);
                    illumination = data.illumination;
                    rgb = data.rgb;
                    intensity = Math.trunc(rgb / Math.pow(2, 24));
                    r = Math.trunc((rgb % Math.pow(2, 24)) / Math.pow(2, 16));
                    g = Math.trunc((rgb % Math.pow(2, 16)) / Math.pow(2, 8));
                    b = rgb % Math.pow(2, 8);
                    _success({ illumination: illumination, intensity: intensity, r: r, g: g, b: b });
                    break;

                default:
                    nbAnswers++;
                    if (nbAnswers > 3) {
                        _failure("Pas de réponse du gateway");
                    }
            }
            /*
            console.log('--- start handleMessage ---');
            console.log(msg);
            shared.emitter.removeListener('message', handleMessage)
            console.log('--- end handleMessage ---');
            */
        }

        function _sendMessage(payload, port) {
            if (JSON.parse(payload.toString()).cmd === 'whois')
                port = shared.DISCOVERY_PORT
            else
                port = shared.SERVER_PORT;

            shared.serverSocket.send(payload, 0, payload.length, port, shared.MULTICAST_ADDRESS);
        };

        function _success(result) {
            if (timers) clearTimeout(timers);
            shared.emitter.removeListener('message', handleMessage);
            return resolve(result);
        };

        function _failure(msg) {
            if (timers) clearTimeout(timers);
            shared.emitter.removeListener('message', handleMessage);
            return reject(new Error(msg));
        };
    });
}
