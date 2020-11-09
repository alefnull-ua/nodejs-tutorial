// calculate n-th Fibonacci number on child process (can be as api) (2 files)


const fibo = require('./fibo');
const http = require('http');
const url = require('url');

const cp = require('child_process');
const parentChannel = cp.fork(`./fibo-child.js`);

  
http.createServer((req, res) => {
// inspired by https://nodejs.org/en/knowledge/HTTP/clients/how-to-access-query-string-parameters/
    const queryObject = url.parse(req.url,true).query;

    parentChannel.on('message', (m) => {
        console.log('PARENT got message:', m);
        res.writeHead(200);
        res.end(`Fibonacci for ${queryObject.n} has value ${m.result}\n`);
    });
    parentChannel.send({ n: queryObject.n });

}).listen(8000);

// in bash:
// for f in `seq 10`; do curl localhost:8000?n=$f; done
// Fibonacci for 1 has value the worker calculated 1
// Fibonacci for 2 has value the worker calculated 2
// Fibonacci for 3 has value the worker calculated 3
// Fibonacci for 4 has value the worker calculated 5
// Fibonacci for 5 has value the worker calculated 8
// Fibonacci for 6 has value the worker calculated 13
// Fibonacci for 7 has value the worker calculated 21
// Fibonacci for 8 has value the worker calculated 34
// Fibonacci for 9 has value the worker calculated 55
// Fibonacci for 10 has value the worker calculated 89

/*
// logs say there's a memory leak!

CHILD calculating fibonacci number number:  5
PARENT got message: { result: 8 }
CHILD calculating fibonacci number number:  1
PARENT got message: { result: 1 }
PARENT got message: { result: 1 }
CHILD calculating fibonacci number number:  2
PARENT got message: { result: 2 }
PARENT got message: { result: 2 }
PARENT got message: { result: 2 }
CHILD calculating fibonacci number number:  3
PARENT got message: { result: 3 }
PARENT got message: { result: 3 }
PARENT got message: { result: 3 }
PARENT got message: { result: 3 }
CHILD calculating fibonacci number number:  4
PARENT got message: { result: 5 }
PARENT got message: { result: 5 }
PARENT got message: { result: 5 }
PARENT got message: { result: 5 }
PARENT got message: { result: 5 }
CHILD calculating fibonacci number number:  5
PARENT got message: { result: 8 }
PARENT got message: { result: 8 }
PARENT got message: { result: 8 }
PARENT got message: { result: 8 }
PARENT got message: { result: 8 }
PARENT got message: { result: 8 }
CHILD calculating fibonacci number number:  6
PARENT got message: { result: 13 }
PARENT got message: { result: 13 }
PARENT got message: { result: 13 }
PARENT got message: { result: 13 }
PARENT got message: { result: 13 }
PARENT got message: { result: 13 }
PARENT got message: { result: 13 }
CHILD calculating fibonacci number number:  7
PARENT got message: { result: 21 }
PARENT got message: { result: 21 }
PARENT got message: { result: 21 }
PARENT got message: { result: 21 }
PARENT got message: { result: 21 }
PARENT got message: { result: 21 }
PARENT got message: { result: 21 }
PARENT got message: { result: 21 }
CHILD calculating fibonacci number number:  8
PARENT got message: { result: 34 }
PARENT got message: { result: 34 }
PARENT got message: { result: 34 }
PARENT got message: { result: 34 }
PARENT got message: { result: 34 }
PARENT got message: { result: 34 }
PARENT got message: { result: 34 }
PARENT got message: { result: 34 }
PARENT got message: { result: 34 }
CHILD calculating fibonacci number number:  9
PARENT got message: { result: 55 }
PARENT got message: { result: 55 }
PARENT got message: { result: 55 }
PARENT got message: { result: 55 }
PARENT got message: { result: 55 }
PARENT got message: { result: 55 }
PARENT got message: { result: 55 }
PARENT got message: { result: 55 }
PARENT got message: { result: 55 }
PARENT got message: { result: 55 }
CHILD calculating fibonacci number number:  10
(node:68705) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 message listeners added to [ChildProcess]. Use emitter.setMaxListeners() to increase limit
PARENT got message: { result: 89 }
PARENT got message: { result: 89 }
PARENT got message: { result: 89 }
PARENT got message: { result: 89 }
PARENT got message: { result: 89 }
PARENT got message: { result: 89 }
PARENT got message: { result: 89 }
PARENT got message: { result: 89 }
PARENT got message: { result: 89 }
PARENT got message: { result: 89 }
PARENT got message: { result: 89 }
*/