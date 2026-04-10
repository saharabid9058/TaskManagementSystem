import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTask } from "../api";

const AddTaskPage = ({ token }) => {
  const [task, setTask] = useState({ title: "", description: "", dueDate: "" });
  const [checklist, setChecklist] = useState([]);
  const [checkItem, setCheckItem] = useState("");
  const [aiInfo, setAiInfo] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => setTask({ ...task, [e.target.name]: e.target.value });

  const addChecklistItem = () => {
    if (checkItem.trim()) {
      setChecklist([...checklist, { item: checkItem, checked: false }]);
      setCheckItem("");
    }
  };

  const removeChecklistItem = index => {
    const updated = [...checklist];
    updated.splice(index, 1);
    setChecklist(updated);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!task.title || !task.dueDate) {
      alert('Title and due date are required');
      return;
    }

    try {
      const fullTask = { ...task, dueDate: new Date(task.dueDate).toISOString(), checklist };
      const res = await createTask(fullTask, token);
      if (res?._id) {
        setAiInfo({ risk: res.aiRisk, suggestion: res.aiSuggestion });
        navigate("/"); 
      } else alert("Failed to create task");
    } catch (error) {
      console.error('Task creation error:', error);
      alert("Error creating task: " + (error.message || 'Unknown error'));
    }
  };

  return (
    <div className="container">
      <h2>➕ Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" required onChange={handleChange} />
        <textarea name="description" placeholder="Description" rows="4" onChange={handleChange}></textarea>
        <input type="datetime-local" name="dueDate" required onChange={handleChange} />

        <div>
          <h4>Checklist</h4>
          <input
            type="text"
            placeholder="Add checklist item"
            value={checkItem}
            onChange={(e) => setCheckItem(e.target.value)}
          />
          <button type="button" onClick={addChecklistItem}>Add</button>
          <ul>
            {checklist.map((c, idx) => (
              <li key={idx}>
                {c.item}
                <button type="button" onClick={() => removeChecklistItem(idx)}>❌</button>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit">Create Task</button>
      </form>

      {aiInfo && (
        <div style={{ marginTop: 20, padding: 10, border: "1px solid #ccc", borderRadius: 6 }}>
          <h4>🤖 AI Analysis</h4>
          <p>⚠️ Risk: {aiInfo.risk}</p>
          <p>💡 Suggestion: {aiInfo.suggestion}</p>
        </div>
      )}
    </div>
  );
};

export default AddTaskPage;
