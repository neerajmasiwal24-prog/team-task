"use client";

import { use, useState, useEffect } from "react";
import styles from "./task.module.css";
import Link from "next/link";
import { getTaskDetail, updateTaskStatus } from "../../../../services/api";

export default function TaskDetail({ params }) {
  // In Next 15 App router, params is a promise
  const resolvedParams = use(params);
  const taskId = resolvedParams.id;

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("In Progress");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const data = await getTaskDetail(taskId);
        setTask(data);
        setStatus(data.status);
      } catch (err) {
        setError("Failed to load task details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const handleStatusChange = async (newStatus) => {
    try {
      setStatus(newStatus);
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      alert("Failed to update status");
      // Revert if failed
      if (task) setStatus(task.status);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading task details...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;
  if (!task) return <div style={{ padding: '2rem' }}>Task not found</div>;

  const activityTimeline = [
    { id: 1, user: "System", action: `Task created`, time: new Date(task.created_at).toLocaleDateString(), type: "assignment" },
  ];

  const assigneeName = task.assigned_to_email ? task.assigned_to_email.split('@')[0] : `User ${task.assigned_to}`;

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/member/workspace" style={{ color: 'var(--color-blue-600)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
          &larr; Back to Workspace
        </Link>
      </div>

      <div className={styles.taskHeader}>
        <div className={styles.titleArea}>
          <span className={styles.taskId}>TSK-{task.id}</span>
          <h1 className={styles.taskTitle}>{task.title}</h1>
        </div>
        <div>
          <select 
            className={styles.statusDropdown}
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            style={{ 
              backgroundColor: status === 'Done' ? '#ecfdf5' : status === 'In Progress' ? 'var(--color-blue-50)' : 'white',
              color: status === 'Done' ? 'var(--color-success)' : status === 'In Progress' ? 'var(--color-blue-700)' : 'var(--text-primary)',
              borderColor: status === 'Done' ? 'var(--color-success)' : status === 'In Progress' ? 'var(--color-blue-300)' : 'var(--border-color)'
            }}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      <div className={styles.contentGrid}>
        {/* Main Content Area */}
        <div>
          <div className={styles.descriptionCard}>
            <h2 className={styles.cardTitle}>Task Description</h2>
            <div className={styles.descriptionText}>
              {task.description || "No description provided."}
            </div>
          </div>

          <div className={styles.timeline}>
            <h2 className={styles.cardTitle}>Activity Timeline</h2>
            <div className={styles.timelineList}>
              {activityTimeline.map(item => (
                <div key={item.id} className={styles.timelineItem}>
                  <div className={styles.timelineDot} style={{ 
                    backgroundColor: item.type === 'comment' ? 'var(--color-warning)' : item.type === 'status' ? 'var(--color-blue-500)' : 'var(--color-success)' 
                  }}></div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <span className={styles.timelineUser}>{item.user}</span>
                      <span className={styles.timelineTime}>{item.time}</span>
                    </div>
                    <div className={styles.timelineText}>{item.action}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <input type="text" className="input-field" placeholder="Add a comment..." />
              <button className="btn-primary">Post</button>
            </div>
          </div>
        </div>

        {/* Sidebar: Meta Details */}
        <div className={styles.metaSidebar}>
          <div className={styles.metaCard}>
            <h2 className={styles.cardTitle}>Meta Details</h2>
            <div className={styles.metaList}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Due Date</span>
                <span className={styles.metaValue}>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Priority</span>
                <span className={styles.metaValue}>
                  <span className={`badge badge-progress`} style={{ 
                    backgroundColor: '#e0e7ff', 
                    color: 'var(--color-blue-600)' 
                  }}>Normal</span>
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Assignee</span>
                <span className={styles.metaValue} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 600 }}>
                    {assigneeName.charAt(0).toUpperCase()}
                  </div>
                  {assigneeName}
                </span>
              </div>
              {task.project_name && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Project</span>
                  <span className={styles.metaValue}>{task.project_name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
