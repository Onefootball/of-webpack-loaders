var fs = require('fs');
var path = require('path');
var SVGO = require('svgo');

var regExp = /requireSVGtoString\(\'(.*?\.svg)\'\);|requireSVGtoString\(\'(.*?\.svg)\', '(.*)'\);/g

var config = {
    cleanupAttrs: true,
    removeDoctype: true,
    removeMetadata: true,
    removeEmptyAttrs: true,
    cleanupIDs: true,
    plugins: [
      {
        removeAttrs: {
          active: true,
          attrs: ['svg:class']
        }
      },
    ]
  };

var cache = {};

module.exports = function (source, map) {
    this.cacheable();
    var callbackEnd = this.async();

    if (source === undefined) {
        return callbackEnd(null, source);
    }
    if (source.replace === undefined) {
        return callbackEnd(null, source);
    }
    if (!regExp.test(source)) {
        return callbackEnd(null, source);
    }

    var matched = source.match(regExp);

    if (matched.length === 0) {
        return callbackEnd(null, source);
    }

    var proms = [];

    source.replace(regExp, function(loaderMatchedString, matchGroup1, matchGroup2, matchGroup3) {
        var additionalClasses = matchGroup3;
        var foundSvgPath = matchGroup2 || matchGroup1;
        proms.push(new Promise(function(resolveSvgMatch, rejectSvgMatch) {
            try {
                var currentConfig = Object.assign({}, config);
                currentConfig.plugins.push({
                    addClassesToSVGElement: {
                        active: true,
                        classNames: [additionalClasses]
                    }
                });
                var fileData = cache[foundSvgPath] || fs.readFileSync(path.resolve(foundSvgPath));
                cache[foundSvgPath] = fileData;

                var svgoConverter = new SVGO(currentConfig);
                svgoConverter.optimize(fileData, function(result) {
                    var svgString = result.data;
                    resolveSvgMatch({
                        match: loaderMatchedString,
                        replacement: svgString
                    });
                });
            } catch (e) {
                return rejectSvgMatch(e);
            }
        }));
    });

    Promise.all(proms)
        .then(function(done) {
            done.forEach(function(replacementData) {
                if (replacementData) {
                    source = source.replace(replacementData.match, replacementData.replacement);
                }
            });
            callbackEnd(null, source, map);
        })
        .catch(function(err) {
            callbackEnd(err);
        });
};
