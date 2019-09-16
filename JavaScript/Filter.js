"use strict";
exports.__esModule = true;
var Operators_1 = require("./Operators");
var Filter = /** @class */ (function () {
    function Filter(condition) {
        this.valid = Filter.validateFilter(typeof condition === 'string'
            ? Filter.parseFilter(condition)
            : condition);
        if (this.valid)
            this.condition = condition;
    }
    Filter.validateFilter = function (condition) {
        return this.validateFilterNode(condition);
    };
    Filter.validateFilterNode = function (condition) {
        //console.log('Validating node ', condition)
        if (typeof condition === 'object' && Object.keys(condition)[0] in Operators_1.Operators) {
            //console.log("Is object with valid key")
            var array = condition[Object.keys(condition)[0]];
            if (array && Array.isArray(array)) {
                //console.log('Valid array', array)
                for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                    var param = array_1[_i];
                    if (!this.validateFilterNode(param))
                        return false;
                }
                return true;
            }
            return false;
        }
        else
            return ['string', 'number'].indexOf(typeof condition) >= 0;
    };
    Filter.evaluateFilterNode = function (packet, condition) {
        switch (typeof condition) {
            case 'object':
                var operator = Object.keys(condition)[0];
                if (operator in Operators_1.Operators) {
                    var array = condition[operator];
                    return Array.isArray(array) && array.length ? Operators_1.Operators[operator](packet, array) : null;
                }
                break;
            case 'string':
                return Filter.extractParameter(packet, condition);
            default: return condition;
        }
    };
    Filter.parseFilter = function (text) {
        var lines = text.trim().replace(/\n\s+/g, '\n').split('\n');
        var output = '', depth = 0;
        var remaining = [];
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            if (line in Operators_1.Operators) {
                remaining[depth]--;
                output += spaces(depth) + "{\"" + line + "\": [\n";
                depth++;
                remaining[depth] = 2;
            }
            else {
                output += "" + spaces(depth) + line + (remaining[depth] == 2 ? ',' : '') + "\n";
                remaining[depth]--;
                if (!remaining[depth]) {
                    depth--;
                    output += spaces(depth) + "]}" + (remaining[depth] > 0 ? ',' : '') + "\n";
                }
            }
        }
        while (depth--)
            output += ']}';
        return JSON.parse(output);
        function spaces(depth) {
            for (var i = 0, s = ''; i < depth; i++)
                s += '  ';
            return s;
        }
    };
    Filter.extractParameter = function (packet, condition) {
        if (condition[0] == '$') {
            condition = condition.substr(1).split('.');
            for (var _i = 0, condition_1 = condition; _i < condition_1.length; _i++) {
                var p = condition_1[_i];
                if (packet && p in packet)
                    packet = packet[p];
                else
                    return null;
            }
            return packet;
        }
        return condition;
    };
    Filter.prototype.evaluatePacket = function (packet) {
        return Filter.evaluateFilterNode(packet, this.condition);
    };
    Filter.evaluateReduce = function (parameters, packet, reducer) { return parameters.map(function (p) { return Filter.evaluateFilterNode(packet, p); }).reduce(reducer); };
    return Filter;
}());
exports.Filter = Filter;
