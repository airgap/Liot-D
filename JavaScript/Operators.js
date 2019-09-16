"use strict";
exports.__esModule = true;
var Filter_1 = require("./Filter");
var er = Filter_1.Filter.evaluateReduce, en = Filter_1.Filter.evaluateFilterNode, And = function (packet, parameters) { return er(parameters, packet, function (a, b) { return a && b; }); }, Nand = function (n, p) { return !And(n, p); }, Or = function (packet, parameters) { return er(parameters, packet, function (a, b) { return a || b; }); }, Nor = function (n, p) { return !Or(n, p); }, Equals = function (packet, parameters) {
    var paramZero = en(packet, parameters.splice(0, 1)[0]);
    for (var _i = 0, parameters_1 = parameters; _i < parameters_1.length; _i++) {
        var p = parameters_1[_i];
        if (paramZero != en(packet, p))
            return !1;
    }
    return !0;
}, Nequals = function (n, p) { return !Equals(n, p); }, Under = function (packet, parameters) {
    for (var p = 1; p < parameters.length; p++)
        if (en(packet, parameters[p - 1])
            >= en(packet, parameters[p]))
            return !1;
    return !0;
}, Nunder = function (n, p) { return !Under(n, p); }, Add = function (c, m) { return er(m, c, function (a, b) { return a + b; }); }, Sub = function (c, m) { return er(m, c, function (a, b) { return a - b; }); }, Mul = function (c, m) { return er(m, c, function (a, b) { return a * b; }); }, Div = function (c, m) { return er(m, c, function (a, b) { return a / b; }); }, Exp = function (c, m) { return er(m, c, function (a, b) { return Math.pow(a, b); }); }, Includes = function (packet, parameters) {
    var paramZero = en(packet, parameters.splice(0, 1)[0]);
    for (var _i = 0, parameters_2 = parameters; _i < parameters_2.length; _i++) {
        var p = parameters_2[_i];
        if (paramZero.includes(en(packet, p)))
            return !1;
    }
    return !0;
};
exports.Operators = { And: And, Nand: Nand, Or: Or, Nor: Nor, Equals: Equals, Nequals: Nequals, Under: Under, Nunder: Nunder, Add: Add, Sub: Sub, Mul: Mul, Div: Div, Exp: Exp, Includes: Includes };
