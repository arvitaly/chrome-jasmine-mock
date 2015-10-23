import {Tab} from './Tab';
export class Tabs {
    constructor(protected runtime: ChromeJasmineMock.Runtime) {
    }
    protected tabs: Array<Tab> = [];
    protected currentId = 0;
    public create: ChromeJasmineMock.Tabs.Create = jasmine.createSpy("Tabs.create").and.callFake((props: chrome.tabs.CreateProperties, cb) => {
        this.runtime.lastError = undefined;
        var tab = new Tab(props);
        tab.id = this.currentId++;
        this.tabs.push(tab);
        cb(tab);
    });
    public remove: ChromeJasmineMock.Tabs.Remove = jasmine.createSpy("Tabs.remove").and.callFake((ids, cb) => {
        this.runtime.lastError = undefined;
        if (Object.prototype.toString.call(ids) === '[object Array]') {
            for (let i = 0; i < ids.length; i++) {
                this.removeOne(ids[i]);
            }            
        } else {
            this.removeOne(ids);
        }
        cb();
    });
    public get: ChromeJasmineMock.Tabs.Get = jasmine.createSpy("Tabs.get").and.callFake((tabId, callback) => {        
        this.runtime.lastError = undefined;
        callback(this.tabs.filter((tab) => tab.id == tabId)[0]);
    });
    public executeScript: ChromeJasmineMock.Tabs.ExecuteScript = jasmine.createSpy("Tabs.executeScript").and.callFake((tabId: number, details: chrome.tabs.InjectDetails, cb) => {
        this.runtime.lastError = undefined;
        this.get(tabId, (tab) => {
            if (details.code) {                
                try {
                    var result = (function (window) { return eval(details.code) })(tab.window);
                    cb([result]);
                } catch (e) {
                    this.runtime.lastError = e;
                    cb();
                }                
            }            
        });
    });
    protected removeOne(id: number) {
        var index;
        if (this.tabs.some((tab, index_) => {
            if (tab.id === id) {
                index = index_;
                return true;
            }
        })) {
            this.tabs.splice(index, 1);
        } else {
            throw new Error("Invalid tab id " + id);
        }
    }
}