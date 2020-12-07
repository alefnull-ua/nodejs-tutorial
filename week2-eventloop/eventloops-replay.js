// console.log('Promises and microtasks and global.queueMicrotask')

// setTimeout(() => console.log('T'),0)
// process.nextTick(() => console.log('next tick1'))
// global.queueMicrotask(() => console.log('queueM'))
// process.nextTick(() => console.log('next tick2'))
// Promise.resolve().then(() => console.log('nextP'))
// console.log('simple log')


// console.log('**************')
// console.log('Node.js vs browser JS')
// setTimeout(() => console.log('timeout1'));
// setTimeout(() => { console.log('timeout2'); Promise.resolve().then(() => console.log('promise resolve'));});
// setTimeout(() => console.log('timeout3'));
// setTimeout(() => console.log('timeout4'));


// setTimeout(() => console.log('timeout1'));
// setTimeout(() => { console.log('timeout2'); Promise.resolve().then(() => console.log('promise resolve'));});
// setImmediate(() => console.log('timeout3'));
// setTimeout(() => console.log('timeout4'));
// same output as with setTimeout, same difference with v10/v12
// timeout3 comes first,
// "promise resolve" comes before timeout4 in v12, comes last in v10 (should we care?)

// setTimeout(() => console.log('timeout1'));
// setImmediate(() => { console.log('timeout2'); Promise.resolve().then(() => console.log('promise resolve'));});
// setTimeout(() => console.log('timeout3'));
// setTimeout(() => console.log('timeout4'));
// v12: timeout2 -> promise resolve -> timeout1 -> timeout3 -> timeout4
// v10: timeout1 -> timeout3 -> timeout4 -> timeout2 -> promise resolve

// setTimeout(() => console.log('timeout1'));
// setTimeout(() => { console.log('timeout2'); process.nextTick(() => console.log('promise resolve'));});
// setTimeout(() => console.log('timeout3'));
// setTimeout(() => console.log('timeout4'));
// same output as with Promise.resolve(), same difference with v10/v12


// code example for queueMicrotask and nextTick
// Promise.resolve().then(() => console.log('promise1 resolved'));
// Promise.resolve().then(() => console.log('promise2 resolved'));
// Promise.resolve().then(() => {
//    console.log('promise3 resolved');
//    process.nextTick(() => console.log('next tick inside promise resolve handler'));
// });
// Promise.resolve().then(() => console.log('promise4 resolved'));
// Promise.resolve().then(() => console.log('promise5 resolved'));
// setImmediate(() => console.log('set immediate1'));
// setImmediate(() => console.log('set immediate2'));

// process.nextTick(() => console.log('next tick1'));
// process.nextTick(() => console.log('next tick2'));
// process.nextTick(() => console.log('next tick3'));

// setTimeout(() => console.log('set timeout'), 0);
// setImmediate(() => console.log('set immediate3'));
// setImmediate(() => console.log('set immediate4'));
/*
next tick1
next tick2
next tick3
promise1 resolved
promise2 resolved
promise3 resolved
promise4 resolved
promise5 resolved
next tick inside promise resolve handler
set timeout
set immediate1
set immediate2
set immediate3
set immediate4
*/

// child processes slide

// const { spawn } = require('child_process');
// const ls = spawn('ls', ['-lhr', '/proc']);

// ls.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });

// ls.stderr.on('data', (data) => {
//   console.error(`stderr: ${data}`);
// });

// ls.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// });

// stderr: ls: /proc: No such file or directory
// child process exited with code 1

// const cp = require('child_process');
// const n = cp.fork(`${__dirname}/sub.js`);
// console.log('parent id ', process.pid);
// console.log('child from parent point of view ', n.pid);
// n.on('message', (m) => {
//   console.log('PARENT got message:', m);
// });

// // Causes the child to print: CHILD got message: { hello: 'world' }
// n.send({ hello: 'world' });


//****** 
// blocking event loop
/*
function repeat(num) {
    for (let i=0; i< num; i++) {
        for (let j=0; j< num; j++) {
            console.log(`${i}.${j}`);
        }
    }
}

const startedAt = new Date();
repeat(1000);
// setTimeout(() => console.log('Next: ', new Date() - startedAt ));
process.nextTick(() => console.error('Next: ', new Date() - startedAt ));
*/

/*
process.env.UV_THREADPOOL_SIZE = 5

const crypto = require("crypto");
const start = Date.now();

function logHashTime() {
 crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
   console.log("Hash: ", Date.now() - start);
 });
}
logHashTime();
logHashTime();
logHashTime();
logHashTime();
logHashTime();
*/

