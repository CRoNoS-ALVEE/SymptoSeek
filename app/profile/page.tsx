"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
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

interface UserProfile {
  name: string
  email: string
  profile_pic: string
  age: number
  bio: string
  gender: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  zip_code: string
  blood_group: string
  weight: string
  height: string
  medical_conditions: string
  medications: string
  last_analysis: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError("")
        
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const getBaseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        const response = await fetch(`${getBaseUrl()}/api/auth/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          credentials: "include"
        })

        if (response.status === 401) {
          localStorage.removeItem("token")
          router.push("/login")
          return
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch profile (${response.status})`)
        }

        const data = await response.json()
        setProfile(data)
      } catch (err) {
        console.error("Fetch error:", err)
        setError(err instanceof Error ? err.message : "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3>Error Loading Profile</h3>
          <p>{error}</p>
          <div className={styles.errorActions}>
            <button 
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Try Again
            </button>
            <button 
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              Log In Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className={styles.container}>
        <div className={styles.noProfileContainer}>
          <h3>No Profile Data Found</h3>
          <p>We couldn't find any profile information.</p>
          <Link href="/profile/edit" className={styles.editButton}>
            <Edit size={16} />
            Create Profile
          </Link>
        </div>
      </div>
    )
  }

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
          <button 
            className={`${styles.navItem} ${styles.logoutButton}`} 
            onClick={handleLogout}
          >
            <LogOut size={20} />
            Log out
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.profileImage}>
            <Image
              src={profile.profile_pic || "/default-profile.png"}
              alt="Profile"
              width={120}
              height={120}
              priority
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default-profile.png"
              }}
            />
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.name}>{profile.name || "No name provided"}</h1>
            <div className={styles.metadata}>
              <div className={styles.metaItem}>
                <User size={16} />
                Age: {profile.age || 'Not specified'}
              </div>
              <div className={styles.metaItem}>
                <Clock size={16} />
                Last analysis: {profile.last_analysis || 'No records'}
              </div>
              <div className={styles.metaItem}>
                <Hash size={16} />
                Email: {profile.email || 'No email'}
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
              Personal Information
            </h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <strong>Gender:</strong> {profile.gender || 'Not specified'}
              </div>
              <div className={styles.infoItem}>
                <strong>Phone:</strong> {profile.phone || 'Not specified'}
              </div>
              <div className={styles.infoItem}>
                <strong>Address:</strong> {profile.address || 'Not specified'}
              </div>
              <div className={styles.infoItem}>
                <strong>City:</strong> {profile.city || 'Not specified'}
              </div>
              <div className={styles.infoItem}>
                <strong>State:</strong> {profile.state || 'Not specified'}
              </div>
              <div className={styles.infoItem}>
                <strong>Country:</strong> {profile.country || 'Not specified'}
              </div>
              <div className={styles.infoItem}>
                <strong>ZIP Code:</strong> {profile.zip_code || 'Not specified'}
              </div>
              <div className={styles.infoItem}>
                <strong>Bio:</strong> {profile.bio || 'No bio provided'}
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Heart size={20} />
              Medical Information
            </h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <strong>Blood Group:</strong> {profile.blood_group || 'Not specified'}
              </div>
              <div className={styles.infoItem}>
                <strong>Height:</strong> {profile.height || 'Not specified'}
              </div>
              <div className={styles.infoItem}>
                <strong>Weight:</strong> {profile.weight || 'Not specified'}
              </div>
              <div className={styles.infoItem}>
                <strong>Conditions:</strong> {profile.medical_conditions || 'None reported'}
              </div>
              <div className={styles.infoItem}>
                <strong>Medications:</strong> {profile.medications || 'None reported'}
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Pill size={20} />
              Recent Activity
            </h2>
            <div className={styles.historyItem}>
              <div className={styles.historyIcon}>
                <Activity size={20} />
              </div>
              <div className={styles.historyContent}>
                <div className={styles.historyTitle}>Last checkup</div>
                <div className={styles.historyMeta}>{profile.last_analysis || 'No records'}</div>
              </div>
            </div>
            <div className={styles.historyItem}>
              <div className={styles.historyIcon}>
                <Heart size={20} />
              </div>
              <div className={styles.historyContent}>
                <div className={styles.historyTitle}>Medication reminder</div>
                <div className={styles.historyMeta}>Due in 2 hours</div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Activity size={20} />
              Quick Stats
            </h2>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <Moon size={20} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Sleep</div>
                  <div className={styles.statValue}>avg. 7h 45 min</div>
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <Footprints size={20} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Activity</div>
                  <div className={styles.statValue}>8,500 steps</div>
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <Scale size={20} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>BMI</div>
                  <div className={styles.statValue}>24.2</div>
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <Heart size={20} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Heart Rate</div>
                  <div className={styles.statValue}>72 bpm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}