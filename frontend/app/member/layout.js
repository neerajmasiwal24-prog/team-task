"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";
import { getCurrentUser, logoutUser } from "../../services/api";

export default function MemberLayout({ children }) {
  const pathname = usePathname();
  const [userName, setUserName] = useState("Member");

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserName(user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.email.split("@")[0]);
    }
  }, []);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <Link href="/member/workspace" className={styles.brand}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            Task Manager
          </Link>
          <nav className={styles.nav}>
            <Link 
              href="/member/workspace" 
              className={`${styles.navItem} ${pathname === "/member/workspace" ? styles.active : ""}`}
            >
              My Workspace
            </Link>
          </nav>
        </div>
        
        <div className={styles.userProfile} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span>{userName}</span>
            <div className={styles.avatar}>{userName[0].toUpperCase()}</div>
          </div>
          <button 
            onClick={async () => {
              await logoutUser();
              window.location.href = '/login';
            }}
            style={{
              background: 'none',
              border: '1px solid var(--color-slate-200)',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              cursor: 'pointer',
              color: 'var(--color-slate-600)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.875rem'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </header>
      
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
