import React, { useState, useRef, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([])
  const [newTodoText, setNewToDoText] = useState("")
  const editInputRef = useRef(null); // New ref for the input element in edit mode
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  function typeTodo(e) {
    setNewToDoText(e.target.value)
  }

  function addNewTodo() {
    const maxId = todos.reduce((acc, cur) => Math.max(acc, cur.id), 0);
    const id = todos.length === 0 ? 1 : maxId + 1
    const newTodo = { id: id, text: newTodoText, done: false, isEditing: false };
    if (newTodoText.trim() === '') {
      alert('Input text is empty :(')
      return
    }
    setTodos([...todos, newTodo])
    document.getElementById("todo-input").value = "";
    setNewToDoText("")
  }

  function handleTodoDone(id) {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, done: !todo.done };
        }
        return todo;
      });
      return updatedTodos;
    });
  }

  function handleDeleteTodo(id) {
    let deletedTodo = document.getElementById(`todo-${id}`);
    if (deletedTodo) {
      deletedTodo.style.opacity = 0;
      deletedTodo.style.transition = 'opacity 0.5s ease-out';
    }
    setTimeout(() => {
      setTodos((prevTodos) => {
        const filteredTodos = prevTodos.filter((todo) => todo.id !== id);
        return filteredTodos;
      });
      if (deletedTodo) {
        deletedTodo.style.opacity = null;
        deletedTodo.style.transition = null;
      }
      deletedTodo = null;
    }, 400);
  }

  function handleEditTodoStart(id) {
    setEditingId(id);
  }

  function handleEditText(e) {
    setEditingText(e.target.value)
  }

  function handleEditTodoEnd(editingId) {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) => {
        if (todo.id === editingId) {
          return { ...todo, text: editingText };
        }
        return todo;
      });
      return updatedTodos;
    });
    setEditingId(null)
  }

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (editingId && editInputRef.current && !editInputRef.current.contains(e.target)) {
        handleEditTodoEnd(editingId);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [editingId, editingText]);

  function allAreDone(){
    const allAreDone = (todo) => todo.done === true;
    return todos.every(allAreDone)
  }

  function selectAll() {
    if (allAreDone()) {
      console.log('every')
      const updatedArray = todos.map((todo) => {
        return { ...todo, done: false };
      });
      setTodos(updatedArray);
    } else {
      const updatedArray = todos.map((todo) => {
        return { ...todo, done: true };
      });
      setTodos(updatedArray);
    }
  }

  return (
    <div className='App'>
      <div className='title-and-addtodo-container'>
        <h1>I need to do:</h1>
        <input id="todo-input" onChange={typeTodo}></input>
        <button onClick={addNewTodo}>Submit</button>
      </div>
      <div>
        {
          todos.map((todo) => {
            return (
              <div id={`todo-${todo.id}`} className='todoItem'>
                {editingId === todo.id ? ( // Render input element if in edit mode
                  <input
                    type='text'
                    ref={editInputRef}
                    onChange={handleEditText}
                  />
                ) : (
                  <h2
                    style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
                    onClick={() => handleEditTodoStart(todo.id, todo.text)} // Start edit mode on click
                  >
                    {todo.text}
                  </h2>
                )}
                <input
                  type='checkbox'
                  checked={todo.done}
                  onChange={() => handleTodoDone(todo.id)}
                />
                <button style={{ alignSelf: "center" }} onClick={() => handleDeleteTodo(todo.id)}>X</button>
              </div>
            )
          })
        }
      </div>
      {todos.length > 0 &&
        <>
          <button className='selectAllButton' onClick={selectAll}>{allAreDone()? 'Unselect all' : 'Select all'}</button>
          <button className='deleteAllButton' onClick={() => setTodos([])}>Delete all</button>
        </>
      }
    </div>
  );
}

export default App