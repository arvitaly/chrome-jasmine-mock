declare module ChromeJasmineMock {
    interface Chrome {
        tabs: Tabs;
        runtime: Runtime;
    }
    interface ChromeStatic {
        new (manifest?): Chrome;
    }
    interface Runtime {
        id: string;
        lastError: Object;
    }
    interface Tabs {
        create: Tabs.Create;
        remove: Tabs.Remove;
        executeScript: Tabs.ExecuteScript;
        get: Tabs.Get;
    }
    interface Tab {
        id: number;
        window: Object;
    }
    module Tabs {
        interface Create extends jasmine.Spy {
            (props: chrome.tabs.CreateProperties, cb?: (tab: Tab) => any): void;
        }
        interface Remove extends jasmine.Spy {
            (id: number, cb?: () => any): void;
        }
        interface Remove extends jasmine.Spy {
            (ids: Array<number>, cb?: () => any): void;
        }
        interface ExecuteScript extends jasmine.Spy {
            (tabId: number, details: chrome.tabs.InjectDetails, callback: (results:Array<any>) => any);
        }
        interface Get extends jasmine.Spy {
            (tabId: number, callback: (tab: Tab) => any);
        }
    }

}
declare module 'chrome-jasmine-mock' {
    export var Chrome: ChromeJasmineMock.ChromeStatic;
}