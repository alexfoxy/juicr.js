(() => {
  class Juicr {
    constructor(o={}) {
      this.actions = {}
      this.listeners = []
      this.reactions = []
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
      this.reaction = this.reaction.bind(this)
    }

    action(actionName, fn) {
      this.actions[actionName] = (o, _state) => {
        return new Promise((resolve, reject) => {
          const res = fn(o, _state)

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

    reaction(props, fn) {
      const reaction = {
        props: typeof props === 'string' ? [props] : props,
        fn
      }

      this.reactions.push(reaction)

      // run reaction first time
      const s = {}

      reaction.props.forEach((p) => {
        s[p] = this._state[p]
      })

      const computedState = fn(s, this._state)
      this._updateState(computedState)
      //////

      return reaction
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

      this.reactions.forEach(({ props, fn } ) => {
        let doReaction = props.filter(element => changedKeys.includes(element)).length > 0

        if(doReaction) {
          const computedState = fn(changedState, this._state)
          if(computedState) this._updateState(computedState)
        }
      })
    }

    dispatch(actionName, o) {
      const action = this.actions[actionName]

      if(!action) {
        console.error(`no action with name ${actionName}`)
        return
      }

      return action(o||{}, this._state).then((changedState) => {
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
