/* manage communication with the gateway */
const dgram = require('dgram');
const events = require('events');
const crypto = require('crypto');
var shared = require('./shared.js');

const AQARA_IV = Buffer.from([0x17, 0x99, 0x6d, 0x09, 0x3d, 0x28, 0xdd, 0xb3, 0xba, 0x69, 0x5a, 0x2e, 0x6f, 0x58, 0x56, 0x2e]);
const DISCOVERY_PORT = 4321;
const SERVER_PORT = 9898;
const MULTICAST_ADDRESS = '224.0.0.50';


module.exports = function gateway(action, params) {
    return new Promise(function (resolve, reject) {
        if ((action === 'setColor' || action === 'playSound') && !shared.token) {
            _failure("Erreur appel gateway, token non defini : action =" + action + ", param = " + JSON.stringify(params));
        }
        if (params) {
            var sid = params[0];
        }
        var timer1 = setTimeout(() => {
            _sendMessage();
        }, 2000);
        var timer2 = setTimeout(() => {
            _failure("Timeout gateway");
        }, 4000);
        var nbAnswers = 0
        const handleMessage = (msg) => {
            switch (action + "|" + msg.cmd) {
                case 'getSid|iam':
                    _success(msg.sid);
                    break;

                case 'setColor|write_ack':
                case 'playSound|write_ack':
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
                    if (nbAnswers === 3) {
                        _sendMessage();
                    }
                    else if (nbAnswers > 6) {
                        _failure("Pas de réponse du gateway");
                    };
            }
        }

        gladys.on('GatewayMessage', handleMessage);
        _sendMessage();

        function _sendMessage() {
            switch (action) {
                case 'getSid':
                    _sendSocket('{"cmd": "whois"}');
                    break;
                case 'setColor':
                    const color = params[2];
                    const value = color.intensity * Math.pow(2, 24) + color.r * Math.pow(2, 16) + color.g * Math.pow(2, 8) + color.b;
                    _sendSocket(JSON.stringify({ cmd: "write", model: "gateway", sid: sid, short_id: 0, data: { rgb: value, key: _calculateKey() } }));
                    break;
                case 'playSound':
                    const sound = params[2];
                    _sendSocket(JSON.stringify({ cmd: "write", model: "gateway", sid: sid, short_id: 0, data: { mid: sound, key: _calculateKey() } }));
                    break;
                case 'getState':
                    _sendSocket(JSON.stringify({ cmd: "read", sid: sid }));
                    break;
                default:
                    _failure("action " + action + " non supportée...");
            }
        };

        function _calculateKey() {
            const cipher = crypto.createCipheriv('aes-128-cbc', params[1], AQARA_IV);
            return cipher.update(shared.token, 'ascii', 'hex');
        };

        function _sendSocket(payload, port) {
            if (JSON.parse(payload.toString()).cmd === 'whois')
                port = DISCOVERY_PORT
            else
                port = SERVER_PORT;

            shared.serverSocket.send(payload, 0, payload.length, port, MULTICAST_ADDRESS);
        };

        function _success(result) {
            if (timer1) clearTimeout(timer1);
            if (timer2) clearTimeout(timer2);
            gladys.removeListener('GatewayMessage', handleMessage);
            return resolve(result);
        };

        function _failure(msg) {
            if (timer1) clearTimeout(timer1);
            if (timer2) clearTimeout(timer2);
            gladys.removeListener('GatewayMessage', handleMessage);
            return reject(new Error(msg));
        };
    });
}
