window.createToDoJuicr = (state) => {
  const juicr = new window.Juicr({ initialState: state, dev: true })

  let id = 0

  function findToDoFromId(todos, id) {
    const i = todos.findIndex(t => t.id = id)
    return todos[i]
  }

  juicr.action('addTodo', ({ }, _state) => {
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

  juicr.action('textInput', ({ text }, _state) => {
    return { newTodo: text }
  })

  juicr.action('setFilter', ({ filter }, _state) => {
    return { filter }
  })

  juicr.action('toggleAll', ({ }, _state) => {
    return {
      todos: _state.todos.map((t) => {
        t.isComplete = true
        return t
      })
    }
  })

  juicr.action('toggleDone', ({ id }, _state) => {
    const todo = findToDoFromId(_state.todos, id)
    if(todo) {
      todo.isComplete = !todo.isComplete
      return { todos: _state.todos }
    } else {
      throw Error(`could not find todo with id ${id}`)
    }
  })

  juicr.action('toggleEdit', ({ id }, _state) => {
    const todo = findToDoFromId(_state.todos, id)
    if(todo) {
      todo.isEditing = !todo.isEditing
      return { todos: _state.todos, isEditing: todo.isEditing }
    } else {
      throw Error(`could not find todo with id ${id}`)
    }
  })

  juicr.action('updateTodo', ({ id, title }, _state) => {
    const todo = findToDoFromId(_state.todos, id)
    if(todo) {
      todo.title = title
      return { todos: _state.todos }
    } else {
      throw Error(`could not find todo with id ${id}`)
    }
  })

  juicr.action('clearCompleted', ({}, _state) => {
    return { todos: _state.todos.filter(t => t.isComplete === false ) }
  })

  juicr.action('delete', ({ id }, _state) => {
    return { todos: _state.todos.filter(t => t.id !== id ) }
  })

  juicr.reaction(["todos", "filter"], (changedState, _state) => {
    const filters = {
      all: (t) => { return t },
      completed: (t) => { return t.isComplete === true },
      active: (t) => { return t.isComplete === false }
    }

    return {
      filteredTodos: _state.todos.filter(filters[_state.filter]),
      remainingTodos: _state.todos.filter(filters['active']).length
    }
  })

  return juicr
}
