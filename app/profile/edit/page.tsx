"use client"

import { useState, useCallback } from "react"
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
  Camera,
  Save,
  Stethoscope,
  ArrowLeft,
  Heart,
  CreditCard
} from "lucide-react"
import styles from "./edit.module.css"

type TabId = "personal" | "medical" | "security" | "subscription"

const tabs = [
  { id: "personal" as TabId, icon: <User size={20} />, label: "Edit Personal" },
  { id: "medical" as TabId, icon: <Heart size={20} />, label: "Medical Info" },
  { id: "security" as TabId, icon: <Settings size={20} />, label: "Security Settings" },
  { id: "subscription" as TabId, icon: <CreditCard size={20} />, label: "Subscription" },
]

export default function EditProfilePage() {
  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200")
  const [activeTab, setActiveTab] = useState<TabId>("personal")

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
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
          <button className={styles.navItem}>
            <LogOut size={20} />
            Log out
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.header}>
          <Link href="/profile" className={styles.backButton}>
            <ArrowLeft size={20} />
            Back to Profile
          </Link>
        </div>

        <div className={styles.tabs}>
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <form className={styles.editForm}>
          {activeTab === "personal" && (
            <>
              <div className={styles.imageSection}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={profileImage}
                    alt="Profile"
                    width={120}
                    height={120}
                    className={styles.profileImage}
                  />
                  <label className={styles.uploadButton}>
                    <Camera size={20} />
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={styles.fileInput}
                    />
                  </label>
                </div>
              </div>

              <div className={styles.formSection}>
                <h2>Personal Information</h2>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>First Name</label>
                    <input
                      type="text"
                      defaultValue="Samantha"
                      placeholder="Enter first name"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Last Name</label>
                    <input
                      type="text"
                      defaultValue="Harkness"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    defaultValue="sam85@gmail.com"
                    placeholder="Enter email address"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    defaultValue="+123 456 789 000"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className={styles.formSection}>
                <h2>Address Information</h2>

                <div className={styles.formGroup}>
                  <label>Address</label>
                  <input
                    type="text"
                    defaultValue="123 Main Street"
                    placeholder="Enter street address"
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      defaultValue="5678"
                      placeholder="Enter ZIP code"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>City</label>
                    <input
                      type="text"
                      defaultValue="San Francisco"
                      placeholder="Enter city"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>State</label>
                    <input
                      type="text"
                      defaultValue="California"
                      placeholder="Enter state"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Country</label>
                    <input
                      type="text"
                      defaultValue="United States of America"
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "medical" && (
            <div className={styles.formSection}>
              <h2>Medical Details</h2>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Blood Type</label>
                  <select defaultValue="A+">
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    defaultValue="165"
                    placeholder="Enter height"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    defaultValue="65"
                    placeholder="Enter weight"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Emergency Contact</label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 987-6543"
                    placeholder="Enter emergency contact"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Allergies</label>
                <textarea
                  rows={3}
                  defaultValue="Penicillin"
                  placeholder="List any allergies"
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Medical History</label>
                <textarea
                  rows={4}
                  defaultValue="No major medical conditions."
                  placeholder="Enter your medical history"
                  className={styles.textarea}
                />
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className={styles.formSection}>
              <h2>Security Settings</h2>
              <p className={styles.comingSoon}>Security settings coming soon...</p>
            </div>
          )}

          {activeTab === "subscription" && (
            <div className={styles.formSection}>
              <h2>Subscription Details</h2>
              <p className={styles.comingSoon}>Subscription management coming soon...</p>
            </div>
          )}

          <div className={styles.actions}>
            <Link href="/profile" className={`${styles.button} ${styles.secondaryButton}`}>
              Cancel
            </Link>
            <button type="submit" className={`${styles.button} ${styles.primaryButton}`}>
              <Save size={16} />
              Update
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}