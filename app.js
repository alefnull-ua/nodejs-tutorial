const configs = require('./config');
const logger = require('./logger');
/*
const http = require('http');
logger.warn('Running env: ' + configs.ENV);
const server = http.createServer((request, response) => {
    logger.log('.');
    response.statusCode = 200;
    response.end('Hello, world');
})
server.listen(configs.PORT, () => {logger.log('Listening on port ' + configs.PORT)});
*/

const express = require('express')
const app = express()
const port = configs.PORT
logger.warn('Running env: ' + configs.ENV);

const db = require('./mydb');
const fs = require('fs');

const csv = require('csv-parser');
const filename = "events.csv"

// Create GET /events-batch endpoint which returns all events in json format via streaming directly from csv file.
app.get('/events-batch', function(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write("[")
    let firstIndex = true;
    db.parsedContent()
        .on('data', (entry) => { 
            if (!firstIndex) res.write(",")
            res.write(JSON.stringify(entry))
            firstIndex =false
        })
        .on('end', () => {res.end("]")})
});

// Create GET /events?location=lviv endpoint which returns events from csv file in json format. 
//        It should support possible filtering events by location (passed as query parameter).
app.get('/events', function(req, res) {
    let csvData=[];
    const location = req.query.location;
    db.parsedContent()
        .on('data', function(csvrow) { if (db.byLocation(location, csvrow)) csvData.push(csvrow); })
        .on('end',  function()       { res.json(csvData); });
});

// Create GET /events/:eventId endpoint for getting some specific event by id.
app.get('/events/:eventId', function(req, res) {
    const eventId = req.params.eventId;
    let existing;
    db.parsedContent()
        .on('data', function(csvrow) { if (eventId === csvrow.id) { existing = csvrow }})
        .on('end', function() { existing === undefined ? res.sendStatus(404) : res.json(existing) });
});

// useful for POST
const CombinedStream = require('combined-stream');
const { Readable } = require("stream")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create POST /events endpoint for saving new event to the csv file.
app.post('/events', function(req, res) {
    const eventId = req.body.id;
    if (eventId === undefined) {res.status(400); res.end("specify id")}
    const entry = validateFrom(req.body);
    if (entry === undefined) { res.sendStatus(400); return }
    let existing;
    parsedContent()
        .on('data', function(csvrow) { if (eventId === csvrow.id) { existing = csvrow }})
        .on('end', function() { return existing });

    if (existing !== undefined) { res.status(400); res.end("already exists"); return; }

    let combinedStream = CombinedStream.create();
    combinedStream.append(fs.createReadStream(db.filename));
    combinedStream.append(Readable.from(["\n" + csvRow(entry)]));
    db.replaceDbContent(combinedStream);
    res.sendStatus(201);
});

// Create DELETE /events/:eventId endpoint for deleting some specific event by id.
app.delete('/events/:eventId', function(req, res) { 
    const eventId = req.params.eventId;
    if (eventId === undefined) {res.sendStatus(400); res.end("specify existing id")}
    let outputFileDescr = fs.openSync('combined.csv', 'w')
    fs.writeFileSync(outputFileDescr, db.header.join(",") + "\n")
    db.parsedContent()
      .on('data', function(csvrow) {
          if (csvrow.id !== eventId) fs.writeFileSync(outputFileDescr, db.csvRow(csvrow) + "\n")
        })
      .on('end', function() { 
          fs.closeSync(outputFileDescr);
          db.renameFile();
          res.sendStatus(200)
        })
})

// Create PUT /events/:eventId endpoint for replacing specific event data in csv file.
app.put('/events/:eventId', function(req, res) { 
    const eventId = req.params.eventId;
    if (eventId === undefined) {res.sendStatus(400); res.end("specify existing id")}
    const entry = validateFrom(req.body);
    if (entry === undefined) { res.sendStatus(400); return }
    let outputFileDescr = fs.openSync(db.temporaryFilename, 'w')
    fs.writeFileSync(outputFileDescr, db.header.join(",") + "\n")
    parsedContent()
      .on('data', function(csvrow) {
          if (csvrow.id === eventId) {
              entry.id = eventId
              fs.writeFileSync(outputFileDescr, csvRow(entry) + "\n")
          } else {
            fs.writeFileSync(outputFileDescr, csvRow(csvrow) + "\n")
          }
        })
      .on('end', function() { 
          fs.closeSync(outputFileDescr);
          db.renameFile();
          res.sendStatus(200)
        })
})


app.listen(port, () => {
  console.log(`Calendar listening at http://localhost:${port}`)
})
