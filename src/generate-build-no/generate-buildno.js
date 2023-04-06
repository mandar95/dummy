/*
 * @desc: To create a new version every time build is created
 * @output: Version number.month.day.iteration
 */

var fs = require('fs');
console.warn('\x1b[33m%s\x1b[0m', 'Incrementing build number...');
const d = new Date();
const year = d.getFullYear();
const month = d.getMonth() + 1;
const day = d.getDate();
fs.readFile('src/generate-build-no/metadata.json', function (err, content) {
    if (err) throw err;
    var metadata = JSON.parse(content);
    metadata.buildMajor = year - 2021
    metadata.buildRevision = metadata.buildDay === day ? metadata.buildRevision + 1 : 0;
    metadata.buildMonth = month;
    metadata.buildDay = day;
    fs.writeFile('src/generate-build-no/metadata.json', JSON.stringify(metadata), function (err) {
        if (err) throw err;
        console.warn('\x1b[31m%s\x1b[0m', `Current build number: v${metadata.buildMajor}.${metadata.buildMonth}.${metadata.buildDay}.${metadata.buildRevision} ${metadata.buildTag}`);
    })
});
