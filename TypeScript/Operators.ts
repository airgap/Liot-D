import { Filter } from './Filter';
const
    er = Filter.evaluateReduce,
    en = Filter.evaluateFilterNode,
    And = (packet, parameters) => er(parameters, packet, (a, b)=>a&&b),
    Nand = (n, p) => !And(n, p),
    Or = (packet, parameters) => er(parameters, packet, (a, b)=>a||b),
    Nor = (n, p) => !Or(n, p),
    Equals = (packet, parameters) => {
        const paramZero = en(packet, parameters.splice(0,1)[0]);
        for (let p of parameters)
            if(paramZero != en(packet, p))
                return !1;
        return !0;
    },
    Nequals = (n, p) => !Equals(n, p),
    Under = (packet, parameters) => {
        for (let p = 1; p < parameters.length; p++)
            if(en(packet, parameters[p-1])
                >= en(packet, parameters[p]))
                return !1;
        return !0;
    },
    Nunder = (n, p) => !Under(n, p),
    Add = (c, m) => er(m, c, (a, b)=>a+b),
    Sub = (c, m) => er(m, c, (a, b)=>a-b),
    Mul = (c, m) => er(m, c, (a, b)=>a*b),
    Div = (c, m) => er(m, c, (a, b)=>a/b),
    Exp = (c, m) => er(m, c, (a, b)=>a**b),
    Includes = (packet, parameters) => {
        const paramZero = en(packet, parameters.splice(0,1)[0]);
        for (let p of parameters)
            if(paramZero.includes(en(packet, p)))
                return !1;
        return !0;
    };

export const Operators = { And, Nand, Or, Nor, Equals, Nequals, Under, Nunder, Add, Sub, Mul, Div, Exp, Includes };