"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./workspace.module.css";
import { getDashboardSummary, updateTaskStatus, getCurrentUser } from "../../../services/api";

export default function MemberWorkspace() {
  const [data, setData] = useState({ active_projects: [], assigned_tasks: [], summary: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getDashboardSummary();
      setData(res);
      const user = getCurrentUser();
      if (user) {
        setUserName(user.first_name || user.email.split("@")[0]);
      }
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (e, taskId) => {
    e.preventDefault();
    const newStatus = e.target.value;
    try {
      await updateTaskStatus(taskId, newStatus);
      // Refresh the dashboard to get accurate summary
      fetchDashboardData();
    } catch (err) {
      alert("Failed to update task status");
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading workspace...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;

  const { active_projects, assigned_tasks, summary } = data;
  const { status_breakdown } = summary;
  const percentage = summary.total_assigned > 0 ? Math.round((status_breakdown?.Done || 0) / summary.total_assigned * 100) : 0;

  return (
    <div>
      <div className={styles.hero}>
        <h1 className={styles.welcomeText}>Welcome back, {userName || "Member"}!</h1>
        <p className={styles.dateText}>Here's what's happening with your tasks today.</p>
      </div>

      <div className={styles.workspaceGrid}>
        {/* Left Column: Projects & Tasks */}
        <div>
          <section>
            <h2 className={styles.sectionTitle}>Active Projects</h2>
            <div className={styles.projectsGrid}>
              {active_projects.length > 0 ? active_projects.map(project => {
                const projPercentage = project.tasks_count > 0 ? Math.round((project.completed_tasks_count / project.tasks_count) * 100) : 0;
                return (
                  <Link href="#" key={project.id} className={styles.projectCard}>
                    <div className={styles.projectHeader}>
                      <div className={styles.projectIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                      </div>
                      <span className="badge badge-progress" style={{ fontSize: '0.7rem' }}>
                        {projPercentage}%
                      </span>
                    </div>
                    <h3 className={styles.projectTitle}>{project.name}</h3>
                    <div className={styles.projectMeta}>
                      {project.completed_tasks_count} / {project.tasks_count} Tasks Completed
                    </div>
                  </Link>
                );
              }) : <p style={{ color: '#64748b' }}>No active projects.</p>}
            </div>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>Assigned to Me</h2>
            <div className={styles.taskList}>
              {assigned_tasks.length > 0 ? assigned_tasks.map(task => (
                <Link href={`/member/task/${task.id}`} key={task.id} className={styles.taskItem}>
                  <div className={styles.taskInfo}>
                    <div className={styles.taskTitle}>{task.title}</div>
                    <div className={styles.taskProject}>{task.project_name || 'Project'} • Due {new Date(task.due_date).toLocaleDateString()}</div>
                  </div>
                  <div className={styles.taskActions}>
                    <select 
                      className={styles.statusSelect}
                      defaultValue={task.status}
                      onClick={(e) => e.preventDefault()}
                      onChange={(e) => handleStatusChange(e, task.id)}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </Link>
              )) : <p style={{ color: '#64748b' }}>No tasks assigned.</p>}
            </div>
          </section>
        </div>

        {/* Right Column: Summary Widget */}
        <div>
          <div className={styles.summaryWidget}>
            <h2 className={styles.widgetTitle}>Weekly Summary</h2>
            
            <div className={styles.progressCircle}>
              <div style={{ textAlign: 'center' }}>
                <div className={styles.circleValue}>{percentage}%</div>
                <div className={styles.circleLabel}>Tasks Completed</div>
              </div>
            </div>

            <div className={styles.statRow}>
              <span className={styles.statLabel}>Total Assigned</span>
              <span className={styles.statValue}>{summary.total_assigned || 0}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Completed</span>
              <span className={styles.statValue}>{status_breakdown?.Done || 0}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>In Progress</span>
              <span className={styles.statValue}>{status_breakdown?.['In Progress'] || 0}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>To Do</span>
              <span className={styles.statValue}>{status_breakdown?.['To Do'] || 0}</span>
            </div>
            
            <button className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', backgroundColor: 'var(--color-blue-600)' }}>
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
