
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


module.exports = {
    filename: filename,
    header: header
}