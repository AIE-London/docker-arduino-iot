var Helper = function() {};

/**
 * Print line in the console.
 * @param  {string} text
 */
Helper.prototype.writeLine = function(text){
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(text);
};

/**
 * https://en.wikipedia.org/wiki/Linear_interpolation
 * @param  {int} start
 * @param  {int} end
 * @param  {int} step
 * @param  {int} steps
 * @return {int}
 */
Helper.prototype.linear = function(start, end, step, steps) {
  return (end - start) * step / steps + start;
};

module.exports = Helper;
