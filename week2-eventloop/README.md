Event loop:
recreate code from presentation
code that may behave differently on different runs (1 file)

eventloops-replay.js

write server with api that blocks loop (and prove it) (2 file)
same api non-blocking
*Question: event loop & streams (.on(‘data’, ...) handlers)

Clusters:
recreate code from presentations

eventloops-replay.js

create cluster with 6 workers. Run small server with some api. Run script that performs 100 calls to this server. Calculate on server how many requests handled each worker.
RUN:
node cluster-calculate-requests.js

CHECK:
for f in `seq 100`; do curl -s localhost:8000; done > /dev/null
see logs in the commented lines in cluster-calculate-requests.js

Workers:
calculate n-th Fibonacci number on worker thread (can be as api) (1 or 2 files)
RUN:
node workers-fibo.js
CHECK:
for f in `seq 10`; do curl localhost:8000?n=$f; done
see logs in the commented lines in workers-fibo.js

Child/Parent Process:
calculate n-th Fibonacci number on child process (can be as api) (2 files)
RUN:
node fibo-parent.js
CHECK:
for f in `seq 10`; do curl localhost:8000?n=$f; done
see logs in the commented lines in fibo-parent.js