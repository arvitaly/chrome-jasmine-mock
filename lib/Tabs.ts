﻿import {Tab} from './Tab';
export class Tabs {
    constructor(protected chrome: ChromeJasmineMock.Chrome) {
    }
    public tabs: Array<Tab> = [];
    protected currentId = 0;
    protected contentScript;
    setContentScript(code) {
        this.contentScript = code;
    }
    public create: ChromeJasmineMock.Tabs.Create = jasmine.createSpy("Tabs.create").and.callFake((props: chrome.tabs.CreateProperties, cb) => {

        this.chrome.runtime.lastError = undefined;
        var tab = new Tab(props);
        tab.id = this.currentId++;
        this.tabs.push(tab);
        
        if (this.contentScript) {
            
            try {
                if (typeof (this.contentScript) === 'string') {
                    ((window) => { return eval(this.contentScript) })(tab.window);
                } else {
                    
                    ((window) => {                        
                        return this.contentScript(window);
                    })(tab.window);
                }

                
            } catch (e) {
                this.chrome.runtime.lastError = e;
                cb();
            }
        }
        cb(tab);
    });
    public remove: ChromeJasmineMock.Tabs.Remove = jasmine.createSpy("Tabs.remove").and.callFake((ids, cb) => {
        this.chrome.runtime.lastError = undefined;
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
        this.chrome.runtime.lastError = undefined;
        callback(this.tabs.filter((tab) => tab.id == tabId)[0]);
    });
    public executeScript: ChromeJasmineMock.Tabs.ExecuteScript = jasmine.createSpy("Tabs.executeScript").and.callFake((tabId: number, details: chrome.tabs.InjectDetails, cb) => {
        
        this.chrome.runtime.lastError = undefined;
        this.get(tabId, (tab) => {
            if (details.code) {                
                try {
                    var result = ((window) => {
                        return eval(details.code)
                    })(tab.window);
                    cb([result]);
                } catch (e) {
                    this.chrome.runtime.lastError = e;
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