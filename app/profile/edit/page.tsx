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
  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200")
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

  // Fetch initial user data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch profile data")
        }

        const data = await response.json()
        const [firstName, lastName] = data.name.split(" ") // Split name into first and last name
        setFormData({
          firstName,
          lastName,
          email: data.email, // Set email from backend
          phone: data.phone,
          address: data.address,
          zipCode: data.zip_code,
          city: data.city,
          state: data.state,
          country: data.country,
          bio: data.bio,
          gender: data.gender,
          age: data.age,
          profilePic: data.profile_pic,
        })
        setProfileImage(data.profile_pic)
      } catch (error) {
        console.error("Error fetching profile data:", error)
      }
    }

    fetchProfileData()
  }, [])

// Handle Image Upload to Cloudinary
const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "your_upload_preset"); // Change this to your Cloudinary preset

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/dslepn2og/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.secure_url) {
      setProfileImage(data.secure_url);
      setFormData((prev) => ({ ...prev, profilePic: data.secure_url }));
    }
  } catch (error) {
    console.error("Image upload failed:", error);
  }
};


  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const data = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email, // Email is not editable, so it remains the same
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedUser = await response.json()
      console.log("Profile updated successfully:", updatedUser)
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile")
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
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    disabled // Disable the email field
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Enter your bio"
                    className={styles.textarea}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter age"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h2>Address Information</h2>

                <div className={styles.formGroup}>
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter street address"
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="Enter ZIP code"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter state"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
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