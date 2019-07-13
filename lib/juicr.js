"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function () {
  var Juicr =
  /*#__PURE__*/
  function () {
    function Juicr() {
      var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Juicr);

      this.actions = {};
      this.listeners = [];
      this._state = o.initialState || {};
      this.dev = o.dev;

      if (this.dev) {
        this.listen("*", function (changedState) {
          console.log(changedState);
        });
      }

      this.dispatch = this.dispatch.bind(this);
      this.action = this.action.bind(this);
      this.listen = this.listen.bind(this);
    }

    _createClass(Juicr, [{
      key: "action",
      value: function action(actionName, fn) {
        this.actions[actionName] = function (_state, o) {
          return new Promise(function (resolve, reject) {
            var res = fn(_state, o);

            if (res || res === undefined) {
              resolve(res);
            } else {
              reject();
            }
          });
        };
      }
    }, {
      key: "listen",
      value: function listen(props, fn) {
        var _this = this;

        var listener = {
          props: typeof props === 'string' ? [props] : props,
          fn: fn
        };

        listener.unsubscribe = function () {
          var i = _this.listeners.indexOf(listener);

          _this.listeners.splice(i, 1);
        };

        this.listeners.push(listener);
        return listener.unsubscribe;
      }
    }, {
      key: "updateState",
      value: function updateState(changedState) {
        var _this2 = this;

        this._state = _objectSpread({}, this._state, {}, changedState);
        var changedKeys = Object.keys(changedState);
        this.listeners.forEach(function (_ref) {
          var props = _ref.props,
              fn = _ref.fn;

          if (props[0] && props[0] === "*") {
            fn(changedState, _this2._state);
          } else {
            var emit = props.filter(function (element) {
              return changedKeys.includes(element);
            }).length > 0;

            if (emit) {
              fn(changedState, _this2._state);
            }
          }
        });
      }
    }, {
      key: "dispatch",
      value: function dispatch(actionName, o) {
        var _this3 = this;

        var action = this.actions[actionName];

        if (!action) {
          console.error("no action with name ".concat(actionName));
          return;
        }

        return action(this._state, o || {}).then(function (changedState) {
          if (changedState) {
            _this3.updateState(changedState);

            return changedState;
          } else {
            return {};
          }
        })["catch"](function (e) {
          console.error("error in action '".concat(actionName, "'"), e);
          return {};
        });
      }
    }]);

    return Juicr;
  }();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') module.exports = Juicr;else window.Juicr = Juicr;
})();