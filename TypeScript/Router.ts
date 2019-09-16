import {Listener} from "./Listener";

class Router {
    listeners: Listener[] = [];
    public listen(listener: Listener) {
        this.listeners.push(listener);
        return true;
    }
    public send(data) {
        console.log('do send', data, this.listeners);
        this.listeners.forEach(listener => listener.filter.evaluatePacket(data) ? listener.action(data) : 0);
    }
    silence(listener: Listener) {
        const pos = this.listeners.indexOf(listener);
        this.listeners.splice(pos, 1);
    }
}

export { Router };