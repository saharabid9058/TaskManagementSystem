import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTask, updateTask } from "../api";

const EditTaskPage = ({ token }) => {
  const [task, setTask] = useState({ 
    title: "", 
    description: "", 
    dueDate: "", 
    checklist: [] 
  });
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [status, setStatus] = useState("Pending");
  const [completion, setCompletion] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      const data = await getTask(id, token);
      if (data?._id) {
        const checklist = data.checklist || [];
        const completedItems = checklist.filter(c => c.checked).length;
        const percentage = checklist.length > 0
          ? Math.round((completedItems / checklist.length) * 100)
          : 0;

        const now = new Date();
        const due = new Date(data.dueDate);
        let status = "Pending";
        if (percentage === 100 && now <= due) {
          status = "Completed";
        } else if (now > due && percentage < 100) {
          status = "Missing";
        }

        setTask({
          title: data.title,
          description: data.description,
          dueDate: new Date(data.dueDate).toISOString().slice(0, 16),
          checklist,
        });
        setCompletion(percentage);
        setStatus(status);
      } else {
        alert("Task not found");
        navigate("/");
      }
    };
    fetchTask();
  }, [id, token, navigate]);

  const handleChange = e => setTask({ ...task, [e.target.name]: e.target.value });

  const toggleChecklistItem = index => {
    const updated = [...task.checklist];
    updated[index].checked = !updated[index].checked;
    setTask({ ...task, checklist: updated });

    const completed = updated.filter(c => c.checked).length;
    const percentage = updated.length > 0 ? Math.round((completed / updated.length) * 100) : 0;
    const now = new Date();
    const due = new Date(task.dueDate);

    let newStatus = "Pending";
    if (percentage === 100 && now <= due) newStatus = "Completed";
    else if (now > due && percentage < 100) newStatus = "Missing";

    setCompletion(percentage);
    setStatus(newStatus);
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setTask({
        ...task,
        checklist: [...task.checklist, { item: newChecklistItem, checked: false }]
      });
      setNewChecklistItem("");
    }
  };

  const removeChecklistItem = (index) => {
    const updated = [...task.checklist];
    updated.splice(index, 1);
    setTask({ ...task, checklist: updated });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const updatedTask = {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        checklist: task.checklist,
        completed: completion === 100
      };
      const res = await updateTask(id, updatedTask, token);
      if (res?._id) {
        navigate("/");
      } else {
        alert("Failed to update task");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating task");
    }
  };

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h2>✏️ Edit Task</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label>Title:</label>
          <input
            name="title"
            value={task.title}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Description:</label>
          <textarea
            name="description"
            value={task.description}
            rows="4"
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          ></textarea>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Due Date:</label>
          <input
            type="datetime-local"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <h4>Checklist</h4>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              placeholder="New checklist item"
              style={{ width: "70%", padding: "8px", marginRight: "10px" }}
            />
            <button type="button" onClick={addChecklistItem}>
              Add Item
            </button>
          </div>
          
          <ul style={{ listStyle: "none", padding: 0 }}>
            {task.checklist.map((item, i) => (
              <li key={i} style={{ marginBottom: "5px", display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleChecklistItem(i)}
                  style={{ marginRight: "10px" }}
                />
                <span style={{ flex: 1 }}>{item.item}</span>
                <button
                  type="button"
                  onClick={() => removeChecklistItem(i)}
                  style={{ color: "red", border: "none", background: "none" }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <p>✅ Completion: {completion}%</p>
          <p>📅 Status: <strong>{status}</strong></p>
        </div>

        <button type="submit" style={{ padding: "10px 20px", marginRight: "10px" }}>
          Update Task
        </button>
        <button type="button" onClick={() => navigate("/")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditTaskPage;