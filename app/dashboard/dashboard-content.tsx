"use client"

import { useCallback } from "react"
import Particles from "react-tsparticles"
import { loadSlim } from "tsparticles-slim"
import Link from "next/link"
import type { Engine } from "tsparticles-engine"
import { Calendar, Clock, MessageSquare, Stethoscope, User, Plus } from "lucide-react"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"
import styles from "./dashboard.module.css"

export default function DashboardContent() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  const stats = [
    { value: "5", label: "Upcoming Appointments" },
    { value: "12", label: "Past Consultations" },
    { value: "3", label: "Active Plans", link: "/plans" },
    { value: "85%", label: "Health Score" },
  ]

  const recentActivity = [
    {
      icon: <Calendar size={20} />,
      title: "Appointment scheduled with Dr. Sarah Johnson",
      time: "2 hours ago",
    },
    {
      icon: <MessageSquare size={20} />,
      title: "Chat session with AI Health Assistant",
      time: "Yesterday",
    },
    {
      icon: <Stethoscope size={20} />,
      title: "Health check-up completed",
      time: "3 days ago",
    },
    {
      icon: <User size={20} />,
      title: "Profile information updated",
      time: "1 week ago",
    },
  ]

  return (
    <div className={styles.container}>
      <Navbar isLoggedIn={true} userImage="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" />
      <main className={styles.main}>
        <section className={styles.welcomeSection}>
          <Particles
            className={styles.particles}
            init={particlesInit}
            options={{
              fullScreen: { enable: false },
              background: {
                color: {
                  value: "transparent",
                },
              },
              fpsLimit: 120,
              interactivity: {
                events: {
                  onHover: {
                    enable: true,
                    mode: "repulse",
                  },
                  resize: true,
                },
                modes: {
                  repulse: {
                    distance: 100,
                    duration: 0.4,
                  },
                },
              },
              particles: {
                color: {
                  value: "#9333EA",
                },
                links: {
                  color: "#9333EA",
                  distance: 150,
                  enable: true,
                  opacity: 0.2,
                  width: 1,
                },
                move: {
                  direction: "none",
                  enable: true,
                  outModes: {
                    default: "bounce",
                  },
                  random: false,
                  speed: 2,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 50,
                },
                opacity: {
                  value: 0.2,
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 1, max: 3 },
                },
              },
              detectRetina: true,
            }}
          />
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>Welcome back, John!</h1>
            <p className={styles.welcomeText}>
              Track your health journey and manage your appointments all in one place
            </p>
          </div>
        </section>

        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Link 
              key={index} 
              href={stat.link || "#"} 
              className={styles.statCard}
              style={{ textDecoration: 'none' }}
            >
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
              {stat.link && (
                <div className={styles.statAction}>
                  <Plus size={16} />
                  View Plans
                </div>
              )}
            </Link>
          ))}
        </div>

        <section className={styles.recentActivity}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <div className={styles.activityList}>
            {recentActivity.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityIcon}>{activity.icon}</div>
                <div className={styles.activityContent}>
                  <Link href="/profile" className={styles.activityTitle}>{activity.title}</Link>
                  <div className={styles.activityTime}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}