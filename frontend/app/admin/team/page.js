"use client";

import { useState, useEffect } from "react";
import styles from "./team.module.css";
import { getAdminTeamSummary, addTeamMember, removeTeamMember } from "../../../services/api";

export default function TeamManagement() {
  const [data, setData] = useState({ managed_projects: [], memberships: [], capacity: { used: 0, total: 20 } });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ email: "", role: "Member", project_id: "" });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAdminTeamSummary();
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

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!formData.project_id) return alert("Please select a project.");
    try {
      await addTeamMember(formData.project_id, formData.email, formData.role);
      alert("Member added successfully!");
      setFormData({ email: "", role: "Member", project_id: data.managed_projects[0]?.id || "" });
      fetchData();
    } catch (err) {
      alert("Failed to add member. " + (err.error || err.message || ""));
    }
  };

  const handleRemoveMember = async (projectId, userId) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await removeTeamMember(projectId, userId);
      fetchData();
    } catch (err) {
      alert("Failed to remove member. " + (err.error || err.message || ""));
    }
  };

  const { capacity } = data;
  const percentage = capacity.total > 0 ? (capacity.used / capacity.total) * 100 : 0;

  if (loading) return <div style={{ padding: '2rem' }}>Loading Team Management...</div>;

  return (
    <div className={styles.teamLayout}>
      <div className={styles.topSection}>
        {/* Top/Left: Add Team Member Form */}
        <div className={styles.formCard}>
          <h2 className={styles.cardTitle}>Add Team Member</h2>
          <form className={styles.formRow} onSubmit={handleAddMember}>
            <div className={styles.formGroup}>
              <label className="label" htmlFor="project_id">Select Project</label>
              <select id="project_id" className="input-field" value={formData.project_id} onChange={handleInputChange} required>
                {data.managed_projects.length === 0 && <option value="">No projects available</option>}
                {data.managed_projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className="label" htmlFor="email">Email Address</label>
              <input type="email" id="email" className="input-field" placeholder="new.member@company.com" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div className={styles.formGroup}>
              <label className="label" htmlFor="role">Role</label>
              <select id="role" className="input-field" value={formData.role} onChange={handleInputChange}>
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <button type="submit" className="btn-primary" style={{ padding: '0.625rem 1.25rem', height: '42px', width: '100%' }} disabled={data.managed_projects.length === 0}>
                Add Member
              </button>
            </div>
          </form>
        </div>

        {/* Top/Right: Team Overview Summary */}
        <div className={styles.summaryCard}>
          <div className={styles.summaryTitle}>Team Capacity Overview</div>
          <div className={styles.summaryStats}>
            <span className={styles.statNumber}>{capacity.used}</span>
            <span className={styles.statTotal}>/ {capacity.total} Seats Used</span>
          </div>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar} style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main: Current Members Table */}
      <div className={styles.tableCard}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h2 className={styles.cardTitle} style={{ border: 'none', margin: 0, padding: 0 }}>Current Members</h2>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Member</th>
                <th>Project</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.memberships.length > 0 ? data.memberships.map(membership => {
                const memberName = (membership.user_first_name || membership.user_last_name) ? `${membership.user_first_name} ${membership.user_last_name}` : membership.user_email;
                return (
                  <tr key={membership.id}>
                    <td>
                      <div className={styles.memberCell}>
                        <div className={styles.memberAvatar}>{memberName[0].toUpperCase()}</div>
                        <div className={styles.memberInfo}>
                          <span className={styles.memberName}>{memberName}</span>
                          <span className={styles.memberEmail}>{membership.user_email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: 'var(--color-slate-600)', fontSize: '0.875rem' }}>{membership.project_name}</span>
                    </td>
                    <td>
                      <span className={`${styles.roleBadge} ${membership.role === 'Admin' ? styles.roleAdmin : styles.roleMember}`}>
                        {membership.role}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.375rem',
                        color: 'var(--color-success)'
                      }}>
                        <span style={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          backgroundColor: 'var(--color-success)'
                        }}></span>
                        Active
                      </span>
                    </td>
                    <td>
                      <button className={styles.actionBtn} onClick={() => handleRemoveMember(membership.project, membership.user)}>Remove</button>
                    </td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No members found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
