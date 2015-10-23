import { Tabs } from './Tabs';
import { Runtime } from './Runtime';
export class Chrome {
    constructor(manifest) {
        this.runtime = new Runtime;
        this.tabs = new Tabs(this.runtime);
    }
}
