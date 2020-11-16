
// TODO? use config with filename

const fs = require("fs")
const csv = require('csv-parser');
const logger = require("./logger");
const filename = './events.csv'
const header = ['id', 'title', 'location', 'date', 'hour', 'etc']

// TODO: implement
// db.getAll(location) // returns an Array of events, filtered
// db.getById(eventId) // returns a single event or undefined
// db.delete(eventId) // returns true or false (was deleted or was not found)
// db.create(eventObj) // returns true or false (success?)
// db.replace(id, eventObj) // returns true or false (success?)
// db.streamAll // returns an Array of events not filtered

function readContent() {
    return fs.createReadStream(filename).pipe(csv())
}

function renameFile() {
    fs.rename(filename, writtenBuffer)
}

function predicatedContent(predicate) {
    let csvData=[];
    readContent()
        .on('data', function(csvrow) { if (predicate(csvrow)) csvData.push(csvrow); })
        .on('end',  function()       { console.log(csvData); return csvData; });
}

function locationPredicate(location, entry) {
    return (location === undefined || 
            location === '' ||
            location === entry.location);
}

function findByIdPredicate(eventId, entry) {
    return entry.id === eventId
}

module.exports = {
    filename: filename,
    header: header,

    getAll : (location) => {
        console.log('Getting all for location ', location);
        return predicatedContent((row) => locationPredicate(location, row))},
    getById : (eventId) => {
        return predicatedContent((row) => findByIdPredicate( eventId, row)[0])},
    delete: (eventId) => {
        let found = predicatedContent((row) => findByIdPredicate( eventId, row)[0])
        if (found) {
            writeContent( predicatedContent((row) => !findByIdPredicate( eventId, row) ))
            renameFile();
        }
        return found
    },
    create: (eventObj) => {
        let found = predicatedContent((row) => findByIdPredicate(eventObj.id, row)[0]);
        if (found) return false; // bad parameters
        writeContent( readContent() + eventObj )
        renameFile();
        return true; // success
    },
    replace: (id, eventObj) => {
        let found = predicatedContent((row) => findByIdPredicate(eventObj.id, row)[0]);
        if (!found) return false; //bad parameters
        writeContent(
            predicatedContent((row) => !findByIdPredicate(id, row) ) + eventObj
        )
        return true
    },
    streamAll: () => { return fs.createReadStream(filename) } // and put it to response
}