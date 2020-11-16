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

function parsedContent() {
    return fs.createReadStream(db.filename).pipe(csv(true))
}

function byLocation(location, entry) {
    return (location === undefined || 
            location === '' ||
            location === entry.location);
}

// Create PUT /events/:eventId endpoint for replacing specific event data in csv file.

// Create GET /events-batch endpoint which returns all events in json format via streaming directly from csv file.
app.get('/events-batch', function(req, res) {
    fs.readFile(db.filename, (err, data) => {
        if (err) throw err;
        res.end(data);
    })
});

// Create GET /events?location=lviv endpoint which returns events from csv file in json format. 
//        It should support possible filtering events by location (passed as query parameter).
app.get('/events', function(req, res) {
    let csvData=[];
    const location = req.query.location;
    parsedContent()
        .on('data', function(csvrow) { if (byLocation(location, csvrow)) csvData.push(csvrow); })
        .on('end',  function()       { res.json(csvData); });
});

// Create GET /events/:eventId endpoint for getting some specific event by id.
app.get('/events/:eventId', function(req, res) {
    const eventId = req.params.eventId;
    let existing;
    parsedContent()
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
    replaceDbContent(combinedStream);
    res.sendStatus(201);
});

function replaceDbContent(newStream) {
    newStream.pipe(fs.createWriteStream('combined.csv'));
    fs.rename('combined.csv', db.filename, () => {});
}

function validateFrom(params) {
    let entry = {};
    if (params["title"] === undefined) { return undefined }
    for (let field of db.header) { entry[field] = params[field] }
    return entry
}

function csvRow(entry) {
    return db.header.map(function(field) { return entry[field] }).join(",")
}

// Create DELETE /events/:eventId endpoint for deleting some specific event by id.
app.delete('/events/:eventId', function(req, res) { 
    // db.delete(req.params.eventId) ? res.sendStatus(200) : res.sendStatus(404) })
    const eventId = req.params.eventId;
    if (eventId === undefined) {res.sendStatus(400); res.end("specify existing id")}
    // if (findExisting(eventId) === undefined) { res.status(404); res.end("specify existing id"); return }
})
/*
    .post(   function(req, res) { db.create(req.query) ? res.sendStatus(201) : res.sendStatus(400) });

    .put(    function(req, res) { db.replace(req.params.eventId, req.query) ? res.sendStatus(201) : res.sendStatus(404) })
*/

app.listen(port, () => {
  console.log(`Calendar listening at http://localhost:${port}`)
})
