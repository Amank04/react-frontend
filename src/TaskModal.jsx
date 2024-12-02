import React, { useState } from "react";

const TaskModal = ({ onClose, onSave, existingTasks = [] }) => {
  // State for task fields
  const [task, setTask] = useState({
    name: "",
    priority: "",
    time: "",
    labor: "",
    deadline: "",
    partial_allowed: "",
    dependencies: [],
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle dependencies (multi-select)
  const handleDependenciesChange = (e) => {
    const options = Array.from(e.target.options);
    const selected = options
      .filter((option) => option.selected)
      .map((option) => option.value);
    setTask((prev) => ({
      ...prev,
      dependencies: selected,
    }));
  };

  // Handle save
  const handleSave = () => {
    if (
      task.name.trim() === "" ||
      task.priority === "" ||
      task.time === "" ||
      task.labor === ""
    ) {
      alert("Please fill out all required fields.");
      return;
    }
    onSave(task); // Pass the entire task object
    setTask({
      name: "",
      priority: "",
      time: "",
      labor: "",
      deadline: "",
      partial_allowed: "",
      dependencies: [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
        {/* Task Name */}
        <input
          type="text"
          name="name"
          placeholder="Task name (required)"
          value={task.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md mb-4"
        />
        {/* Priority */}
        <input
          type="number"
          name="priority"
          placeholder="Task importance (1-10) (required)"
          min="1"
          max="10"
          value={task.priority}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md mb-4"
        />
        {/* Estimated Time */}
        <input
          type="number"
          name="time"
          placeholder="Estimated time (hours) (required)"
          min="0.5"
          step="0.5"
          value={task.time}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md mb-4"
        />
        {/* Labor Requirement */}
        <input
          type="number"
          name="labor"
          placeholder="Labor requirement (required)"
          min="1"
          value={task.labor}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md mb-4"
        />
        
        {/* Partial Work */}
        <input
          type="checkbox"
          name="partial_allowed"
          checked={task.partial_allowed}
          onChange={(e) =>
            setTask((prev) => ({
              ...prev,
              partial_allowed: e.target.checked, // Store boolean directly
            }))
          }
        />
        <label htmlFor="partial_allowed">Partial work allowed</label>

        {/* Dependencies */}
        {/* In TaskModal.js */}
        <select
          name="dependencies"
          multiple
          value={task.dependencies}
          onChange={handleDependenciesChange}
          className="w-full px-4 py-2 border rounded-md my-4"
        >
          {existingTasks.map((existingTask) => (
            <option key={existingTask} value={existingTask}>
              {existingTask}
            </option>
          ))}
        </select>
        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
