/* daemon to listen messages sent by the gateway */
const dgram = require('dgram');
const events = require('events');

var shared = require('./shared.js');
var gateway = require('./gateway.js');
var setDeviceState = require('./setDeviceState.js');

const SERVER_PORT = 9898;
const MULTICAST_ADDRESS = '224.0.0.50';

module.exports = function listen() {
    shared.serverSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

    shared.serverSocket.on('listening', () => {
        shared.serverSocket.addMembership(MULTICAST_ADDRESS, '127.0.0.1');
    });

    shared.serverSocket.on('message', (msg) => {
        const parsed = JSON.parse(msg.toString());
        if (parsed.cmd === 'heartbeat' && parsed.model === 'gateway' && parsed.token)
            shared.token = parsed.token;

        if ((parsed.cmd === 'report' || parsed.cmd === 'write_ack') && parsed.model === 'gateway') {
            setDeviceState(JSON.parse(parsed.data))
        }

        if (parsed.model === 'sensor_cube.aqgl01') {
            if (parsed.data)
                console.log('-- cube ==> data =' + parsed.data + '/' + msg.toString())
            else
                console.log('-- cube ==> msg =' + msg.toString())
            // parsed.data =
            // {"status":"move"}
            // {"status":"flip90"}
            // {"status":"flip180"}
            // {"status":"shake_air"}
            // {"status":"tap_twice"}
            // {"rotate":"10,500"}
            // {"rotate":"-20,500"}
            // {"voltage":2975} {"cmd":"heartbeat","model":"sensor_cube.aqgl01","sid":"158d00027bff19","short_id":20307,"data":"{\"voltage\":2975}"}
            //
        }

        // console.log('-- listen :' + msg.toString());
        gladys.emit('GatewayMessage', parsed);
    });

    shared.serverSocket.bind(SERVER_PORT);
    gladys.emit('GatewayReady');
}
