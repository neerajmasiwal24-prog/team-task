"use client";

import { useState, useEffect } from "react";
import styles from "./projects.module.css";
import { getAdminTeamSummary, createProject } from "../../../services/api";

export default function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // We can reuse getAdminTeamSummary as it returns managed_projects along with their memberships
      const res = await getAdminTeamSummary();
      setProjects(res.managed_projects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await createProject(formData);
      alert("Project created successfully!");
      setFormData({ name: "", description: "" });
      fetchProjects(); // Refresh the project list
    } catch (err) {
      alert("Failed to create project. " + (err.error || err.message || ""));
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Projects...</div>;

  return (
    <div className={styles.projectsLayout}>
      {/* Left: Create Project Form */}
      <div className={styles.leftColumn}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Create New Project</h2>
          <form onSubmit={handleCreateProject}>
            <div className={styles.formGroup}>
              <label className="label" htmlFor="name">Project Name</label>
              <input 
                type="text" 
                id="name" 
                className="input-field" 
                placeholder="E.g., Q3 Marketing Campaign" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <label className="label" htmlFor="description">Description (Optional)</label>
              <textarea 
                id="description" 
                className="input-field" 
                rows="4" 
                placeholder="Briefly describe the goals of this project..." 
                value={formData.description} 
                onChange={handleInputChange}
              ></textarea>
            </div>
            <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
              Create Project
            </button>
          </form>
        </div>
      </div>

      {/* Right: Managed Projects List */}
      <div className={styles.rightColumn}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--color-slate-900)' }}>
            Managed Projects
          </h2>
          <p style={{ color: 'var(--color-slate-500)', fontSize: '0.875rem' }}>
            Projects where you have an Admin role.
          </p>
        </div>
        
        {projects.length === 0 ? (
          <div className={styles.card} style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--color-slate-500)' }}>You are not managing any projects yet.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {projects.map((project) => {
              const members = project.memberships || [];
              const displayMembers = members.slice(0, 4);
              const extraMembers = members.length - 4;

              return (
                <div key={project.id} className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <h3 className={styles.projectTitle}>{project.name}</h3>
                    <span className={styles.projectBadge}>ID: {project.id}</span>
                  </div>
                  <p className={styles.projectDesc}>
                    {project.description || "No description provided."}
                  </p>
                  <div className={styles.projectFooter}>
                    <div className={styles.memberAvatars}>
                      {displayMembers.map(m => {
                        const initial = (m.user_first_name || m.user_email || "?")[0].toUpperCase();
                        return (
                          <div key={m.id} className={styles.avatar} title={m.user_email}>
                            {initial}
                          </div>
                        );
                      })}
                      {extraMembers > 0 && (
                        <div className={`${styles.avatar} ${styles.moreMembers}`}>
                          +{extraMembers}
                        </div>
                      )}
                      {members.length === 0 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-400)' }}>Just you</span>
                      )}
                    </div>
                    <div className={styles.dateInfo}>
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
