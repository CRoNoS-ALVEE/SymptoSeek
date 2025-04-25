"use client"

import { useState, useEffect } from "react"
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
  const [profileImage, setProfileImage] = useState("/default-profile.png")
  const [activeTab, setActiveTab] = useState<TabId>("personal")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    zipCode: "",
    city: "",
    state: "",
    country: "",
    bio: "",
    gender: "",
    age: "",
    profilePic: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch initial user data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No authentication token found")
        }

        const response = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch profile data")
        }

        const data = await response.json()
        const [firstName, lastName] = data.name?.split(" ") || ["", ""]
        setFormData({
          firstName,
          lastName,
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          zipCode: data.zip_code || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          bio: data.bio || "",
          gender: data.gender || "",
          age: data.age || "",
          profilePic: data.profile_pic || "",
        })
        setProfileImage(data.profile_pic || "/default-profile.png")
      } catch (error) {
        console.error("Error fetching profile data:", error)
        setError("Failed to load profile data")
      }
    }

    fetchProfileData()
  }, [])

  // Handle Image Upload to Cloudinary
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "symptoseek_profile")

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dslepn2og"}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (!res.ok) {
        throw new Error("Image upload failed")
      }

      const data = await res.json()
      if (data.secure_url) {
        setProfileImage(data.secure_url)
        setFormData(prev => ({ ...prev, profilePic: data.secure_url }))
      }
    } catch (error) {
      console.error("Image upload failed:", error)
      setError("Failed to upload image")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const data = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        bio: formData.bio,
        gender: formData.gender,
        age: formData.age,
        phone: formData.phone,
        address: formData.address,
        zip_code: formData.zipCode,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        profile_pic: formData.profilePic,
      }

      const response = await fetch("http://localhost:5000/api/auth/profile/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update profile")
      }

      const updatedUser = await response.json()
      console.log("Profile updated successfully:", updatedUser)
      alert("Profile updated successfully!")
    } catch (error: any) {
      console.error("Error updating profile:", error)
      setError(error.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
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
          <button className={styles.navItem} onClick={handleLogout}>
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

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              disabled={isLoading}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <form className={styles.editForm} onSubmit={handleSubmit}>
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
                    priority
                  />
                  <label className={styles.uploadButton} htmlFor="profile-upload">
                    <Camera size={20} />
                    {isLoading ? "Uploading..." : "Change Photo"}
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={styles.fileInput}
                      disabled={isLoading}
                    />
                  </label>
                </div>
              </div>

              <div className={styles.formSection}>
                <h2>Personal Information</h2>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    disabled
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    disabled={isLoading}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Enter your bio"
                    className={styles.textarea}
                    disabled={isLoading}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      disabled={isLoading}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="age">Age</label>
                    <input
                      id="age"
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter age"
                      disabled={isLoading}
                      min="1"
                      max="120"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h2>Address Information</h2>

                <div className={styles.formGroup}>
                  <label htmlFor="address">Address</label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter street address"
                    disabled={isLoading}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="zipCode">ZIP Code</label>
                    <input
                      id="zipCode"
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="Enter ZIP code"
                      disabled={isLoading}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="state">State</label>
                    <input
                      id="state"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter state"
                      disabled={isLoading}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="country">Country</label>
                    <input
                      id="country"
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Enter country"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "medical" && (
            <div className={styles.formSection}>
              <h2>Medical Details</h2>
              <p className={styles.comingSoon}>Medical information coming soon...</p>
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
            <Link href="/profile" className={`${styles.button} ${styles.secondaryButton}`} passHref>
              Cancel
            </Link>
            <button 
              type="submit" 
              className={`${styles.button} ${styles.primaryButton}`}
              disabled={isLoading}
            >
              {isLoading ? (
                "Updating..."
              ) : (
                <>
                  <Save size={16} />
                  Update
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}