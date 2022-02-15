import React, {useState} from "react";
import TodoForm from "./TodoForm";
import {AiOutlineCloseCircle, AiTwotoneEdit} from "react-icons/ai";

const Todo = ({todos, completeTodo, removeTodo, updateTodo}) => {
  const [edit, setEdit] = useState({
    id: null,
    value: "",
  });

  const submitUpdate = (value) => {
    updateTodo(edit.id, value);
    setEdit({
      id: null,
      value: "",
    });
  };

  if (edit.id) {
    return <TodoForm edit={edit} onSubmit={submitUpdate} editId={edit.id} />;
  }

  return (
    <div className='todos-container'>
      {todos.map((todo, index) => (
        <div className={todo.isComplete ? "todo-row complete" : "todo-row"} key={index}>
          <div onClick={() => completeTodo(todo.id)} key={todo.id}>
            {todo.text}
          </div>
          <div className='icons'>
            <AiOutlineCloseCircle onClick={() => removeTodo(todo.id)} className='delete-icon' />
            <AiTwotoneEdit
              size='23'
              onClick={() => setEdit({id: todo.id, value: todo.text, isComplete: todo.isComplete})}
              className='edit-icon'
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Todo;
