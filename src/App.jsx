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
    console.log("todos2: ", todos)
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
    console.log("add todo: ", newTodo)
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
        className="bg-[radial-gradient(circle_588px_at_31.7%_40.2%,_rgba(225,200,239,1)_21.4%,_rgba(163,225,233,1)_57.1%)] h-auto w-full flex flex-col items-center p-6 py-10 md:py-20 lg:py-36"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 lg:mb-10 text-teal-600">Task List</h1>

        <div className="flex flex-col sm:flex-row items-center mb-4 gap-4 sm:gap-5 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
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
            className="bg-green-600 text-white px-4 py-2 mt-4 sm:mt-0 sm:ml-4 rounded-md hover:bg-green-700"
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
                deleteTodo={deleteTodo}
                editTodo={editTodo}
              />
            ))}

          {todos.filter((todo) => todo.completed).length > 0 && (
            <h2 className="text-xl md:text-2xl font-semibold text-green-700 mt-6 mb-2">
              Completed Tasks {todos.filter((todo) => todo.completed).length}
            </h2>
          )}
        </div>

        <button
          onClick={() => setIsTaskSelectionModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 mt-6 rounded-md hover:bg-blue-700"
        >
          Get your Smart Task Schedule for Today
        </button>

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

const TodoItem = ({ todo, deleteTodo, editTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(todo.name);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-md shadow-md p-4 mb-4 sm:mb-2 w-full">
      {isEditing ? (
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="px-4 py-2 border rounded-md w-full sm:w-80"
        />
      ) : (
        <h3 className="text-lg font-medium text-gray-800 truncate">{todo.name}</h3>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (isEditing) {
              editTodo(todo.id, { name: newName });
              setIsEditing(false);
            } else {
              setIsEditing(true);
            }
          }}
          className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
        <button
          onClick={() => deleteTodo(todo.id)}
          className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default App;
