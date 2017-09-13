var logger = require('winston')
var WinstonDailyRotateFile = require('winston-daily-rotate-file')


var consoleTransportOpts = {
  colorize: true,
  timestamp: true,
  prettyPrint: true
}

var fileTransportOpts = {
  filename: './server.log',
  maxsize: 10000000,
  maxFiles: 2,
  json: false,
  handleExceptions: true
}

logger.remove(logger.transports.Console)
logger.add(logger.transports.Console, consoleTransportOpts)
logger.add(WinstonDailyRotateFile, fileTransportOpts)

// we need the logs from all our 3rd party modules.
var consoleOpts = ['log', 'profile', 'startTimer']
consoleOpts.concat(Object.keys(logger.levels)).forEach(function (method) {
    console[method] = function () {
      return logger[method].apply(logger, arguments)
    }
  })
var log = console.log
console.log = function hijacked_log (level) {
  if (arguments.length > 1 && level in this) {
    log.apply(this, arguments)
  } else {
    var args = Array.prototype.slice.call(arguments)
    args.unshift('info')
    log.apply(this, args)
  }
}

logger.info('Basic project server started')
