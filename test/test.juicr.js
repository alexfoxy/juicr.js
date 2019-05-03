var expect = require('chai').expect;
var Juicr = require("../src/juicr")

describe('Juicr', () => {
  it('should init without state', function() {
      const juicr = new Juicr()
      expect(juicr).to.be.ok
  });

  it('should init with state', function() {
      const juicr = new Juicr({ initialState: { x: 1 }})
      expect(juicr._state.x).to.equal(1)
  });

  it('should be able to add action and dispatch with listener', function(done) {
      const juicr = new Juicr({ initialState: { text: '' }})

      juicr.action("setText", (state, text) => {
        return { text }
      })

      juicr.listen("*", (changedState) => {
        expect(changedState.text).to.equal("hello")
        done()
      })

      juicr.dispatch("setText", "hello")
  });

  it('should be able to add async action and dispatch with listener', function(done) {
      const juicr = new Juicr({ initialState: { text: '' }})

      juicr.action("setText", (state, text) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ text })
          }, 100)
        })
      })

      juicr.dispatch("setText", "hello").then((changedState) => {
        expect(changedState.text).to.equal("hello")
        done()
      })
  });

  it('should be able to listen to many props', function() {
      const juicr = new Juicr({ initialState: { text: '', number: 0 }})

      juicr.action("setText", (state, text) => {
        return { text }
      })

      juicr.action("setNumber", (state, number) => {
        return { number }
      })

      let x = 0
      juicr.listen(['text', 'number'], (changedState) => {
        x += 1
      })

      juicr.dispatch("setText", "hello").then(() => {
        expect(x).to.equal(1)

        juicr.dispatch("setNumber", 1).then(() => {
          expect(x).to.equal(2)
        })
      })
  });

  it('should be able to unsubscribe listener', function() {
      const juicr = new Juicr({ initialState: { text: '' }})

      juicr.action("setText", (state, text) => {
        return { text }
      })

      const unsubscribe = juicr.listen("text", () => {})
      unsubscribe()

      expect(juicr.listeners.length).to.equal(0)
  });
})
