import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import TaskModal from "./TaskModal"; // Import the TaskModal component
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import TaskSelectionModal from "./components/TaskSelectionModal";

const App = () => {
  const getStartedSectionRef = useRef(null);
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [searchQuery, setSearchQuery] = useState(""); // State for storing search query
  const [isTaskSelectionModalOpen, setIsTaskSelectionModalOpen] = useState(false);

  // Load todos from localStorage when the component mounts
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos)); // Parse the saved todos and set state
    }
  }, []);

  // Save todos to localStorage whenever the todos state changes
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
      console.log("Tasks saved to localStorage:", todos); // Debugging output
    }
  }, [todos]);

  // Function to scroll to the target section
  const scrollToSection = () => {
    if (getStartedSectionRef.current) {
      getStartedSectionRef.current.scrollIntoView({
        behavior: "smooth", // Smooth scroll behavior
        block: "start", // Align to the top of the section
      });
    }
  };

  // Add Todo
  const addTodo = (newTodo) => {
    if (newTodo.name.trim()) {
      const newTodos = [
        ...todos,
        {
          id: Date.now(), // Use current timestamp for unique IDs
          name: newTodo.name.trim(),
          priority: newTodo.priority,
          time: newTodo.time,
          labor: newTodo.labor,
          deadline: newTodo.deadline,
          partial_allowed: Boolean(newTodo.partial_allowed), // Ensure it's stored as a boolean
          dependencies: newTodo.dependencies,
          completed: false,
        },
      ];
      setTodos(newTodos); // Update state
    }
  };
  

  // Toggle Todo Complete
  const toggleComplete = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos); // Update state
    localStorage.setItem("todos", JSON.stringify(updatedTodos)); // Update local storage
  };

  // Delete Todo
  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos); // Update state
    localStorage.setItem("todos", JSON.stringify(updatedTodos)); // Update local storage
  };

  // Edit Todo
  const editTodo = (id, updatedTask) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, ...updatedTask } : todo
    );
    setTodos(updatedTodos); // Update state
    localStorage.setItem("todos", JSON.stringify(updatedTodos)); // Update local storage
  };

  // Save Todos as JSON
  const saveTodos = () => {
    if (todos.length === 0) {
      alert("No tasks available to save.");
      return;
    }

    try {
      const json = JSON.stringify(todos, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "todos.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error while saving todos as JSON:", error);
      alert("Failed to save tasks. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <HeroSection scrollToSection={scrollToSection} />
      <div
        ref={getStartedSectionRef} // Assign the ref to the section
        id="get-started-section"
        className="bg-[radial-gradient(circle_588px_at_31.7%_40.2%,_rgba(225,200,239,1)_21.4%,_rgba(163,225,233,1)_57.1%)] h-auto w-full flex flex-col items-center p-6 py-36"
      >
        <h1 className="text-5xl font-bold mb-10 text-teal-600 ">Task List</h1>

        <div className="flex items-center mb-4 gap-5">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search Todos"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query
              className="px-4 py-2 border rounded-md w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")} // Reset search query
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Add Todos
          </button>
        </div>

        <div className="w-full max-w-2xl">
          {todos
            .filter((todo) =>
              (todo.name || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
            .map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                toggleComplete={toggleComplete}
                deleteTodo={deleteTodo}
                editTodo={editTodo}
              />
            ))}

          {todos.filter((todo) => todo.completed).length > 0 && (
            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-2">
              Completed Tasks {todos.filter((todo) => todo.completed).length}
            </h2>
          )}

          {todos
            .filter(
              (todo) =>
                todo.completed &&
                todo.title.toLowerCase().includes(searchQuery.toLowerCase()) // Filter based on search query
            )
            .map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                toggleComplete={toggleComplete}
                deleteTodo={deleteTodo}
                editTodo={editTodo}
              />
            ))}
        </div>

        <button
          onClick={() => setIsTaskSelectionModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 mt-6 rounded-md hover:bg-blue-700"
        >
          Get your Smart Task Schedule for Today
        </button>

        {/* <button
          onClick={saveTodos}
          className="bg-blue-600 text-white px-4 py-2 mt-6 rounded-md hover:bg-blue-700"
        >
          Save Todos as JSON
        </button> */}

        {/* Render Modal */}
        {isModalOpen && (
          <TaskModal
            onClose={() => setIsModalOpen(false)}
            onSave={(newTodo) => {
              addTodo(newTodo);
              setIsModalOpen(false); // Close modal after saving
            }}
            existingTasks={todos.map((todo) => todo.name)} // Pass task names as existing tasks
          />
        )}

        {isTaskSelectionModalOpen && (
          <TaskSelectionModal
            onClose={() => setIsTaskSelectionModalOpen(false)}
            todos={todos} // Pass the todos as a prop
          />
        )}
      </div>
      <Footer />
    </>
  );
};

const TodoItem = ({ todo, toggleComplete, deleteTodo, editTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(todo.name);

  return (
    <div className="flex items-center justify-between bg-white rounded-md shadow-md p-4 mb-2">
      {isEditing ? (
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border px-2 py-1 flex-grow rounded-md"
        />
      ) : (
        <span className={`flex-grow ${todo.completed ? "line-through text-gray-400" : ""}`}>
          {todo.name} {/* Ensure task name is displayed */}
        </span>
      )}

      <div className="flex space-x-3">
        {isEditing ? (
          <>
            <button
              onClick={() => {
                editTodo(todo.id, { name: newName });
                setIsEditing(false);
              }}
              className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-600 text-white px-2 py-1 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => toggleComplete(todo.id)}
              className={`${
                todo.completed ? "bg-green-500" : "bg-gray-300"
              } text-white px-2 py-1 rounded-md hover:bg-green-600`}
            >
              {todo.completed ? "Completed" : "Mark as Complete"}
            </button>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
