import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Styles/Todo.css";

function SimpleDisplay() {
  const [inputText, setInputText] = useState("");
  const [tasks, setTasks] = useState([]);
  const location = useLocation();
  const task1 = location.state || {};

  // Fetch tasks
  useEffect(() => {
    axios
      .get("http://localhost:1000/tasks")
      .then((res) => {
        // Add a completed flag to each task
        const updatedTasks = res.data.map((task) => ({
          ...task,
          completed: false,
        }));
        setTasks(updatedTasks);
      })
      .catch((err) => console.log(err));
  }, []);

  // Delete a task
  function remove_item(id, name) {
    axios
      .delete(`http://localhost:1000/tasks/${id}`)
      .then((res) => {
        console.log(res);
        
        alert(`${name} deleted successfully`);
        // Remove from state
        setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
      })
      .catch((err) => {
        console.log(err);
        alert("Task not found or already deleted");
      });
  }

  // Add a new task
  const handleButtonClick = async (e) => {
    e.preventDefault();

    if (!inputText.trim()) {
      alert("Please enter a task before submitting!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:1000/tasks", { task: inputText });
      console.log("Task added:", res.data);
      setInputText("");
      const newTask = { ...res.data, completed: false };
      setTasks((prev) => [...prev, newTask]);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // ✅ Toggle Finish (strike-through)
  const handleFinishClick = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="simple-display">
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter task"
      />
      <button onClick={handleButtonClick}>Add Task</button>

      <div className="tasks-section">
        <h3>All Tasks</h3>
        {tasks.length > 0 ? (
          <ul>
            {tasks.map((task) => (
              <li
                key={task.id}
                className={task.completed ? "completed" : ""}
              >
                {task.task}
                <div>
                  <button
                    className="edit-btn"
                    onClick={() => handleFinishClick(task.id)}
                  >
                    {task.completed ? "Undo" : "Finish"}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => remove_item(task.id, task.task)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "gray" }}>No tasks found.</p>
        )}
      </div>

      {task1.task ? (
        <div className="selected-task">
          <h2>{task1.task}</h2>
        </div>
      ) : (
        <p style={{ marginTop: "20px", color: "gray" }}>No task selected.</p>
      )}
    </div>
  );
}

export default SimpleDisplay;
