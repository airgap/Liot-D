import {Operators} from './Operators';
export class Filter {
    condition: any;
    valid: boolean;
    constructor(condition) {
        this.valid = Filter.validateFilter(
            typeof condition === 'string' 
            ? Filter.parseFilter(condition)
            : condition
        );
        if (this.valid)
            this.condition = condition;
    }
    public static validateFilter(condition: any): boolean {
        return this.validateFilterNode(condition);
    }


    public static evaluateReduce = (parameters, packet, reducer) => parameters.map(p=>Filter.evaluateFilterNode(packet, p)).reduce(reducer);

    public static validateFilterNode(condition) {
        //console.log('Validating node ', condition)
        if (typeof condition === 'object' && Object.keys(condition)[0] in Operators) {
            //console.log("Is object with valid key")
            let array = condition[Object.keys(condition)[0]];
            if (array && Array.isArray(array)) {
                //console.log('Valid array', array)
                for (const param of array) {
                    if (!this.validateFilterNode(param)) return false;
                }
                return true;
            }
            return false;
        } else return ['string', 'number'].indexOf(typeof condition) >= 0;
    }

    public static evaluateFilterNode(packet, condition) {
        switch(typeof condition) {
            case 'object':
                const operator = Object.keys(condition)[0];
                if(operator in Operators) {
                    const array = condition[operator];
                    return Array.isArray(array) && array.length ? Operators[operator](packet, array) : null;
                }
                break;
            case 'string':
                return Filter.extractParameter(packet, condition);
            default: return condition;
        }
    }

    static parseFilter(text) {
        const lines = text.trim().replace(/\n\s+/g, '\n').split('\n');
        let output = '', depth = 0;
        const remaining = [];
        for (const line of lines) {
            if(line in Operators) {
                remaining[depth] --;
                output += `${spaces(depth)}{"${line}": [\n`;
                depth++;
                remaining[depth] = 2;
            } else {
                output += `${spaces(depth)}${line}${remaining[depth]==2?',':''}\n`;
                remaining[depth] --;
                if(!remaining[depth]) {
                    depth --;
                    output += `${spaces(depth)}]}${remaining[depth]>0?',':''}\n`
                }
            }
        }
        while (depth--) output += ']}';
        return JSON.parse(output);

        function spaces(depth) {
            for (var i = 0, s = ''; i < depth; i++) s += '  ';
            return s;
        }
    }

    public static extractParameter(packet, condition) {
        if (condition[0] == '$') {
            condition = condition.substr(1).split('.');
            for (let p of condition)
                if (packet && p in packet)
                    packet = packet[p];
                else return null;
            return packet
        }
        return condition;
    }

    public evaluatePacket(packet) {
        return Filter.evaluateFilterNode(packet, this.condition);
    }
}
