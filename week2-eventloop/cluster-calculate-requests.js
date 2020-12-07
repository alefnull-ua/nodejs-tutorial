/*********** cluster */
const cluster = require('cluster');
const http = require('http');
const numCPUs = 6; //require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  var requestsCount = 0;
  process.on('SIGINT', (code, signal) => {
    console.log(`worker ${process.pid} processed ${requestsCount} requests`);
  });

  http.createServer((req, res) => {
    requestsCount += 1;
    res.writeHead(200);
    res.end(`hello world\nFrom ${process.pid}\n`);
  }).listen(8000);

  console.log(`Worker ${process.pid} started with parent ${process.ppid}`);
}

// for f in `seq 100`; do curl -s localhost:8000; done > /dev/null

// node cluster-calculate-requests.js
// Master 65875 is running
// Worker 65876 started with parent 65875
// Worker 65877 started with parent 65875
// Worker 65878 started with parent 65875
// Worker 65879 started with parent 65875
// Worker 65880 started with parent 65875
// Worker 65881 started with parent 65875
// ^Cworker 65881 processed 16 requests
// worker 65879 processed 17 requests
// worker 65880 processed 16 requests
// worker 65877 processed 17 requests
// worker 65878 processed 17 requests
// worker 65876 processed 17 requests