var Helper = require('./helper');

var LCDhelper = function(lcd) {
  this.lcd = lcd;
};

var scrollTextInterval;

/**
 * Function to scroll text on arduino LCD 2x16 display
 * @param  {string} msg   message to srolling.
 * @param  {int} row   row display where we start display text.
 * @param  {int} col   column where we display text.
 */
LCDhelper.prototype.scrollText = function(msg, row, col, waitTime) {
  var that       = this;
  var helper     = new Helper();
  var display    = new Buffer(that.lcd.cols);
  var msg_length = msg.length;

  // Initial buffer start and end.
  var start = 0;
  var end   = that.lcd.cols;

  // Scroll text if length of it is longer than number of columns.
  if (msg_length > 16) {
    clearInterval(scrollTextInterval);
    // Loop to scroll text on the display.
    scrollTextInterval = setInterval(function() {
      msg.copy(display, 0, start, end);
      // helper.writeLine(display.toString());
      that.lcd.cursor(row, col).print(display.toString());

      if (end++ === msg_length) {
        end = that.lcd.cols;
      }

      if (start++ === (msg_length - that.lcd.cols)) {
        start = 0;
      }
    }, waitTime);
  // Don't scroll text if length is shorther than 16.
  } else {
    that.lcd.cursor(row,col).print(msg.toString());
  }
};

module.exports = LCDhelper;
