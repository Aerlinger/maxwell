let errorStack = undefined;
let warningStack = undefined;
class Logger {
  static initClass() {
  
    errorStack = new Array();
    warningStack = new Array();
  }

  static error(msg) {
    console.error(`Error: ${msg}`);
    return errorStack.push(msg);
  }

  static warn(msg) {
    console.error(`Warning: ${msg}`);
    return warningStack.push(msg);
  }
}
Logger.initClass();


module.exports = Logger;
