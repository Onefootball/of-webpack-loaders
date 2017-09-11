// var loaderUtils = require('loader-utils');
var fs = require('fs');
var path = require('path');
var LOADER_NAME = 'requireSVGtoB64';
var regExps = [
    /requireSVGtoB64\(\'(.*?\.svg)\'\);/g,
    /requireSVGtoB64\(\"(.*?\.svg)\"\);/g,
];
var svgURIPrefix = `data:image/svg+xml;base64,`;
var cache = {};

module.exports = function (source, map) {
    // var options = loaderUtils.getOptions(this);
    if (source === undefined) {
        return this.callback(null, source, map);
    }
    if (source.replace === undefined) {
        return this.callback(null, source, map);
    }

    for (var i = 0; i < regExps.length; i++) {
        var regExp = regExps[i];
        source = source.replace(regExp, loaderReplacer);
    }
    this.callback(null, source, map);
};

function loaderReplacer(loaderMatchedString, foundSvgPath) {
    // try to return a cached value
    if (cache[loaderMatchedString]) {
        return cache[loaderMatchedString];
    }
    var svgFilePath = path.resolve('./', foundSvgPath);
    try {
        // resolve the file
        var svgString = fs.readFileSync(svgFilePath).toString();
        // convert it to base64
        var base64String = svgURIPrefix + (Buffer.from(svgString).toString('base64'));
        // store it in the cache
        cache[loaderMatchedString] = base64String;
        // return it
        return base64String;
    } catch (e) {
        console.log('\n['+ LOADER_NAME + '] not found:', svgFilePath, '\n');
        // nothing
    }
    return loaderMatchedString
}
