/* daemon to listen messages sent by the gateway */
const dgram = require('dgram');
const events = require('events');

var shared = require('./shared.js');
var gateway = require('./gateway.js');
var setDeviceState = require('./setDeviceState.js');

module.exports = function listen() {
    shared.emitter = new events.EventEmitter();
    shared.serverSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

    shared.serverSocket.on('listening', () => {
        shared.serverSocket.addMembership(shared.MULTICAST_ADDRESS, '127.0.0.1');
    });

    shared.serverSocket.on('message', (msg) => {
        const parsed = JSON.parse(msg.toString());
        if (parsed.cmd === 'heartbeat')
            shared.token = parsed.token;

        if ((parsed.cmd === 'report' || parsed.cmd === 'write_ack') && parsed.model === 'gateway') {
            setDeviceState(JSON.parse(parsed.data))
        }

        // console.log('-- listen :' + msg.toString());
        shared.emitter.emit('message', parsed);
    });

    shared.serverSocket.bind(shared.SERVER_PORT);
}
