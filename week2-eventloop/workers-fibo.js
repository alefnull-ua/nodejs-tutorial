// calculate n-th Fibonacci number on worker thread (can be as api) 

const { Worker, MessageChannel, isMainThread, parentPort } = require('worker_threads');
const fibo = require('./fibo');
const http = require('http');
const url = require('url');

  if (isMainThread) {
    http.createServer((req, res) => {
        // inspired by https://nodejs.org/en/knowledge/HTTP/clients/how-to-access-query-string-parameters/
        const queryObject = url.parse(req.url,true).query;

        let worker = new Worker(__filename);
        let subChannel = new MessageChannel();
        
        worker.postMessage({ portFromParent: subChannel.port1, n: queryObject.n }, [subChannel.port1]);
        subChannel.port2.on('message', (value) => {
          console.log('received:', value);
          res.writeHead(200);
          res.end(`Fibonacci for ${queryObject.n} has value ${value}\n`);
        });
    }).listen(8000);
  } else {
    parentPort.once('message', (value) => {
      //   assert(value.hereIsYourPort instanceof MessagePort);
      console.log(`calculating ${value.n}th Fibonacci number in the process ${process.pid}...\n`)
      const fibonacci = fibo.getNth(value.n);
      console.log(`Result is ${fibonacci}\n`)
      value.portFromParent.postMessage(`the worker calculated ${fibonacci}`);
      value.portFromParent.close();
    });
  }

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

// logs
// calculating 1th Fibonacci number in the process 68171...

// received: the worker calculated 1
// Result is 1

// calculating 2th Fibonacci number in the process 68171...

// received: the worker calculated 2
// Result is 2

// calculating 3th Fibonacci number in the process 68171...

// received: the worker calculated 3
// Result is 3

// calculating 4th Fibonacci number in the process 68171...

// received: the worker calculated 5
// Result is 5

// calculating 5th Fibonacci number in the process 68171...

// received: the worker calculated 8
// Result is 8

// calculating 6th Fibonacci number in the process 68171...

// received: the worker calculated 13
// Result is 13

// calculating 7th Fibonacci number in the process 68171...

// received: the worker calculated 21
// Result is 21

// calculating 8th Fibonacci number in the process 68171...

// received: the worker calculated 34
// Result is 34

// calculating 9th Fibonacci number in the process 68171...

// received: the worker calculated 55
// Result is 55

// calculating 10th Fibonacci number in the process 68171...

// received: the worker calculated 89
// Result is 89