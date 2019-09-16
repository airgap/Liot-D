//import * as request from 'request';
import * as https from 'https';
import * as http from 'http';
import {Listener} from "./Listener";

class Remote {
    constructor(private url: string = 'http://localhost:7788') {
    }
    listen({filter, action}: Listener) {
        this.req('listen', filter.condition, action);
    }
    send(data: object, callback?) {
        this.req('send', data, callback);
    }

    req = (action: string, data: object, callback: Function) => {
        const match = (reg, def) => (this.url.match(reg)||[0,def])[1],
            dataString = JSON.stringify({action, data}),
            req = (match(/^([a-z]+):\/\//,'http') == 'https' ? https : http)
                .request({
                    hostname: match(/^[a-z]+:\/\/(.+?)\//,'localhost'),
                    port: match(/^[a-z]+:\/\/.+?:([0-9]+)/,7788),
                    path: match(/^[a-z]+:\/\/.+?:[0-9]+(\/.+)/,'/'),
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': dataString.length
                    }
                }, res => {
                    let data = '';
                    res.on('data', d => data += d);
                    res.on('end', () => callback(data));
                });
        req.on('error', console.error);
        req.write(dataString);
        req.end();
    };
}

export { Remote };