import { useState, useRef, useEffect } from 'react'
import * as React from 'react'
//import { AiOutlinePlus } from 'react-icons/ai'
import { useLocalStorage } from "./UseLocalStorage"
import './App.css'

type TodoElementProps = {
  info: string;
  handleClick: () => void;
  completed: boolean;
  makeDelete: () => void;
  edit: () => void;
}

const TodoElement = ({ info, handleClick, completed, makeDelete, edit }: TodoElementProps) => {
 
  const [ clicked, setClicked ] = useState<boolean>(false);

  function clickHandler() {
    handleClick()
    setClicked(true)
  }

  return (
    <div className="todo-element">

      <div>
        <div className="todo-element-checkbox" onClick={ clickHandler }>
          {
              
            clicked || completed
             ?
             <div className="mark"> </div>
              :
            <>
            </>
          }
        </div>

        <div className="todo-element-text">
          { info }
        </div>

      </div>

      {
        clicked || completed
          ?
        <span className="line-through"> </span>
         :
        <>
        </>
      }

      <div className='todo-element-buttons'>
        <button onClick={edit}> Edit </button>
        <button onClick={makeDelete}> Delete </button>
      </div>
    </div>
  )
}


type TodoProp = {
    todo: string,
    id: number,
    completed: boolean
}


function App() {
  
  const [ task, setTask ] = useState<string>('')
  const [ todo, setTodo ] = useLocalStorage<TodoProp[]>("TODO", [])
  const [ editPopup, setEditPopup ] = useState<boolean>(false)
  const [ edit, setEdit ] = useState<string>('')
  const [ selectedId, setSelectedId ] = useState<number>(0)

  const popupRef = useRef()

  function searchHandler( e: React.ChangeEvent<HTMLInputElement>) {
    setTask(e.target.value)
  }

  function submitHandler() {

    if ( task == '' || task == null ) {
      return
    }

    const newTodo = {
      todo: task,
      completed: false,
      id: todo.length
    }

    setTodo([...todo, newTodo])

    setTask('')
  }

  function completedTask(id: number) {
    let selectedTodo = todo.find(obj => (
      obj?.id == id
    ))

    if(!selectedTodo) return;

    selectedTodo.completed = true;

    // setTodo(todo)
    setTimeout(() => {
      localStorage.setItem('TODO', JSON.stringify(todo))
    }, 1000)
  }

  function handleDelete(id: number) {
    let selectedTodo = todo.filter(obj => (
      obj?.id != id
    ))

    selectedTodo.forEach((obj, idx) => {
      obj.id = idx
    })

    setTodo(selectedTodo)
  }

  function handleEdit(id: number) {
    setEditPopup(true)
    setSelectedId(id)
  }

  function saveEdit() {
    let selectedTodo = todo.find(obj => (
      obj?.id === selectedId
    ))

    if(!selectedTodo) return;
    
    selectedTodo.todo = edit

    setSelectedId(0);

    setEditPopup(false);

    setEdit('')

    setTimeout(() => {
      localStorage.setItem('TODO', JSON.stringify(todo))
    }, 1000)
  }

  useEffect(() => {
    const popup = document.querySelector('.edit-popup')

    if (!popup) return
    
    const handler = (e: React.MouseEvent<Element, MouseEvent>) => {
      if (popupRef.current == undefined) return;

      // @ts-ignore
      if (!popupRef.current?.contains(e.target)) {
        setEditPopup(false)
      } 
  }

    //@ts-ignore
    popup.addEventListener('pointerdown', (e) => handler(e))

    return () => {
      //@ts-ignore
      popup.removeEventListener('pointerdown', (e) => handler(e))
    }

  })

  return (
    <div className="app">
      <div className="container">

        <div className="search-container">
          <input type="text" value={task} placeholder="Add task..." onChange={searchHandler} />
          <button onClick={() => submitHandler()}> Submit </button>
        </div>

        <div className="todo-list">
          {
            todo.map((item, idx) => (
              <TodoElement info={item.todo} key={idx} completed={item.completed} handleClick={() => completedTask(idx)} makeDelete={() => handleDelete(idx)} edit={() => handleEdit(idx)} />
            ))
          }
        </div>

      </div>

      <div className={editPopup ? "edit-popup" : 'no-popup'}>
        
        <div className="show-edit" ref={popupRef}>
          <input type='text' placeholder="Edit task..." value={edit} onChange={(e) => {setEdit(e.target.value)}} />
          <div className="show-edit-buttons">
            <button onClick={() => {setEditPopup(false)}}> Cancel </button>
            <button onClick={saveEdit}> Save </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App
