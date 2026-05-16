"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";
import { loginMember, storeToken } from "../../services/api";

export default function MemberLoginPage() {
  const router = useRouter();
  
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginMember(credentials);
      storeToken(data);
      router.push("/member/workspace");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.toggleContainer}>
          <button
            className={`${styles.toggleBtn} ${styles.active}`}
          >
            Member Login
          </button>
          <Link
            href="/login/admin"
            className={styles.toggleBtn}
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            Admin Portal
          </Link>
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to access your tasks and projects</p>
        </div>

        {error && <div className={styles.errorMessage} style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className="label" htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="input-field" 
              placeholder="name@company.com" 
              required 
              value={credentials.email}
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
              value={credentials.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? "Signing in..." : "Sign In as Member"}
          </button>

          <div className={styles.divider}>
            <span>Or continue with</span>
          </div>

          <button type="button" className="btn-secondary">
            Single Sign-On (SSO)
          </button>
        </form>

        <div className={styles.footer}>
          Don't have an account? <Link href="/register" className={styles.link}>Register here</Link>
        </div>
      </div>
    </div>
  );
}
