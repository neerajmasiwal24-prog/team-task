"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";
import { getCurrentUser, logoutUser } from "../../services/api";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserName(user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.email.split("@")[0]);
    }
  }, []);

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          Admin Portal
        </div>
        <nav className={styles.nav}>
          <Link 
            href="/admin/projects" 
            className={`${styles.navItem} ${pathname === "/admin/projects" ? styles.active : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            Project Management
          </Link>
          <Link 
            href="/admin/dashboard" 
            className={`${styles.navItem} ${pathname === "/admin/dashboard" ? styles.active : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9"></rect>
              <rect x="14" y="3" width="7" height="5"></rect>
              <rect x="14" y="12" width="7" height="9"></rect>
              <rect x="3" y="16" width="7" height="5"></rect>
            </svg>
            Task Control Center
          </Link>
          <Link 
            href="/admin/team" 
            className={`${styles.navItem} ${pathname === "/admin/team" ? styles.active : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Team Management
          </Link>
        </nav>
        <div className={styles.sidebarFooter}>
          <button 
            onClick={async () => {
              await logoutUser();
              window.location.href = '/login/admin';
            }}
            className={styles.navItem}
            style={{
              background: 'none',
              border: 'none',
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'inherit'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Sign out
          </button>
        </div>
      </aside>
      <main className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.userProfile}>
            <span>{userName}</span>
            <div className={styles.avatar}>{userName[0].toUpperCase()}</div>
          </div>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
