const dgram = require('dgram')
var shared = require('./milight.shared.js');

const MULTICAST_ADDRESS = '224.0.0.50'
const SERVER_PORT = 9898
const DISCOVERY_PORT = 4321
const AQARA_IV = Buffer.from([0x17, 0x99, 0x6d, 0x09, 0x3d, 0x28, 0xdd, 0xb3, 0xba, 0x69, 0x5a, 0x2e, 0x6f, 0x58, 0x56, 0x2e])

module.exports = function work2() {
    _sendMessage('{"cmd": "whois"}', DISCOVERY_PORT);

    function _sendMessage(payload, port) {
        if (!port) {
            port = SERVER_PORT;
        }
        shared.serverSocket.send(payload, 0, payload.length, port, MULTICAST_ADDRESS);
    };
}
