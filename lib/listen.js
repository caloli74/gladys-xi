const dgram = require('dgram');
const events = require('events');

var shared = require('./shared.js');

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
        console.log ('-- listen :' + parsed.cmd)
        console.log (msg.toString())
        shared.emitter.emit('message', parsed);
    });

    shared.serverSocket.bind(shared.SERVER_PORT);
}
