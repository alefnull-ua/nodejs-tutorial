module.exports = {
    log : (message) => {console.log(message)},
    warn : (message) => {console.log('[warn] ' + message)},
    error : (message) => {console.log('[error] ' + message)},
    debug : (message) => {console.log('[debug] ' + message)}
}