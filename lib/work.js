const dgram = require('dgram')
const events = require('events')
const crypto = require('crypto')
const { MULTICAST_ADDRESS, SERVER_PORT, AQARA_IV } = require('./shared.js')

module.exports = function work() {
    gladys.param.getValue(`Xi_password`)
        .then((password) => {
            gladys.device.get({ service: "xi" })
                .then((gateway) => {
                    console.log (gateway[0]);
                    gladys.deviceType.getByDevice({ device: gateway[0] })
                        .then((gatewayParts) => {
                            gatewayParts.forEach(gatewayPart => {
                                console.log(gatewayPart);
                            });
                            sid = gateway[0].identifier

                            serverSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

                            serverSocket.on('listening', () => {
                                serverSocket.addMembership(MULTICAST_ADDRESS, '127.0.0.1');
                                payload = JSON.stringify({ cmd: "get_id_list", sid: sid });
                                serverSocket.send(payload, 0, payload.length, SERVER_PORT, MULTICAST_ADDRESS);
                            });

                            serverSocket.on('message', (msg) => handleMessage(msg));

                            function handleMessage(msg) {
                                const parsed = JSON.parse(msg.toString());
                                switch (parsed.cmd) {
                                    case 'get_id_list_ack':
                                        token = parsed.token;
                                        const intensity = 5;
                                        const color = { r: 255, g: 0, b: 0 };
                                        const value = intensity * Math.pow(2, 24) + color.r * Math.pow(2, 16) + color.g * Math.pow(2, 8) + color.b;
                                        const cipher = crypto.createCipheriv('aes-128-cbc', password, AQARA_IV);
                                        key = cipher.update(token, 'ascii', 'hex');

                                        payload = JSON.stringify({ cmd: "write", model: "gateway", sid: sid, short_id: 0, data: { rgb: value, key: key } });
                                        serverSocket.send(payload, 0, payload.length, SERVER_PORT, MULTICAST_ADDRESS);
                                        break;

                                    case 'write_ack':
                                        serverSocket.close();
                                        break;
                                }
                            }

                            serverSocket.bind(SERVER_PORT);
                        });
                });

        });
}