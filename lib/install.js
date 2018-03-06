/*
var Promise = require('bluebird');

module.exports = function install(){
    var Promise = require('bluebird');
    
    return new Promise(function(resolve, reject) {
        console.log('Xi Install')
    });
};
*/

module.exports = function install(){

const dgram = require('dgram')

const MULTICAST_ADDRESS = '224.0.0.50';
const SERVER_PORT = 9898;
const DISCOVERY_PORT = 4321;

serverSocket = dgram.createSocket('udp4');

serverSocket.on('listening', () => {
//    serverSocket.addMembership(MULTICAST_ADDRESS, '127.0.0.1');
//    payload = '{"cmd": "whois"}';
//    serverSocket.send(payload, 0, payload.length, DISCOVERY_PORT, MULTICAST_ADDRESS);
});
serverSocket.on('message', (msg) => handleMessage (msg));

function handleMessage (msg) {
    var sid = 12345;
    var myDevice = {
        device: {
            name: 'Xiaomi gateway',
            identifier: sid,
            protocol: 'zigbee',
            service: 'xi'
        },
        types: [
            {
                identifier: sid,
                type: 'illumination',
                unit: '',
                min: 0,
                max: 9999,
                sensor: true
            },
            {
                identifier: sid,
                type:'intensity',
                unit: '',
                min: 0,
                max: 100,
                sensor: false
            },
            {
                identifier: sid,
                type: 'red',
                unit: '',
                min: 0,
                max: 255,
                sensor: false
            },
            {
                identifier: sid,
                type: 'green',
                unit: '',
                min: 0,
                max: 255,
                sensor: false
            },
            {
                identifier: sid,
                type: 'blue',
                unit: '',
                min: 0,
                max: 255,
                sensor: false
            },
            {
                identifier: sid,
                type: 'volume',
                unit: '',
                min: 0,
                max: 100,
                sensor: false
            },
            {
                identifier: sid,
                type: 'sound',
                unit: '',
                min: 0,
                max: 10099,
                sensor: false
            }
        ]   
    };
    
    return gladys.device.create(myDevice)
    .then(function(device){
        console.log("Indiquer le mot de passe du gateway")
    })
    .catch(function(err){
        console.log(err)
    });

//    const parsed = JSON.parse(msg.toString());
//    console.log(parsed);
//    switch (parsed.cmd) {
//    case 'iam':
//        var sid = parsed.sid;
//        serverSocket.close();
//        break;
//    }
}

serverSocket.listen(9898);

}