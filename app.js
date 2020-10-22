const configs = require('./config');
const logger = require('./logger');
const http = require('http');
logger.warn('Running env: ' + configs.ENV);
const server = http.createServer((request, response) => {
    logger.log('.');
    response.statusCode = 200;
    response.end('Hello, world');
})
server.listen(configs.PORT, () => {logger.log('Listening on port ' + configs.PORT)});