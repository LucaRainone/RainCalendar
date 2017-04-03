var Transform =require('stream').Transform;
var cutter = require("./cutter");

function defineCut(file, options) {
    var str = file.contents;
    file.contents = new Buffer(cutter.defineCutter(str, options));
    return file;
}

module.exports = function(options) {
    // Monkey patch Transform or create your own subclass,
    // implementing `_transform()` and optionally `_flush()`
    var transformStream = new Transform({objectMode: true});
    /**
     * @param {Buffer|string} file
     * @param {string=} encoding - ignored if file contains a Buffer
     * @param {function(Error, object)} callback - Call this function (optionally with an
     *          error argument and data) when you are done processing the supplied chunk.
     */
    transformStream._transform = function(file, encoding, callback) {

        var error = null,
            output = defineCut(file, options);
        callback(error, output);
    };

    return transformStream;
};