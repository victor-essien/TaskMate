import React, { useState } from 'react'


interface Todo {
  id:number,
  text:string,
  completed: boolean,
 }

const  Todo: React.FC = () => {
const [todos, setTodos ] = useState<Todo[]>([])
const [newTodo, setNewTodo] = useState<string>("")

const addTodo = () =>{
  if(newTodo.trim()){
    const newTask: Todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
    };
    setTodos([...todos, newTask]);
    setNewTodo("")
  }
}
console.log(todos)

const toggleTodo = (id: number) => {
  setTodos(
    todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  );
};

const deleteTodo =(id:number) => {
  setTodos(todos.filter((todo) => todo.id !== id))
}

  return (
   <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
    <div className='bg-white p-6 rounded-lg shadow-md w-96'>
    <h1 className='text-2xl font-bold mb-4 text-center text-ascent'>Todo App</h1>
    <div className='flex mb-4'>
    <input type="text"
    value={newTodo}
    onChange={(e) => setNewTodo(e.target.value)}
    placeholder='Add a new task'
    className='flex-1 border rounded-1 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
    />
    <button 
    onClick={addTodo}
    className='bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600'
    >
      Add
    </button>
    </div>
    <ul className='space-y-2'>
    {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-2 border rounded hover:shadow-md"
            >
              <div
                className={`flex-1 cursor-pointer ${
    todo.completed ? "line-through text-gray-400" : ""
  }`}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.text}
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
    </ul>
    </div>
    </div>
  )
}

export default Todo;
