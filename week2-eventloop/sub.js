// sub.js

console.log("CHILD:", process.pid);
console.log("CHILD's parent: ", process.ppid);

process.on('message', (m) => {
    console.log('CHILD got message:', m);
});
  
  // Causes the parent to print: PARENT got message: { foo: 'bar', baz: null }
process.send({ foo: 'bar', baz: NaN });
  