import { BaseThing, Thing } from "ior:esm:/tla.EAM.Once[dev-merge]";
import { WeakRefStore } from "ior:esm:/tla.EAM.Once.Store[build]";
import { OnceEvent } from "../3_services/EventService.interface.mjs";

export default class DefaultEvent extends BaseThing<DefaultEvent> implements OnceEvent {

    private readonly _store = new WeakRefStore();
    addCallback(callbackFunction: Function, targetObject: Thing<any>): void {
        this._store.register(targetObject, callbackFunction);
    }
    async fire(eventSource: Thing<any>, ...args: any[]) {
        let result = this.getCallbackFunctions().map(eventTarget => {
            return eventTarget.value(this, eventSource, ...args) as Promise<any>;
        });
        return Promise.all(result);
    }

    getCallbackFunctions() {
        return this._store.discover();
    }


}