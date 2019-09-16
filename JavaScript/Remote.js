"use strict";
exports.__esModule = true;
//import * as request from 'request';
var https = require("https");
var http = require("http");
var Remote = /** @class */ (function () {
    function Remote(url) {
        var _this = this;
        if (url === void 0) { url = 'http://localhost:7788'; }
        this.url = url;
        this.req = function (action, data, callback) {
            var match = function (reg, def) { return (_this.url.match(reg) || [0, def])[1]; }, dataString = JSON.stringify({ action: action, data: data }), req = (match(/^([a-z]+):\/\//, 'http') == 'https' ? https : http)
                .request({
                hostname: match(/^[a-z]+:\/\/(.+?)\//, 'localhost'),
                port: match(/^[a-z]+:\/\/.+?:([0-9]+)/, 7788),
                path: match(/^[a-z]+:\/\/.+?:[0-9]+(\/.+)/, '/'),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': dataString.length
                }
            }, function (res) {
                var data = '';
                res.on('data', function (d) { return data += d; });
                res.on('end', function () { return callback(data); });
            });
            req.on('error', console.error);
            req.write(dataString);
            req.end();
        };
    }
    Remote.prototype.listen = function (_a) {
        var filter = _a.filter, action = _a.action;
        this.req('listen', filter.condition, action);
    };
    Remote.prototype.send = function (data, callback) {
        this.req('send', data, callback);
    };
    return Remote;
}());
exports.Remote = Remote;
