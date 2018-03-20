const dgram = require('dgram')
var shared = require('./shared.js');

module.exports = function work2() {
    const handleMessage = (msg) => {
        console.log('--- start handleMessage ---');
        console.log(msg);
        shared.emitter.removeListener('message', handleMessage)
        console.log('--- end handleMessage ---');
    }

    shared.emitter.on('message', handleMessage)
    _sendMessage('{"cmd": "whois"}', shared.DISCOVERY_PORT);

    function _sendMessage(payload, port) {
        if (JSON.parse(payload.toString()).cmd === 'whois')
            port = shared.DISCOVERY_PORT
        else
            port = shared.SERVER_PORT;

        shared.serverSocket.send(payload, 0, payload.length, port, shared.MULTICAST_ADDRESS);
    };
}
