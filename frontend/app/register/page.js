"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./register.module.css";
import { registerMember, storeToken } from "../../services/api";

export default function MemberRegisterPage() {
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
      const data = await registerMember(formData);
      storeToken(data);
      alert(`Successfully registered as Member!`);
      router.push("/member/workspace");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.toggleContainer}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${styles.active}`}
          >
            Member Registration
          </button>
          <Link
            href="/register/admin"
            className={styles.toggleBtn}
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            Admin Registration
          </Link>
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Create an Account</h1>
          <p className={styles.subtitle}>Sign up to start tracking your tasks</p>
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
                placeholder="John" 
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
                placeholder="Doe" 
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
              placeholder="name@company.com" 
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
            {loading ? "Registering..." : "Register as Member"}
          </button>

          <div className={styles.divider}>
            <span>Or continue with</span>
          </div>

          <button type="button" className="btn-secondary">
            Single Sign-On (SSO)
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account? <Link href="/login" className={styles.link}>Login here</Link>
        </div>
      </div>
    </div>
  );
}
