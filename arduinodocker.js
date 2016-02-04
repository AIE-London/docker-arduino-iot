var five         = require("johnny-five");
var Docker       = require('dockerode');
var pretty       = require('prettysize');
var promise      = require('bluebird');
var EventEmitter = require('events').EventEmitter;
var util         = require('util');
// Custom modules.
var Container    = require('./libs/container');
var LCDhelper    = require('./libs/lcdhelper');
var Helper       = require('./libs/helper');

var ArduinoDocker = function(opts) {
  this.docker    = new Docker(opts);
  this.board     = new five.Board();
  this.container = new Container(this.docker);
  this.lcd       = {};
  this.rotary    = {};
  this.button    = {};
  this.touch     = {};
  this.led       = {};
  this.servo     = {};
};

var getStatsInterval;

/**
 * load function - we run all actions here.
 */
ArduinoDocker.prototype.load = function(){
  var that = this;

  var board = new five.Board();

  that.board.on("ready", function() {
    console.log('Arduino connected');

    that.lcd    = new five.LCD({controller: "JHD1313M1"});
    that.button = new five.Button(4);
    that.touch  = new five.Button(3);
    that.led    = new five.Led(6);
    that.rotary = new five.Sensor("A0");
    that.servo  = new five.Servo(5);

    // Action to create a new container.
    that.touch.on("press", function() {
      that.container.runDockerContainer('ubuntu', function(err, data, container) {
        console.log('error', err);
      });
    });

    // Changing servo positon with rotary.
    that.rotary.scale(0, 180).on("change", function() {
      that.servo.to(this.value);
    });

    // Changing containers info displayed on LCD.
    that.container.getContainers({"all":false})
      .then(function(containers) {

        var number_of_containers = containers.activeContainers.length;
        var index = 0;

        that.button.on("press", function() {
          var container = that.container.changeContainer(index);
          that.lcd.clear();
          that.displayContainerInfo(container);

          index++;

          if (index === (number_of_containers)) {
            index = 0;
          }
        });

        return containers.activeContainers;
      });
  });
};

/**
 * CPU Alarm. It blinks led and change LCD background color to red
 * if CPU usage is more than 80% and display CPU and memory values.
 * @param  {float} cpu cpu usage
 * @param  {float} mem memory usage
 */
ArduinoDocker.prototype.cpuMemIndicator = function(cpu, mem) {
  var that = this;

  var helper = new Helper();
  var c = Math.floor(cpu);

  c = (c > 100) ? 100 : c;

  // Change LCD background color
  var r = helper.linear(0xFF, 0xFF, c, 100);
  var g = helper.linear(0xFF, 0x00, c, 100);
  var b = helper.linear(0xFF, 0x00, c, 100);

  that.lcd.bgColor(r, g, b);

  // Blink led if CPU usage is more than 80%.
  if (cpu > 80) {
    that.led.blink(300);
  } else {
    that.led.stop().off();
  }

  var msg = 'mem:' + mem + ' cpu:' + cpu;
  that.lcd.cursor(1, 0).print(msg);
};

/**
 * Get memory and cpu usage for specific container.
 * @param  {string} containerId
 */
ArduinoDocker.prototype.getContainerStats = function(containerId){
  var that = this;
  var container = that.docker.getContainer(containerId);
  var mem = 0;
  var cpu = 0;
  var previousCPU    = 0;
  var previousSystem = 0;

  clearInterval(getStatsInterval);

  getStatsInterval = setInterval(function() {
    container.stats({stream:false}, function (err, stream) {
      if (stream) {
        stream.on('data', function(data) {
          data = JSON.parse(data.toString('utf8'));

          mem            = that.container.memoryPercentage(data.memory_stats.usage, data.memory_stats.limit);
          previousCPU    = data.precpu_stats.cpu_usage.total_usage;
          previousSystem = data.precpu_stats.system_cpu_usage;
          cpu            = that.container.calculateCPUPercent(previousCPU, previousSystem, data);

          that.cpuMemIndicator(cpu, mem);
        });
      }
    });
  }, 400);
};

/**
 * Displays container info.
 * @param  {obj} container Container object.
 */
ArduinoDocker.prototype.displayContainerInfo = function(container){
  var that      = this;
  var cont      = new Container(container);
  var msg       = ' name: ' + container.name + ' image: ' + container.image + ' id: ' + container.id;
  var buffer    = new Buffer(msg);
  var lcdhelper = new LCDhelper(that.lcd);

  lcdhelper.scrollText(buffer, 0, 0, 250);

  that.getContainerStats(container.id);
};

module.exports = ArduinoDocker;
