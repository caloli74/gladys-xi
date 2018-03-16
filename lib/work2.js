const dgram = require('dgram')
const events = require('events')
const crypto = require('crypto')

const MULTICAST_ADDRESS = '224.0.0.50'
const SERVER_PORT = 9898
const DISCOVERY_PORT = 4321
const AQARA_IV = Buffer.from([0x17, 0x99, 0x6d, 0x09, 0x3d, 0x28, 0xdd, 0xb3, 0xba, 0x69, 0x5a, 0x2e, 0x6f, 0x58, 0x56, 0x2e])

module.exports = function GatewayMessage(action, params) {
    return new Promise(function (resolve, reject) {
        var nbAnswers = 0
        serverSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

        serverSocket.on('listening', () => {
            serverSocket.addMembership(MULTICAST_ADDRESS, '127.0.0.1');
            switch (action) {
                case 'discover':
                    _sendMessage('{"cmd": "whois"}', DISCOVERY_PORT);
                    break;
                case 'setColor':
                    _sendMessage('{"cmd": "get_id_list"}');
                    break;
                case 'getState':
                    sid = params[0];
                    _sendMessage(JSON.stringify({ cmd: "read", sid: sid }));
                    break;
                default:
                    serverSocket.close();
                    return reject(new Error("action " + action + " non supportée..."));
            }
        });

        serverSocket.on('message', (msg) => handleMessage(msg));

        function handleMessage(msg) {
            const parsed = JSON.parse(msg.toString());
            console.log(parsed);
            switch (action + "|" + parsed.cmd) {
                case 'discover|iam':
                    serverSocket.close();
                    return resolve(parsed.sid);
                    break;

                case 'setColor|get_id_list_ack':
                    token = parsed.token;
                    sid = params[0];
                    password = params[1];
                    color = params[2];
                    const value = color.intensity * Math.pow(2, 24) + color.r * Math.pow(2, 16) + color.g * Math.pow(2, 8) + color.b;
                    const cipher = crypto.createCipheriv('aes-128-cbc', password, AQARA_IV);
                    key = cipher.update(token, 'ascii', 'hex');

                    _sendMessage(JSON.stringify({ cmd: "write", model: "gateway", sid: sid, short_id: 0, data: { rgb: value, key: key } }));
                    break;

                case 'setColor|write_ack':
                    serverSocket.close();
                    return resolve('success');
                    break;

                case 'getState|read_ack':
                    data = JSON.parse(parsed.data);
                    illumination = data.illumination;
                    rgb = data.rgb;
                    intensity = Math.trunc(rgb / Math.pow(2, 24)) ;
                    r = Math.trunc((rgb % Math.pow(2, 24)) / Math.pow(2, 16)) ;
                    console.log("illu " + illumination);
                    console.log("rgb " + rgb);
                    console.log("intensity " + intensity);
                    console.log("r " + r);
                    serverSocket.close();
                    return resolve('success');
                    break;

                default:
                    nbAnswers++;
                    if (nbAnswers > 3) {
                        serverSocket.close();
                        return reject(new Error("Pas de réponse du gateway"))
                    }
            }
        };

        function _sendMessage(payload, port) {
            if (!port) {
                port = SERVER_PORT;
            }
            serverSocket.send(payload, 0, payload.length, port, MULTICAST_ADDRESS);
        };

        serverSocket.bind(SERVER_PORT);
    })
}
