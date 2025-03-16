"use client"

import Link from "next/link"
import Image from "next/image"
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Bell,
  Settings,
  LogOut,
  User,
  Clock,
  Stethoscope,
  Hash,
  Activity,
  Heart,
  Pill,
  LineChart,
  Moon,
  Footprints,
  Scale,
  Timer,
  Dumbbell,
  Edit,
} from "lucide-react"
import styles from "./profile.module.css"

export default function ProfilePage() {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
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
          <Link href="/plans" className={styles.navItem}>
            <Calendar size={20} />
            Plans
          </Link>
          <Link href="/reminders" className={styles.navItem}>
            <Bell size={20} />
            Reminders
          </Link>
          <Link href="/profile" className={`${styles.navItem} ${styles.active}`}>
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
          <div className={styles.profileImage}>
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
              alt="Profile"
              width={120}
              height={120}
            />
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.name}>Samantha Harkness</h1>
            <div className={styles.metadata}>
              <div className={styles.metaItem}>
                <User size={16} />
                Age: 28
              </div>
              <div className={styles.metaItem}>
                <Clock size={16} />
                Last analysis: Today
              </div>
              <div className={styles.metaItem}>
                <Hash size={16} />
                User ID: J8D2N0E5
              </div>
            </div>
          </div>
          <Link href="/profile/edit" className={styles.editButton}>
            <Edit size={16} />
            Edit Profile
          </Link>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Activity size={20} />
              Analysis history
            </h2>
            <div className={styles.historyItem}>
              <div className={styles.historyIcon}>
                <Heart size={20} />
              </div>
              <div className={styles.historyContent}>
                <div className={styles.historyTitle}>Recommendation test</div>
                <div className={styles.historyMeta}>Dr. Lisa Smith</div>
                <Link href="/dashboard" className={styles.viewMore}>View in Dashboard</Link>
              </div>
            </div>
            <div className={styles.historyItem}>
              <div className={styles.historyIcon}>
                <Activity size={20} />
              </div>
              <div className={styles.historyContent}>
                <div className={styles.historyTitle}>X-ray scan</div>
                <div className={styles.historyMeta}>Dr. Michael Johnson</div>
                <Link href="/dashboard" className={styles.viewMore}>View in Dashboard</Link>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Heart size={20} />
              Health status
            </h2>
            <div className={styles.healthStatus}>
              <div className={styles.statusItem}>
                <div className={styles.statusIcon}>
                  <Activity size={16} />
                </div>
                Vitamin deficiency
              </div>
              <div className={styles.statusItem}>
                <div className={styles.statusIcon}>
                  <Heart size={16} />
                </div>
                Blood pressure normal
              </div>
              <div className={styles.statusItem}>
                <div className={styles.statusIcon}>
                  <LineChart size={16} />
                </div>
                Sugar levels stable
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Pill size={20} />
              Medication history
            </h2>
            <div className={styles.historyItem}>
              <div className={styles.historyIcon}>
                <Pill size={20} />
              </div>
              <div className={styles.historyContent}>
                <div className={styles.historyTitle}>Ibuprofen 200mg</div>
                <div className={styles.historyMeta}>Prescribed weekly</div>
              </div>
            </div>
            <div className={styles.historyItem}>
              <div className={styles.historyIcon}>
                <Pill size={20} />
              </div>
              <div className={styles.historyContent}>
                <div className={styles.historyTitle}>Omeprazole</div>
                <div className={styles.historyMeta}>As needed</div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Activity size={20} />
              Daily Statistics
            </h2>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <Moon size={20} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Sleep</div>
                  <div className={styles.statValue}>avg. 8h 15 min</div>
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <Footprints size={20} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Activity</div>
                  <div className={styles.statValue}>10,502 steps</div>
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <Scale size={20} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Body mass</div>
                  <div className={styles.statValue}>70 kg</div>
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <Timer size={20} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Calories</div>
                  <div className={styles.statValue}>2,300 kcal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}