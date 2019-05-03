window.createToDoJuicr = (state) => {
  const juicr = new window.Juicr({ initialState: state, dev: true })

  let id = 0

  function findToDoFromId(todos, id) {
    const i = todos.findIndex(t => t.id === id)
    return todos[i]
  }

  juicr.action('addTodo', (_state) => {
    if(_state.newTodo.length === 0) {
      return { errorText: "cannot create empty todo" }
    } else {
      id++

      const todo = {
        title: _state.newTodo,
        isComplete: false,
        isEditing: false,
        id
      }

      return { newTodo: '', todos: [todo, ..._state.todos] }
    }
  })

  juicr.action('textInput', (_state, { text }) => {
    return { newTodo: text }
  })

  juicr.action('setFilter', (_state, { filter }) => {
    return { filter }
  })

  juicr.action('toggleAll', (_state) => {
    return {
      todos: _state.todos.map((t) => {
        t.isComplete = true
        return t
      })
    }
  })

  juicr.action('toggleDone', (_state, { id }) => {
    const todo = findToDoFromId(_state.todos, id)
    if(todo) {
      todo.isComplete = !todo.isComplete
      return { todos: _state.todos }
    } else {
      throw Error(`could not find todo with id ${id}`)
    }
  })

  juicr.action('toggleEdit', (_state, { id }) => {
    const todo = findToDoFromId(_state.todos, id)
    if(todo) {
      todo.isEditing = !todo.isEditing
      return { todos: _state.todos, isEditing: todo.isEditing }
    } else {
      throw Error(`could not find todo with id ${id}`)
    }
  })

  juicr.action('updateTodo', (_state, { id, title }) => {
    const todo = findToDoFromId(_state.todos, id)
    if(todo) {
      todo.title = title
      return { todos: _state.todos }
    } else {
      throw Error(`could not find todo with id ${id}`)
    }
  })

  juicr.action('clearCompleted', (_state) => {
    return { todos: _state.todos.filter(t => t.isComplete === false ) }
  })

  juicr.action('delete', (_state, { id }) => {
    return { todos: _state.todos.filter(t => t.id !== id ) }
  })

  // similar to reaction
  juicr.listen(["filter", "todos"], (changedState, state) => {
    juicr.updateState({
      remainingTodos: state.todos.filter(filters["completed"]).length,
      filteredTodos: state.todos.filter(filters[state.filter])
    })
  })

  return juicr
}
