"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../register.module.css";
import { registerAdmin, storeToken } from "../../../services/api";

export default function AdminRegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await registerAdmin(formData);
      storeToken(data);
      alert(`Successfully registered as Admin!`);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Admin registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.authCard} ${styles.adminTheme}`}>
        <div className={styles.toggleContainer}>
          <Link
            href="/register"
            className={styles.toggleBtn}
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            Member Registration
          </Link>
          <button
            type="button"
            className={`${styles.toggleBtn} ${styles.active}`}
          >
            Admin Registration
          </button>
        </div>

        <div className={styles.header}>
          <div className={styles.secureBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Secure Management Console
          </div>
          <h1 className={styles.title}>Create Admin Account</h1>
          <p className={styles.subtitle}>Register to manage teams and projects</p>
        </div>

        {error && <div className={styles.errorMessage} style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form className={styles.form} onSubmit={handleRegister}>
          <div className={styles.nameGroup}>
            <div className={styles.formGroup}>
              <label className="label" htmlFor="first_name">First Name</label>
              <input 
                type="text" 
                id="first_name" 
                className="input-field" 
                placeholder="Admin" 
                required 
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label className="label" htmlFor="last_name">Last Name</label>
              <input 
                type="text" 
                id="last_name" 
                className="input-field" 
                placeholder="User" 
                required 
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className="label" htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="input-field" 
              placeholder="admin@company.com" 
              required 
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className="label" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className="input-field" 
              placeholder="••••••••" 
              required 
              minLength={8}
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? "Registering..." : "Register as Admin"}
          </button>

          <div className={styles.divider}>
            <span>Or continue with</span>
          </div>

          <button type="button" className="btn-secondary">
            Single Sign-On (SSO)
          </button>
        </form>

        <div className={styles.footer}>
          Already have an admin account? <Link href="/login/admin" className={styles.link}>Login here</Link>
        </div>
      </div>
    </div>
  );
}
