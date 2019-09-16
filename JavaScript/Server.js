"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Router_1 = require("./Router");
var Filter_1 = require("./Filter");
var http = require("http");
var Listener_1 = require("./Listener");
var Server = /** @class */ (function (_super) {
    __extends(Server, _super);
    function Server(config) {
        if (config === void 0) { config = { port: 7788 }; }
        var _this = _super.call(this) || this;
        _this.config = config;
        _this.actions = {
            send: function (json, res) {
                var data = json.data;
                _this.send(data);
                res.end(JSON.stringify({ status: 'OK' }));
            },
            listen: function (json, res) {
                var filter = json.data;
                var listener = new Listener_1.Listener(new Filter_1.Filter(filter));
                listener.action = function (data) {
                    _this.silence(listener);
                    res.end(JSON.stringify({ data: data }));
                };
                _this.listen(listener);
            }
        };
        _this.request = function (req, res) {
            var data = '';
            req.on('data', function (d) { return data += d; });
            req.on('end', function () {
                var json = JSON.parse(data);
                if (json.action in _this.actions)
                    _this.actions[json.action](json, res);
            });
        };
        _this.server = http.createServer(_this.request);
        return _this;
    }
    Server.prototype.open = function (port) {
        if (port === void 0) { port = this.config.port; }
        this.server.listen(port);
    };
    Server.prototype.close = function () {
        this.server.close();
    };
    return Server;
}(Router_1.Router));
exports.Server = Server;
