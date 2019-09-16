"use strict";
exports.__esModule = true;
var Router = /** @class */ (function () {
    function Router() {
        this.listeners = [];
    }
    Router.prototype.listen = function (listener) {
        this.listeners.push(listener);
        return true;
    };
    Router.prototype.send = function (data) {
        console.log('do send', data, this.listeners);
        this.listeners.forEach(function (listener) { return listener.filter.evaluatePacket(data) ? listener.action(data) : 0; });
    };
    Router.prototype.silence = function (listener) {
        var pos = this.listeners.indexOf(listener);
        this.listeners.splice(pos, 1);
    };
    return Router;
}());
exports.Router = Router;
