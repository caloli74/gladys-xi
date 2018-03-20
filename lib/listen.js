const dgram = require('dgram');
const events = require('events');

var shared = require('./shared.js');

const MULTICAST_ADDRESS = '224.0.0.50';
const SERVER_PORT = 9898;

module.exports = function listen() {
    shared.emitter = new events.EventEmitter();
    shared.serverSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

    shared.serverSocket.on('listening', () => {
        shared.serverSocket.addMembership(MULTICAST_ADDRESS, '127.0.0.1');
    });

    shared.serverSocket.on('message', (msg) => {
        const parsed = JSON.parse(msg.toString());
        shared.emitter.emit('message', parsed);
    });

    shared.serverSocket.bind(SERVER_PORT);
}
