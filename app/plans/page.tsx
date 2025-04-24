"use client"

import { useState } from 'react'
import { Calendar, Clock, Plus, LayoutDashboard, FileText, Bell, User, Settings, LogOut, Stethoscope, Menu } from "lucide-react"
import Link from "next/link"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"
import styles from "./plans.module.css"

interface Plan {
  id: number
  title: string
  date: string
  time: string
  type: string
  status: "upcoming" | "completed" | "cancelled"
}

const plans: Plan[] = [
  {
    id: 1,
    title: "General Health Check-up",
    date: "2024-04-15",
    time: "10:00 AM",
    type: "Check-up",
    status: "upcoming"
  },
  {
    id: 2,
    title: "Dental Cleaning",
    date: "2024-04-20",
    time: "2:30 PM",
    type: "Dental",
    status: "upcoming"
  },
  {
    id: 3,
    title: "Blood Test",
    date: "2024-03-10",
    time: "9:00 AM",
    type: "Test",
    status: "completed"
  }
]

export default function PlansPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className={styles.container}>
      <button 
        className={styles.menuButton} 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={24} />
      </button>

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <Link href="/" className={styles.mainLogo}>
          <div className={styles.logoIcon}>
            <Stethoscope size={24} />
          </div>
          <span>SymptoSeek</span>
        </Link>

        <nav>
          <Link href="/dashboard" className={styles.navItem}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/reports" className={styles.navItem}>
            <FileText size={20} />
            Reports
          </Link>
          <Link href="/plans" className={`${styles.navItem} ${styles.active}`}>
            <Calendar size={20} />
            Plans
          </Link>
          <Link href="/reminders" className={styles.navItem}>
            <Bell size={20} />
            Reminders
          </Link>
          <Link href="/profile" className={styles.navItem}>
            <User size={20} />
            Profile
          </Link>
        </nav>

        <div className={styles.bottomNav}>
          <Link href="/settings" className={styles.navItem}>
            <Settings size={20} />
            Settings
          </Link>
          <button className={styles.navItem}>
            <LogOut size={20} />
            Log out
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Health Plans</h1>
            <p className={styles.subtitle}>Manage your upcoming health appointments and check-ups</p>
          </div>
          <button className={styles.addButton}>
            <Plus size={20} />
            New Plan
          </button>
        </div>

        <div className={styles.content}>
          {plans.map((plan) => (
            <div key={plan.id} className={`${styles.planCard} ${styles[plan.status]}`}>
              <div className={styles.planHeader}>
                <h3 className={styles.planTitle}>{plan.title}</h3>
                <span className={styles.planStatus}>{plan.status}</span>
              </div>
              <div className={styles.planDetails}>
                <div className={styles.planInfo}>
                  <Calendar size={16} />
                  <span>{new Date(plan.date).toLocaleDateString()}</span>
                </div>
                <div className={styles.planInfo}>
                  <Clock size={16} />
                  <span>{plan.time}</span>
                </div>
              </div>
              <div className={styles.planType}>{plan.type}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}