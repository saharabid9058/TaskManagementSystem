import React, { useEffect, useState } from "react";
import { fetchTasks, updateTask, deleteTask, aiExplainTask } from "../api";
import { useNavigate } from "react-router-dom";

const HomePage = ({ token, setToken }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const classifyTask = (task) => {
    const now = new Date();
    const due = new Date(task.dueDate);
    if (task.completed && due >= now) return "completed";
    if (!task.completed && due < now) return "missing";
    return "pending";
  };

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchTasks(token);
      const updated = data.map(task => {
        const total = task.checklist?.length || 0;
        const done = task.checklist?.filter(i => i.checked).length || 0;
        const completed = total > 0 && done === total;
        return { ...task, completed };
      });
      setTasks(updated);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    loadTasks();
    const interval = setInterval(loadTasks, 10000);
    return () => clearInterval(interval);
  }, [token, navigate]);

  const counts = {
    all: tasks.length,
    pending: tasks.filter(t => classifyTask(t) === "pending").length,
    completed: tasks.filter(t => classifyTask(t) === "completed").length,
    missing: tasks.filter(t => classifyTask(t) === "missing").length,
  };

  const filteredTasks = tasks.filter(t => filter === "all" || classifyTask(t) === filter);

  return (
    <div className="container" style={{ padding: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>📋 To-Do Dashboard</h1>
        <div>
          <button onClick={() => navigate("/add")} style={{ marginRight: 10 }}>➕ Add Task</button>
          <button onClick={handleLogout} style={{ backgroundColor: "#f44", color: "white", padding: "8px 16px", border: "none", borderRadius: "5px" }}>Logout</button>
        </div>
      </header>

      <div style={{ display: "flex", gap: "15px", marginTop: 30 }}>
        {["all", "pending", "completed", "missing"].map(status => (
          <div key={status} onClick={() => setFilter(status)} style={{ flex: 1, padding: 20, borderRadius: 8, backgroundColor: filter === status ? "#eee" : "#fff", boxShadow: filter === status ? "0 0 10px #000" : "0 0 5px #ccc", cursor: "pointer", textAlign: "center" }}>
            <h3>{status.charAt(0).toUpperCase() + status.slice(1)} Tasks</h3>
            <p style={{ fontSize: 24 }}>{counts[status]}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 30 }}>
        {loading ? <p>Loading tasks...</p> : filteredTasks.map(task => (
          <TaskCard key={task._id} task={task} status={classifyTask(task)} onDelete={() => deleteTask(task._id)} onEdit={() => navigate(`/edit/${task._id}`)} token={token} refresh={loadTasks} />
        ))}
      </div>
    </div>
  );
};

const TaskCard = ({ task, status, onDelete, onEdit, token, refresh }) => {
  const [localChecklist, setLocalChecklist] = useState(task.checklist || []);
  const [explanation, setExplanation] = useState("");

  const total = localChecklist.length;
  const done = localChecklist.filter(i => i.checked).length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  const toggleItem = async (index) => {
    const updated = [...localChecklist];
    updated[index].checked = !updated[index].checked;
    const completed = updated.every(i => i.checked);
    setLocalChecklist(updated);
    await updateTask(task._id, { checklist: updated, completed }, token);
    refresh();
  };

  const fetchExplanation = async () => {
    const res = await aiExplainTask(task._id, token);
    setExplanation(res.explanation);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 15, borderRadius: 6, marginBottom: 15, backgroundColor: task.aiRisk === "high" ? "#ffd6d6" : status === "completed" ? "#d4f7dc" : "#fff" }}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>📅 Due: {new Date(task.dueDate).toLocaleString()}</p>
      <p>✅ Completion: {percent}%</p>
      <p>Status: {status.charAt(0).toUpperCase() + status.slice(1)}</p>
      <p>⚠️ AI Risk: {task.aiRisk}</p>
      <p>💡 Suggestion: {task.aiSuggestion}</p>

      {localChecklist.map((item, i) => (
        <label key={i} style={{ display: "block", marginTop: 5 }}>
          <input type="checkbox" checked={item.checked} onChange={() => toggleItem(i)} /> {item.item}
        </label>
      ))}

      <div style={{ marginTop: 15 }}>
        <button onClick={onEdit} style={{ marginRight: 10 }}>✏️ Edit</button>
        <button onClick={onDelete} style={{ marginRight: 10 }}>🗑️ Delete</button>
        <button onClick={fetchExplanation}>💬 Explain</button>
      </div>

      {explanation && (
        <div style={{ marginTop: 10, padding: 10, border: "1px solid #aaa", borderRadius: 6 }}>
          <h4>AI Explanation:</h4>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
