![juicr.js](https://i.imgur.com/9GUDkeH.png?1)

A simple (and tiny ~1kb) redux inspired reducer for handling state changes. Works well with React.js & React Native but can be combined with any front end library, or even vanilla JS template literals.

### Why?
I liked the redux pattern but the amount of boiler plate seemed overkill, especially for smaller projects.

### Examples
All examples use the same [juicr](https://github.com/alexfoxy/juicr.js/blob/master/codepen_ext/todoJuicr.js) reducer code.

- [React.js Todo](https://codepen.io/alexfoxy/pen/eowpdb)
- [Preact.js Todo](https://codepen.io/alexfoxy/pen/Pgrgja)
- [Vanilla JS Todo](https://codepen.io/alexfoxy/pen/wZLWpp)
- [Reef.js Todo](https://codepen.io/alexfoxy/pen/vMqNbZ)

## Setup
Add the package to your project either with:
```bash
# npm
npm install juicr.js

# yarn
yarn add juicr.js
```

or for browsers:
```html
<script src="https://cdn.jsdelivr.net/npm/juicr.js" ></script>
```

## Simple example
1) Create a new Juicr with some initial state:
```javascript
const juicr = new Juicr({ initialState: { count: 0 } })
```
2) Add an action with a name and a function that returns the changed state:
```javascript
juicr.action("count", (state, amount) => {
	return { count: state.count += amount }
})
```
3) Listen to state changes. You can either listen to a single property, an array or use `*` to listen to all changes:
```javascript
juicr.listen("*", (changedState, _state) => {
	document.body.innerHTML = changedState.count
	/* or your front end library update function e.g. this.setState({ ...changedState }) */
})
```
4) Dispatch actions to the Juicr:
```javascript
setInterval(() => {
	juicr.dispatch("count", 1)
}, 1000)
```
Play with this example in [CodePen](https://codepen.io/alexfoxy/pen/gyNaYw).

For use with React see: [Use with React & React Native](https://github.com/alexfoxy/juicr.js#use-with-react--react-native)

## API
#### `new Juicr({ initialState={}, dev=false })`
Initializes a new Juicr. Pass in an `initialState` object and an optional `dev` flag. When dev mode is enabled all changes to the state are printed to the console.


#### `juicr.action('actionName', (data, _state) => { })`
Adds a dispatchable **action** to the Juicr. Specify the `actionName` and a `function` that returns the state changes. The `data` is passed in from the **dispatch** call as well as the current Juicr `_state`. For example:
```javascript
juicr.action('delete', (state, { id }) => {
	return { items: state.items.filter(t => t.id !== id ) }
})
```


#### `juicr.dispatch('actionName', data)`
Dispatches an **action** with `data` on your Juicr. For example:
```javascript
juicr.dispatch("delete", { id: 1 })
```


#### `juicr.listen('propName', (changedState, _state) => { })`
Listens to changes to the **state** either from an action. You can either specify a single property:
```javascript
juicr.listen("items", (changedState, _state) => { })
```
An array of properties:
```javascript
juicr.listen(["propA", "propB"], (changedState, _state) => {})
```
Or use the special character `*` to listen to any changes on the state:
```javascript
juicr.listen("*", (changedState, _state) => {})
```


## Asynchronous actions
Actions can return a `Promise` which resolves with the state changes. When dispatching use `.then` for triggering other actions or `.catch` for errors. Eg.

```javascript
juicr.action("setText", (state, text) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ text })
		}, 100)
	})
})

juicr.dispatch("setLoading", true)
juicr.dispatch("setText", "hello").then((changedState) => {
	juicr.dispatch("setLoading", false)
	// changedState.text === "hello"
})
 ```

## Multiple Juicrs
Larger projects may benefit from using multiple Juicrs for different parts of your application data. For example you might have one Juicr for the user state and another for a list of todos.

## Use with React & React Native
Using juicr.js with React.js & React Native is easy. The simplest approach is to listen to all changes `*`  in your main app component and use `setState` to update your state:
```javascript
// App.js
constructor() {
	...
    this.juicr.listen("*", (changedState, _state) => {
      this.setState({ ...changedState })
    })
    ...
}
 ```
Then pass the `juicr.dispatch` function to components:
```javascript
<MyComponent dispatch={this.juicr.dispatch} />
```
Alternatively you could pass the entire juicr to your components and let them handle their own internal state and listen for changes, e.g:
```javascript
// UserHeader.js
constructor(props) {
	...
	this.state = { username: '', photoUrl: '' }

	props.userJuicr.listen(["username", "photoUrl", (changedState, _state) => {
		this.setState({ ...changedState })
	})
	...
}
 ```
