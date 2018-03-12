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

    return new Promise(function(resolve, reject){
        const dgram = require('dgram')

        const MULTICAST_ADDRESS = '224.0.0.50';
        const SERVER_PORT = 9898;
        const DISCOVERY_PORT = 4321;

        serverSocket = dgram.createSocket({type:'udp4', reuseAddr:true});

        serverSocket.on('listening', () => {
            serverSocket.addMembership(MULTICAST_ADDRESS, '127.0.0.1');
            payload = '{"cmd": "whois"}';
            serverSocket.send(payload, 0, payload.length, DISCOVERY_PORT, MULTICAST_ADDRESS);
        });

        serverSocket.on('message', (msg) => handleMessage (msg))

        function handleMessage (msg) {
            const parsed = JSON.parse(msg.toString())
            var myDevice = {
                device: {
                    name: 'Xiaomi gateway',
                    identifier: parsed.sid,
                    protocol: 'zigbee',
                    service: 'xi'
                },
                types: [
                    {
                        identifier: parsed.sid,
                        type: 'illumination',
                        unit: '',
                        min: 0,
                        max: 9999,
                        sensor: true
                    },
                    {
                        identifier: parsed.sid,
                        type:'intensity',
                        unit: '',
                        min: 0,
                        max: 100,
                        sensor: false
                    },
                    {
                        identifier: parsed.sid,
                        type: 'red',
                        unit: '',
                        min: 0,
                        max: 255,
                        sensor: false
                    },
                    {
                        identifier: parsed.sid,
                        type: 'green',
                        unit: '',
                        min: 0,
                        max: 255,
                        sensor: false
                    },
                    {
                        identifier: parsed.sid,
                        type: 'blue',
                        unit: '',
                        min: 0,
                        max: 255,
                        sensor: false
                    },
                    {
                        identifier: parsed.sid,
                        type: 'volume',
                        unit: '',
                        min: 0,
                        max: 100,
                        sensor: false
                    },
                    {
                        identifier: parsed.sid,
                        type: 'sound',
                        unit: '',
                        min: 0,
                        max: 10099,
                        sensor: false
                    }
                ]   
            };
    
            gladys.device.create(myDevice)
            .then(function(device){
                console.log("Indiquer le mot de passe du gateway");
                return resolve('success');
            })
            .catch(function(err){
                return reject(new Error(err));
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

        serverSocket.bind(9898);

});
}