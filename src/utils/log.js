import log from 'loglevel'

log.setLevel(process.env.LOGLEVEL || "info");

export default log;