const dgram = require('dgram')

const MULTICAST_ADDRESS = '224.0.0.50'
const SERVER_PORT = 9898

module.exports = function listen() {
    console.log('listen xi')
    serverSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

    serverSocket.on('listening', () => {
        serverSocket.addMembership(MULTICAST_ADDRESS, '127.0.0.1');
    });

    serverSocket.on('message', (msg) => {
        const parsed = JSON.parse(msg.toString());
        console.log(parsed);
    });

    serverSocket.bind(SERVER_PORT);
}
