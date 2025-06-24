import React, { useEffect, useState } from "react";
import { getTask, deleteTask } from "../api";
import { useParams, useNavigate } from "react-router-dom";

const DeleteTaskPage = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTask = async () => {
      try {
        const data = await getTask(id, token);
        setTask(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load task.");
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id, token]);

  const handleConfirmDelete = async () => {
    try {
      await deleteTask(id, token);
      navigate("/"); // Go back to home page after deletion
    } catch (err) {
      console.error(err);
      setError("Failed to delete task.");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!task) return <p>No task found.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Are you sure you want to delete this task?</h2>
      <h3>{task.title}</h3>
      <p>{task.description}</p>

      <div style={{ marginTop: 20 }}>
        <button onClick={handleConfirmDelete} style={{ marginRight: 10, backgroundColor: 'red', color: 'white' }}>
          Yes, Delete
        </button>
        <button onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteTaskPage;
