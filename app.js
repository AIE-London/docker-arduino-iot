var fs            = require('fs');
var ArduinoDocker = require('./arduinodocker');

var opts = {
  protocol: 'https',
  // Swarm master.
  host: '192.168.99.102',
  // Swarm master redirected port.
  port: 3376,
  ca: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/ca.pem'),
  cert: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/cert.pem'),
  key: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/key.pem')
};

var arduinoDocker = new ArduinoDocker(opts);
arduinoDocker.load();
