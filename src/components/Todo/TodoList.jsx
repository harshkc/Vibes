import "./todoList.css";
import React, {useState} from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import {db} from "../../firebase";
import {getDocs, collection, deleteDoc, doc, setDoc} from "firebase/firestore";
import {useAuth} from "../../context/AuthProvider";

function TodoList() {
  const [todos, setTodos] = useState(JSON.parse(localStorage.getItem("todos")) || []);
  const {user} = useAuth();

  const getTodos = async () => {
    try {
      const todosSnapshot = await getDocs(collection(db, "users", user.id, "todos"));
      const todosFromDb = todosSnapshot?.docs?.map((doc) => doc.data());
      setTodos(todosFromDb);
    } catch (e) {
      console.log(e);
    }
  };

  const addTodoToDB = async (todo) => {
    try {
      await setDoc(doc(db, "users", user.id, "todos", todo.id), todo);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteTodoFromDB = async (id) => {
    try {
      await deleteDoc(doc(db, "users", user.id, "todos", id));
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    if (user) {
      getTodos();
    }
  }, []);

  const addTodo = (todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }

    if (user) addTodoToDB(todo);

    const newTodos = [todo, ...todos];
    localStorage.setItem("todos", JSON.stringify(newTodos));
    setTodos(newTodos);
  };

  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }
    if (user) addTodoToDB(newValue);
    const newTodos = todos.map((todo) => (todo.id === todoId ? newValue : todo));
    localStorage.setItem("todos", JSON.stringify(newTodos));
    setTodos(newTodos);
  };

  const removeTodo = (id) => {
    const removedArr = [...todos].filter((todo) => todo.id !== id);
    //delete todo from db matching the id
    if (user) deleteTodoFromDB(id);
    localStorage.setItem("todos", JSON.stringify(removedArr));
    setTodos(removedArr);
  };

  const completeTodo = (id) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        if (user) setDoc(doc(db, "users", user.id, "todos", todo.id), {...todo, isComplete: !todo.completed});
        todo.isComplete = !todo.isComplete;
      }
      return todo;
    });
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setTodos(updatedTodos);
  };

  return (
    <>
      <h1 className='title-h1'>{"What's for Today?"}</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo todos={todos} completeTodo={completeTodo} removeTodo={removeTodo} updateTodo={updateTodo} />
    </>
  );
}

export default TodoList;
