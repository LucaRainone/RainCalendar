
var currentRequires = [];

var globalDefined = {};

function _require(name, path) {
    currentRequires.push(name);
    require(path);
}


// hand made define in order to make working coverage.
global.define = function(deps, cbk) {

    var ret;
    if(typeof deps === 'function') {
        ret = deps.apply(null, []);
    }else {
        var args = [];
        for (var i = 0; i < deps.length; i++) {
            _require(deps[i], "../../src/core/" + deps[i] + ".js");
            args.push(globalDefined[deps[i]])
        }

        ret = cbk.apply(null, args);
    }
    globalDefined[currentRequires.pop()] = ret;
};

_require("tests/utilsTest", "../../tests/spec/core/helpers/utilsTest");
