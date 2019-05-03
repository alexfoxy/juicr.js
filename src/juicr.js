(() => {
  class Juicr {
    constructor(o={}) {
      this.actions = {}
      this.listeners = []
      this._state = o.initialState||{}
      this.dev = o.dev

      if(this.dev) {
          this.listen("*", (changedState) => {
            console.log(changedState)
          })
      }

      this.dispatch = this.dispatch.bind(this)
      this.action = this.action.bind(this)
      this.listen = this.listen.bind(this)
    }

    action(actionName, fn) {
      this.actions[actionName] = (_state, o) => {
        return new Promise((resolve, reject) => {
          const res = fn(_state, o)

          if(res || res === undefined) {
            resolve(res)
          } else {
            reject()
          }
        })
      }
    }

    listen(props, fn) {
      const listener = {
        props: typeof props === 'string' ? [props] : props,
        fn
      }

      listener.unsubscribe = () => {
        const i = this.listeners.indexOf(listener)
        this.listeners.splice(i, 1)
      }

      this.listeners.push(listener)

      return listener.unsubscribe
    }

    _updateState(changedState) {
      this._state = { ...this._state, ...changedState }
      const changedKeys = Object.keys(changedState)

      this.listeners.forEach(({ props, fn } ) => {
        if(props[0] && props[0] === "*") {
          fn(changedState, this._state)
        } else {
          let emit = props.filter(element => changedKeys.includes(element)).length > 0

          if(emit) {
            fn(changedState, this._state)
          }
        }
      })
    }

    dispatch(actionName, o) {
      const action = this.actions[actionName]

      if(!action) {
        console.error(`no action with name ${actionName}`)
        return
      }

      return action(this._state, o||{}).then((changedState) => {
        if(changedState) {
          this._updateState(changedState)
          return changedState
        } else {
          return {}
        }
      }).catch((e) => {
        console.error(`error in action '${actionName}'`, e)
        return {}
      })
    }
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Juicr;
  else
    window.Juicr = Juicr;
})();
