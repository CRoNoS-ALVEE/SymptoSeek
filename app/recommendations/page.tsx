"use client"

import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"
import styles from "./recommendations.module.css"
import { Activity, Brain, Heart } from "lucide-react"

export default function RecommendationsPage() {
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Your Health Recommendations</h1>
          <p>Personalized insights based on your health profile and interactions</p>
        </div>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <Heart />
            </div>
            <h2>Lifestyle Recommendations</h2>
            <ul>
              <li>Maintain regular exercise routine</li>
              <li>Practice stress management techniques</li>
              <li>Ensure adequate sleep (7-9 hours)</li>
              <li>Stay hydrated throughout the day</li>
            </ul>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <Brain />
            </div>
            <h2>Mental Wellness Tips</h2>
            <ul>
              <li>Practice daily mindfulness</li>
              <li>Take regular breaks during work</li>
              <li>Maintain social connections</li>
              <li>Develop healthy coping mechanisms</li>
            </ul>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <Activity />
            </div>
            <h2>Health Monitoring</h2>
            <ul>
              <li>Track daily physical activity</li>
              <li>Monitor sleep patterns</li>
              <li>Record any recurring symptoms</li>
              <li>Keep a wellness journal</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}