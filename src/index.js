"use strict";
export const EPSY = '__epsy__';
export const EVENTS = '__events__';
export const WATCHER = '__watcher__';

const Epsy = (function () {
    function Epsy(namespace) {
        this.dispatch = this.push;
        Epsy.initialize();
        this.namespace = namespace;
    }
    Epsy.initialize = function () {
        if (!window[EPSY]) {
            window[EPSY] = {
                [WATCHER]: {},
                [EVENTS]: {},
            };
        }
        if (!window[EPSY][EVENTS]) {
            window[EPSY][EVENTS] = {};
        }
        if (!window[EPSY][WATCHER]) {
            window[EPSY][WATCHER] = {};
        }
    };
    Object.defineProperty(Epsy.prototype, "events", {
        get: function () {
            return window[EPSY][EVENTS][this._namespace];
        },
        set: function (newEvents) {
            window[EPSY][EVENTS][this._namespace] = newEvents;
        },
    });
    Object.defineProperty(Epsy.prototype, "watchers", {
        get: function () {
            return window[EPSY][WATCHER][this._namespace];
        },
        set: function (newObservers) {
            window[EPSY][WATCHER][this._namespace] = newObservers;
        },
    });
    Object.defineProperty(Epsy.prototype, "namespace", {
        set: function (namespace) {
            this._namespace = namespace;
            if (!this.events)
                this.events = [];
            if (!this.watchers)
                this.watchers = [];
        },
    });
    Epsy.prototype.push = function (data) {
        this.watchers.forEach(function (watcher) { return watcher(data); });
        this.events.push(data);
    };
    Epsy.prototype.sub = function (watcher, latest = false) {
        const events = this.events;
        if (latest && events.length > 0) {
            const lastEvent = events[events.length - 1];
            watcher(lastEvent);
        }
        watcher(events);
        this.watchers = this.watchers.concat(watcher);
    };
    Epsy.prototype.unsub = function (watcher) {
        this.watchers = this.watchers.filter((i) => i !== watcher);
    };
    Epsy.prototype.clear = function () {
        this.watchers?.forEach((watcher) => watcher(undefined));
        this.events = [];
        this.watchers = [];
    };
    return Epsy;
}());
const _Epsy = Epsy;
export { _Epsy as Epsy };