"use client"

import Link from "next/link"
import { useState } from "react"
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Bell,
  Settings,
  LogOut,
  User,
  Stethoscope,
  Plus,
  Clock,
  Pill,
  Activity,
  Menu
} from "lucide-react"
import styles from "./reminders.module.css"

interface Reminder {
  id: number
  title: string
  time: string
  type: "medication" | "appointment" | "exercise"
  description: string
  completed: boolean
}

const reminders: Reminder[] = [
  {
    id: 1,
    title: "Take Blood Pressure Medicine",
    time: "08:00 AM",
    type: "medication",
    description: "2 tablets with water",
    completed: false
  },
  {
    id: 2,
    title: "Doctor's Appointment",
    time: "02:30 PM",
    type: "appointment",
    description: "Annual check-up with Dr. Johnson",
    completed: false
  },
  {
    id: 3,
    title: "Evening Walk",
    time: "06:00 PM",
    type: "exercise",
    description: "30 minutes moderate pace",
    completed: false
  },
  {
    id: 4,
    title: "Take Vitamins",
    time: "09:00 PM",
    type: "medication",
    description: "Vitamin D and C supplements",
    completed: false
  }
]

export default function RemindersPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeReminders, setActiveReminders] = useState(reminders)

  const toggleComplete = (id: number) => {
    setActiveReminders(prev =>
      prev.map(reminder =>
        reminder.id === id
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    )
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "medication":
        return <Pill size={20} />
      case "appointment":
        return <Calendar size={20} />
      case "exercise":
        return <Activity size={20} />
      default:
        return <Bell size={20} />
    }
  }

  return (
    <div className={styles.container}>
      <button className={styles.menuButton} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <Menu size={24} />
      </button>

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <Link href="/" className={styles.mainLogo}>
          <div className={styles.logoIcon}>
            <Stethoscope size={24} />
          </div>
          <span>SymptoSeek</span>
        </Link>

        <nav className={styles.navigation}>
          <Link href="/dashboard" className={styles.navItem}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/reports" className={styles.navItem}>
            <FileText size={20} />
            Reports
          </Link>
          <Link href="/plans" className={styles.navItem}>
            <Calendar size={20} />
            Plans
          </Link>
          <Link href="/reminders" className={`${styles.navItem} ${styles.active}`}>
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
          <h1>Reminders</h1>
          <button className={styles.addButton}>
            <Plus size={20} />
            Add Reminder
          </button>
        </div>

        <div className={styles.reminders}>
          {activeReminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`${styles.reminderCard} ${reminder.completed ? styles.completed : ''}`}
            >
              <div className={styles.reminderHeader}>
                <div className={styles.reminderIcon}>
                  {getIcon(reminder.type)}
                </div>
                <div className={styles.reminderTime}>
                  <Clock size={16} />
                  {reminder.time}
                </div>
              </div>

              <div className={styles.reminderContent}>
                <h3>{reminder.title}</h3>
                <p>{reminder.description}</p>
              </div>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={reminder.completed}
                  onChange={() => toggleComplete(reminder.id)}
                />
                <span className={styles.checkmark}></span>
                Mark as completed
              </label>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}