import {Filter} from "./Filter";

export class Listener {
    constructor(
        public filter?: Filter,
        public action?: Function
    ){}
}