import React, { useState } from "react";

export default function TaskSelectionModal({ onClose, todos }) {
  const [selectedTasks, setSelectedTasks] = useState({});
  const [maxHours, setMaxHours] = useState("");
  const [laborCapacity, setLaborCapacity] = useState("");
  const [response, setResponse] = useState(null); // State to store server response
  const [showResponseModal, setShowResponseModal] = useState(false); // State to toggle response modal
  const [isLoading, setIsLoading] = useState(false); // Loading state for the button

  // Toggle the checked state for a specific task
  const toggleTask = (id) => {
    setSelectedTasks((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // Handle Proceed Button Click
  const handleProceed = async () => {
    const selectedTaskList = todos.filter((todo) => selectedTasks[todo.id]);

    if (selectedTaskList.length === 0) {
      alert("Please select at least one task.");
      return;
    }

    const jsonOutput = {
      tasks: selectedTaskList.map((task) => ({
        name: task.name,
        priority: parseFloat(task.priority),
        time: parseFloat(task.time),
        labor: parseFloat(task.labor),
        partial_allowed: Boolean(task.partial_allowed),
      })),
      max_hours: parseInt(maxHours, 10),
      labor_capacity: parseInt(laborCapacity, 10),
      task_dependencies:
        selectedTaskList.length >= 2
          ? [[selectedTaskList[0].name, selectedTaskList[1].name]]
          : [],
    };

    console.log("JSON to send:", jsonOutput);

    setIsLoading(true); // Set loading to true when the request is sent

    try {
      const response = await fetch("https://smarttask-backend.onrender.com/solve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonOutput),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Server Error:", errorResponse);
        alert("Error: " + errorResponse.error);
        setIsLoading(false); // Reset loading state
        return;
      }

      const data = await response.json();
      console.log("Server Response:", data);
      setResponse(data); // Store the response in state
      setShowResponseModal(true); // Show the response modal
      setIsLoading(false); // Reset loading state
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
      setIsLoading(false); // Reset loading state
    }
  };

  // Close the response modal
  const closeResponseModal = () => {
    setShowResponseModal(false);
    setResponse(null); // Reset the response
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 rounded-lg scroll">
      <div className="rounded-lg bg-white shadow-lg p-6 w-auto relative max-h-[80vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h3 className="text-2xl text-center font-semibold text-teal-600 mb-4 px-3">
          Your Smart Task Schedule
        </h3>

        {/* Task List */}
        {todos.length > 0 ? (
          <>
            <h2 className="text-md font-normal text-teal-600 mb-2">
              Select the tasks you want to proceed with:
            </h2>
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`flex justify-start items-center w-auto gap-3 border rounded-md p-3 pr-10 shadow-sm hover:shadow-md transition ${
                    selectedTasks[todo.id]
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedTasks[todo.id] || false}
                    onChange={() => toggleTask(todo.id)}
                    className="appearance-none h-4 w-4 border-2 border-gray-300 rounded checked:bg-green-600 checked:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 cursor-pointer"
                  />
                  <div className="flex gap-3 justify-start items-center">
                    <h3 className="font-semibold text-gray-800">{todo.name}</h3>
                    <p className="text-sm text-gray-500">
                      Value: {todo.priority} | Time: {todo.time}
                    </p>
                    {todo.deadline && (
                      <p className="text-sm text-gray-500">
                        Deadline: {todo.deadline}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Partial Work allowed:{" "}
                      {todo.partial_allowed ? "Yes" : "No"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <input
              type="number"
              className="border rounded-md p-3 w-full mt-2"
              placeholder="Maximum Working Hours"
              required
              name="max-hours"
              value={maxHours}
              onChange={(e) => setMaxHours(e.target.value)}
            />
            <input
              type="number"
              className="border rounded-md p-3 w-full mt-2"
              placeholder="Maximum labor capacity"
              required
              name="max-labor"
              value={laborCapacity}
              onChange={(e) => setLaborCapacity(e.target.value)}
            />

            <div className="flex justify-end mt-8">
              <button
                onClick={handleProceed}
                className="text-white py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 shadow-md font-medium transition-colors"
              >
                {isLoading ? (
                  <svg
                  className="animate-spin h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                >
                  <circle
                    className="opacity-25"
                    cx="25"
                    cy="25"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    d="M4 25a21 21 0 0111-18.78"
                  >
                    <animate
                      attributeName="d"
                      begin="0s"
                      dur="1.5s"
                      values="M4 25a21 21 0 0111-18.78; M4 25a21 21 0 010 37.56; M4 25a21 21 0 0111-18.78"
                      keyTimes="0; 0.5; 1"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
                
                ) : (
                  "Proceed"
                )}
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">No tasks added yet.</p>
        )}
      </div>

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="rounded-lg bg-white shadow-lg p-6 w-auto relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={closeResponseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h4 className="text-lg font-semibold text-teal-700 mb-2">
              Optimization Results
            </h4>
            {response && (
              <ul className="text-gray-700 space-y-2">
                <li>
                  <strong>Status:</strong> {response.status}
                </li>
                <li>
                  <strong>Total Value:</strong> {response.objective_value}
                </li>
                <li>
                  <strong>Task Selection:</strong>
                  <ul className="pl-4 space-y-1">
                    {Object.entries(response.results).map(([task, value]) => (
                      <li
                        key={task}
                        className={`${
                          value > 0 ? "text-green-600 font-medium" : "text-red-500"
                        }`}
                      >
                        {task}:{" "}
                        {value === 1
                          ? "✅ Fully Selected"
                          : value > 0
                          ? `🔄 Partial (${(value * 100).toFixed(1)}%)`
                          : "❌ Not Selected"}{" "}
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
