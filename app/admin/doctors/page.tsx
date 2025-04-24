"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Stethoscope,
  BarChart3,
  Calendar,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  MapPin,
  Mail,
  Phone,
  Menu,
  FileText,
  Settings,
  Filter,
  LogOut,
  Clock,
  Building
} from "lucide-react"
import styles from "./doctors.module.css"

interface Doctor {
  id: string
  name: string
  specialty: string
  experience: string
  rating: number
  availability: string
  hospital: string
  location: string
  email: string
  phone: string
  status: string
  image: string
  education: string[]
  specializations: string[]
  languages: string[]
}

const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. John Smith',
    specialty: 'Cardiologist',
    experience: '15 years',
    rating: 4.8,
    availability: 'Mon-Fri',
    hospital: 'Heart Care Center',
    location: 'New York',
    email: 'john.smith@example.com',
    phone: '123-456-7890',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    education: ['MD from Harvard Medical School', 'Cardiology Fellowship at Mayo Clinic'],
    specializations: ['Interventional Cardiology', 'Heart Failure Management', 'Preventive Cardiology'],
    languages: ['English', 'Spanish']
  },
  {
    id: '2',
    name: 'Dr. Sarah Wilson',
    specialty: 'Pediatrician',
    experience: '12 years',
    rating: 4.9,
    availability: 'Mon-Thu',
    hospital: 'Children\'s Medical Center',
    location: 'Los Angeles',
    email: 'sarah.wilson@example.com',
    phone: '987-654-3210',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    education: ['MD from UCLA', 'Pediatrics Residency at Boston Children\'s Hospital'],
    specializations: ['General Pediatrics', 'Developmental Pediatrics', 'Adolescent Medicine'],
    languages: ['English', 'Spanish']
  },
  {
    id: '3',
    name: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    experience: '10 years',
    rating: 4.7,
    availability: 'Mon-Sat',
    hospital: 'Brain & Spine Institute',
    location: 'Chicago',
    email: 'michael.chen@example.com',
    phone: '555-123-4567',
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
    education: ['MD from Stanford University', 'Neurology Residency at Johns Hopkins'],
    specializations: ['General Neurology', 'Stroke Care', 'Headache Management'],
    languages: ['English', 'Mandarin']
  }
];

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));
  const statuses = Array.from(new Set(doctors.map(doctor => doctor.status)));

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty
    const matchesStatus = !selectedStatus || doctor.status === selectedStatus

    return matchesSearch && matchesSpecialty && matchesStatus
  })

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor)
    setIsEditModalOpen(true)
  }

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would make an API call here
    // to update the doctor's information
    setIsEditModalOpen(false)
    setEditingDoctor(null)
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    window.location.href = "/admin/auth"
  }

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
          <Link href="/admin/dashboard" className={styles.sidebarLink}>
            <BarChart3 size={20} />
            Overview
          </Link>
          <Link href="/admin/doctors" className={`${styles.sidebarLink} ${styles.active}`}>
            <Stethoscope size={20} />
            Doctors
          </Link>
          <Link href="/admin/appointments" className={styles.sidebarLink}>
            <Calendar size={20} />
            Appointments
          </Link>
          <Link href="/admin/reports" className={styles.sidebarLink}>
            <FileText size={20} />
            Reports
          </Link>
          <Link href="/admin/settings" className={styles.sidebarLink}>
            <Settings size={20} />
            Settings
          </Link>
        </nav>

        <button onClick={handleLogout} className={styles.logoutButton}>
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Manage Doctors</h1>
          <button className={styles.addButton}>
            <Plus size={20} />
            Add New Doctor
          </button>
        </div>

        <div className={styles.filters}>
          <div className={styles.searchBar}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <Filter size={20} />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.doctorsGrid}>
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className={styles.doctorCard}>
              <div className={styles.cardHeader}>
                <div className={styles.doctorProfile}>
                  <img src={doctor.image} alt={doctor.name} className={styles.doctorImage} />
                  <div className={styles.doctorInfo}>
                    <h3 className={styles.doctorName}>{doctor.name}</h3>
                    <p className={styles.doctorSpecialty}>{doctor.specialty}</p>
                  </div>
                </div>
                <div className={styles.headerActions}>
                  <button 
                    className={styles.actionButton}
                    onClick={() => handleEditDoctor(doctor)}
                  >
                    <Edit size={16} />
                  </button>
                  <button className={styles.actionButton}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className={styles.details}>
                <div className={styles.detail}>
                  <MapPin size={16} />
                  {doctor.location}
                </div>
                <div className={styles.detail}>
                  <Clock size={16} />
                  {doctor.experience} experience
                </div>
                <div className={styles.detail}>
                  <Building size={16} />
                  {doctor.hospital}
                </div>
                <div className={styles.detail}>
                  <Mail size={16} />
                  {doctor.email}
                </div>
                <div className={styles.detail}>
                  <Phone size={16} />
                  {doctor.phone}
                </div>
              </div>
              <div className={`${styles.status} ${styles[doctor.status]}`}>
                {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {isEditModalOpen && editingDoctor && (
        <div className={styles.modalOverlay} onClick={() => setIsEditModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Edit Doctor Profile</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setIsEditModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveDoctor}>
              <div className={styles.modalContent}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    defaultValue={editingDoctor.name}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="specialty">Specialty</label>
                  <input
                    id="specialty"
                    type="text"
                    defaultValue={editingDoctor.specialty}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="experience">Experience</label>
                  <input
                    id="experience"
                    type="text"
                    defaultValue={editingDoctor.experience}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="rating">Rating</label>
                  <input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    defaultValue={editingDoctor.rating}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="availability">Availability</label>
                  <input
                    id="availability"
                    type="text"
                    defaultValue={editingDoctor.availability}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="hospital">Hospital</label>
                  <input
                    id="hospital"
                    type="text"
                    defaultValue={editingDoctor.hospital}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    type="text"
                    defaultValue={editingDoctor.location}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    defaultValue={editingDoctor.email}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    defaultValue={editingDoctor.phone}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    defaultValue={editingDoctor.status}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="education">Education (one per line)</label>
                  <textarea
                    id="education"
                    className={styles.textarea}
                    defaultValue={editingDoctor.education.join('\n')}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="specializations">Specializations (one per line)</label>
                  <textarea
                    id="specializations"
                    className={styles.textarea}
                    defaultValue={editingDoctor.specializations.join('\n')}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="languages">Languages (one per line)</label>
                  <textarea
                    id="languages"
                    className={styles.textarea}
                    defaultValue={editingDoctor.languages.join('\n')}
                    required
                  />
                </div>
              </div>
              
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.saveButton}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}