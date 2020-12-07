
// TODO? move filenames to config

const fs = require("fs")
const csv = require('csv-parser');
const logger = require("./logger");
const { Stream } = require("stream");
const filename = './events.csv'
const header = ['id', 'title', 'location', 'date', 'hour', 'etc']

// TODO: implement
// db.getAll(location) // returns an Array of events, filtered
// db.getById(eventId) // returns a single event or undefined
// db.delete(eventId) // returns true or false (was deleted or was not found)
// db.create(eventObj) // returns true or false (success?)
// db.replace(id, eventObj) // returns true or false (success?)
// db.streamAll // returns an Array of events not filtered


function parsedContent() {
    return fs.createReadStream(filename).pipe(csv(true))
}

function byLocation(location, entry) {
    return (location === undefined || 
            location === '' ||
            location === entry.location);
}

const temporaryFilename = 'combined.csv'

function replaceDbContent(newStream) {
    newStream.pipe(fs.createWriteStream(temporaryFilename));
    renameFile()
}

function transformStream() {
    return new Stream.Transform({
        transform(chunk, encoding, done) {
            done(null, chunk.toString())
        }
    })
}

function renameFile() {
    fs.rename(temporaryFilename, filename, () => {});
}

function validateFrom(params) {
    let entry = {};
    if (params["title"] === undefined) { return undefined }
    for (let field of header) { entry[field] = params[field] }
    return entry
}

function csvRow(entry) {
    return header.map(function(field) { return entry[field] }).join(",")
}

module.exports = {
    filename: filename,
    temporaryFilename: temporaryFilename,
    header: header,
    parsedContent: () => { return parsedContent() },
    byLocation: (location, entry) => { return byLocation(location, entry) },
    replaceDbContent: (newStream) => { replaceDbContent(newStream) },
    renameFile: () => { renameFile() },
    validateFrom: (params) => { return validateFrom(params) },
    csvRow: (entry)  => { return csvRow(entry) },
    entryToStringTransform: () => { return transformStream() }
}