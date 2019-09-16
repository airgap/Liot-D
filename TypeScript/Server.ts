import { Router } from "./Router";
import { Filter } from "./Filter";
import * as http from "http";
import {Listener} from "./Listener";

interface ServerArgs {
    port?: number;
}

class Server extends Router {
    server;
    actions = {
        send: (json: any, res: any) => {
            let data = json.data;
            this.send(data);
            res.end(JSON.stringify({status:'OK'}))
        },
        listen: (json: any, res: any) => {
            let filter = json.data;
            const listener = new Listener(new Filter(filter));
            listener.action = data => {
                this.silence(listener);
                res.end(JSON.stringify({data}));
            };
            this.listen(listener);
        }
    };
    constructor(private config: ServerArgs = {port: 7788}) {
        super();
        this.server = http.createServer(this.request)
    }
    open(port = this.config.port) {
        this.server.listen(port)
    }
    request = (req: any, res: any) => {
        let data = '';
        req.on('data', d => data += d);
        req.on('end', () => {
            let json = JSON.parse(data);
            if(json.action in this.actions)
                this.actions[json.action](json, res);
        })
    };
    close() {
        this.server.close();
    }
}

export { Server }