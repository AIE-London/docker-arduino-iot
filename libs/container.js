var Container = function(docker) {
  this.docker = docker;
  this.activeContainers = [];
};

/**
 * Get list of active containers.
 * @param  {[obj]} opts look into docker remote API
 */
Container.prototype.getContainers = function(opts) {
  var that = this;

  var promise = new Promise(function(resolve, reject) {

    that.docker.listContainers(opts, function (err, containers) {

      if (err) {
        reject(err);
      } else {

        containers.forEach(function (containerInfo, index) {
          that.activeContainers[index] = {
            'id': containerInfo.Id.slice(0, 12),
            'image': containerInfo.Image,
            'name': containerInfo.Names.toString().substr(1)
          };
        });
        resolve(that);
      }
    });
  });
  return promise;
};

/**
 * Runs container of specific image.
 * @param  {[string]} imageName name of image
 */
Container.prototype.runDockerContainer = function(imageName, callback) {
  var that = this;

  // It takes a time to download an image so you need to wait
  // until a download is completed.
  that.docker.run(imageName, ['/bin/bash'], [process.stdout, process.stderr], {Tty:true, Detach:true}, function (err, data, container) {
    if (err) return callback(err);

    callback(err, data, container);
  });
};

/**
 * Get container's details for specific index of container list.
 * @param  int index index of containers list.
 * @return object container details.
 */
Container.prototype.changeContainer = function(index) {
  var that = this;

  if (index >= 0 && index < that.activeContainers.length)
    return this.activeContainers[index];
  else
    return false;
};

/**
 * Calculates usage CPU in percentage.
 * @param  {int} previousCPU
 * @param  {int} previousSystem
 * @param  {json} v stream object
 */
Container.prototype.calculateCPUPercent = function(previousCPU, previousSystem, v) {
  var cpuPercent = 0;
  // calculate the change for the cpu usage of the container in between readings
  var cpuDelta = v.cpu_stats.cpu_usage.total_usage - previousCPU;
  // calculate the change for the entire system between readings
  var systemDelta = v.cpu_stats.system_cpu_usage - previousSystem;

  if (systemDelta > 0 && cpuDelta > 0) {
    cpuPercent = (cpuDelta / systemDelta) * 100;
  }
  return cpuPercent.toFixed(2);
};

/**
 * Calculates usage memory in percentage
 * @param  {float} memoryUsage
 * @param  {float} memoryLimit
 * @return {float} mem  Usaged memory in percentage
 */
Container.prototype.memoryPercentage = function(memoryUsage, memoryLimit) {
  var mem = 0;
  mem = (memoryUsage / memoryLimit) * 100;
  mem = mem.toFixed(2);

  return mem;
};

module.exports = Container;
