const fibo = require('./fibo');

process.on('message', (message) => {
    console.log('CHILD calculating fibonacci number number: ', message.n);
    process.send({result: fibo.getNth(message.n)})
  });