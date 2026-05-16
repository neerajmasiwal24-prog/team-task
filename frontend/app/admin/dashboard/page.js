"use client";

import { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import { getAdminDashboardSummary, createTask } from "../../../services/api";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState({ managed_projects: [], all_tasks: [] });
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "", description: "", status: "To Do", due_date: "", assigned_to_email: "", project_id: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboardSummary();
      setData(res);
      if (res.managed_projects.length > 0) {
        setFormData(prev => ({ ...prev, project_id: res.managed_projects[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.project_id) return alert("Please select a project.");
    try {
      await createTask(formData.project_id, formData);
      alert("Task created successfully!");
      setFormData({ title: "", description: "", status: "To Do", due_date: "", assigned_to_email: "", project_id: data.managed_projects[0]?.id || "" });
      fetchData(); // Refresh table
    } catch (err) {
      alert("Failed to create task. " + (err.message || ""));
    }
  };

  const filteredTasks = data.all_tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (task.assigned_to_email && task.assigned_to_email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case "Done": return <span className="badge badge-done">Done</span>;
      case "In Progress": return <span className="badge badge-progress">In Progress</span>;
      default: return <span className="badge badge-todo">To Do</span>;
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Dashboard...</div>;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Task Control Center</h1>
      </div>

      <div className={styles.dashboardGrid}>
        {/* Left: New Task Creation Form */}
        <div className={styles.formCard}>
          <h2 className={styles.cardTitle}>Create New Task</h2>
          <form onSubmit={handleCreateTask}>
            <div className={styles.formGroup}>
              <label className="label" htmlFor="project_id">Project</label>
              <select id="project_id" className="input-field" value={formData.project_id} onChange={handleInputChange} required>
                {data.managed_projects.length === 0 && <option value="">No projects available</option>}
                {data.managed_projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className="label" htmlFor="title">Task Title</label>
              <input type="text" id="title" className="input-field" placeholder="E.g., Implement payment gateway" value={formData.title} onChange={handleInputChange} required />
            </div>
            
            <div className={styles.formGroup}>
              <label className="label" htmlFor="description">Description</label>
              <textarea id="description" className="input-field" rows="3" placeholder="Provide details about the task..." value={formData.description} onChange={handleInputChange}></textarea>
            </div>

            <div className={styles.formGroup}>
              <label className="label" htmlFor="status">Initial Status</label>
              <select id="status" className="input-field" value={formData.status} onChange={handleInputChange}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className="label" htmlFor="due_date">Due Date</label>
              <input type="date" id="due_date" className="input-field" value={formData.due_date} onChange={handleInputChange} />
            </div>

            <div className={styles.formGroup}>
              <label className="label" htmlFor="assigned_to_email">Assignee (Email)</label>
              <input type="email" id="assigned_to_email" className="input-field" placeholder="member@company.com" value={formData.assigned_to_email} onChange={handleInputChange} />
            </div>

            <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={data.managed_projects.length === 0}>Create Task</button>
          </form>
        </div>

        {/* Right: Active Task Inventory */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2 className={styles.cardTitle} style={{ border: 'none', margin: 0, padding: 0 }}>Active Task Inventory</h2>
            <div className={styles.searchBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                className={styles.searchInput} 
                placeholder="Search tasks, assignees..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Task ID</th>
                  <th>Task Title</th>
                  <th>Assignee</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length > 0 ? filteredTasks.map(task => (
                  <tr key={task.id}>
                    <td style={{ fontWeight: 500, color: 'var(--color-blue-700)' }}>TSK-{task.id}</td>
                    <td>
                      <div>{task.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>{task.project_name}</div>
                    </td>
                    <td>
                      <div className={styles.assigneeCell}>
                        <div className={styles.assigneeAvatar}>{task.assigned_to_email ? task.assigned_to_email[0].toUpperCase() : '?'}</div>
                        <span>{task.assigned_to_email || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td>{getStatusBadge(task.status)}</td>
                    <td>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-slate-500)' }}>No tasks found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
