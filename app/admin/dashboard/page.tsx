"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Users,
  Activity,
  Heart,
  Stethoscope,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Shield,
  LogOut,
  Settings,
  Bell,
  Menu,
  Calendar,
  MessageSquare,
  FileText
} from "lucide-react"
import styles from "./dashboard.module.css"

interface StatCard {
  title: string
  value: string
  change: number
  icon: React.ReactNode
}

interface RecentActivity {
  id: number
  action: string
  user: string
  time: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/auth")
    }
  }, [router])

  const stats: StatCard[] = [
    {
      title: "Total Users",
      value: "5,234",
      change: 12.5,
      icon: <Users className={styles.statIcon} />
    },
    {
      title: "Active Consultations",
      value: "156",
      change: 8.3,
      icon: <Stethoscope className={styles.statIcon} />
    },
    {
      title: "Health Analyses",
      value: "2,856",
      change: 8.7,
      icon: <Activity className={styles.statIcon} />
    },
    {
      title: "Success Rate",
      value: "95%",
      change: 15.3,
      icon: <Heart className={styles.statIcon} />
    }
  ]

  const recentActivity: RecentActivity[] = [
    { id: 1, action: "New symptom analysis completed", user: "Dr. Sarah Johnson", time: "5 minutes ago" },
    { id: 2, action: "Health consultation scheduled", user: "Dr. Michael Chen", time: "15 minutes ago" },
    { id: 3, action: "AI diagnosis review", user: "Dr. Emily Rodriguez", time: "1 hour ago" },
    { id: 4, action: "Patient feedback received", user: "Dr. James Wilson", time: "2 hours ago" }
  ]

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/auth")
  }

  if (!isClient) return null

  return (
    <div className={styles.container}>
      <button 
        className={styles.menuToggle} 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={24} />
      </button>
      
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <Stethoscope size={24} />
          <span>SymptoSeek Admin</span>
        </div>
        
        <nav className={styles.sidebarNav}>
          <a href="#" className={`${styles.sidebarLink} ${styles.active}`}>
            <BarChart3 size={20} />
            Overview
          </a>
          <a href="#" className={styles.sidebarLink}>
            <Users size={20} />
            Patients
          </a>
          <a href="#" className={styles.sidebarLink}>
            <Heart size={20} />
            Health Analysis
          </a>
          <a href="#" className={styles.sidebarLink}>
            <Calendar size={20} />
            Appointments
          </a>
          <a href="#" className={styles.sidebarLink}>
            <MessageSquare size={20} />
            Consultations
          </a>
          <a href="#" className={styles.sidebarLink}>
            <FileText size={20} />
            Reports
          </a>
          <a href="#" className={styles.sidebarLink}>
            <Settings size={20} />
            Settings
          </a>
        </nav>

        <button onClick={handleLogout} className={styles.logoutButton}>
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Admin Overview</h1>
          <div className={styles.headerActions}>
            <button className={styles.iconButton}>
              <Bell size={20} />
            </button>
            <button className={styles.iconButton}>
              <Settings size={20} />
            </button>
          </div>
        </header>

        <div className={styles.stats}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statHeader}>
                {stat.icon}
                <span className={styles.statTitle}>{stat.title}</span>
              </div>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={`${styles.statChange} ${stat.change >= 0 ? styles.positive : styles.negative}`}>
                {stat.change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {Math.abs(stat.change)}%
              </div>
            </div>
          ))}
        </div>

        <section className={styles.activitySection}>
          <h2>Recent Activity</h2>
          <div className={styles.activityList}>
            {recentActivity.map((activity) => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={styles.activityContent}>
                  <span className={styles.activityAction}>{activity.action}</span>
                  <span className={styles.activityUser}>{activity.user}</span>
                </div>
                <span className={styles.activityTime}>{activity.time}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}