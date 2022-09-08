const ESPY = "__ESPY__";
const EVENTS = "__EVENTS__";
const WATCHER = "__WATCHER__";

const Espy = (function () {
  function Espy(namespace) {
    this.dispatch = this.pub;
    Espy.init();
    this.namespace = namespace;
  }
  const createGlobalEspyObject = () => {
    window[ESPY] = {
      [WATCHER]: {},
      [EVENTS]: {}
    };
  };

  Espy.init = () => window.hasOwnProperty(ESPY) || createGlobalEspyObject();

  Object.defineProperty(Espy.prototype, "namespace", {
    set: function (namespace) {
      this._namespace = namespace;
      if (!this.watchers) this.watchers = [];
      if (!this.events) this.events = [];
    }
  });
  Object.defineProperty(Espy.prototype, "watchers", {
    get: function () {
      return window[ESPY][WATCHER][this._namespace];
    },
    set: function (add) {
      window[ESPY][WATCHER][this._namespace] = add;
    }
  });
  Object.defineProperty(Espy.prototype, "events", {
    get: function () {
      return window[ESPY][EVENTS][this._namespace];
    },
    set: function (add) {
      window[ESPY][EVENTS][this._namespace] = add;
    }
  });

  Espy.prototype.pub = function (data) {
    this.watchers.forEach(function (watcher) {
      return watcher(data);
    });
    this.events.push(data);
  };
  const checkOption = (flag, watcher, events) => flag ? watcher(events[events.length - 1]) : watcher(events)

  Espy.prototype.sub = function (watcher, last) {
    const events = this.events;
    checkOption(last, watcher, events)
    this.watchers = this.watchers.concat(watcher);
  };
  Espy.prototype.cancel = function (watcher) {
    this.watchers = this.watchers.filter((i) => i !== watcher);
  };

  return Espy;
})();
const _Espy = Espy;
exports.Espy = _Espy
