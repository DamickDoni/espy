const EPSY = "__EPSY__";
const EVENTS = "__EVENTS__";
const WATCHER = "__WATCHER__";

const Epsy = (function () {
  function Epsy(namespace) {
    this.dispatch = this.pub;
    Epsy.init();
    this.namespace = namespace;
  }
  const createGlobalEpsyObject = () => {
    window[EPSY] = {
      [WATCHER]: {},
      [EVENTS]: {}
    };
  };

  Epsy.init = () => window.hasOwnProperty(EPSY) || createGlobalEpsyObject();

  Object.defineProperty(Epsy.prototype, "namespace", {
    set: function (namespace) {
      this._namespace = namespace;
      if (!this.watchers) this.watchers = [];
      if (!this.events) this.events = [];
    }
  });
  Object.defineProperty(Epsy.prototype, "watchers", {
    get: function () {
      return window[EPSY][WATCHER][this._namespace];
    },
    set: function (add) {
      window[EPSY][WATCHER][this._namespace] = add;
    }
  });
  Object.defineProperty(Epsy.prototype, "events", {
    get: function () {
      return window[EPSY][EVENTS][this._namespace];
    },
    set: function (add) {
      window[EPSY][EVENTS][this._namespace] = add;
    }
  });

  Epsy.prototype.pub = function (data) {
    this.watchers.forEach(function (watcher) {
      return watcher(data);
    });
    this.events.push(data);
  };
  const checkOption = (flag, watcher, events) => flag ? watcher(events[events.length - 1]) : watcher(events)

  Epsy.prototype.sub = function (watcher, last) {
    const events = this.events;
    checkOption(last, watcher, events)
    this.watchers = this.watchers.concat(watcher);
  };
  Epsy.prototype.cancel = function (watcher) {
    this.watchers = this.watchers.filter((i) => i !== watcher);
  };

  return Epsy;
})();
const _Epsy = Epsy;
exports.Epsy = _Epsy
