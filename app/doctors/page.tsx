"use client"

import { useState, useMemo } from "react"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"
import { MapPin, Clock, Star, Phone, Mail, Building, Search } from "lucide-react"
import styles from "./doctors.module.css"

interface Doctor {
  id: number
  name: string
  specialty: string
  location: string
  experience: string
  rating: number
  availability: string
  hospital: string
  image: string
  email: string
  phone: string
}

const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    location: "New York, NY",
    experience: "15 years",
    rating: 4.8,
    availability: "Mon-Fri",
    hospital: "Heart Care Center",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    email: "sarah.johnson@example.com",
    phone: "(555) 123-4567"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    location: "San Francisco, CA",
    experience: "12 years",
    rating: 4.9,
    availability: "Mon-Thu",
    hospital: "Brain & Spine Institute",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    email: "michael.chen@example.com",
    phone: "(555) 234-5678"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    location: "Miami, FL",
    experience: "10 years",
    rating: 4.7,
    availability: "Mon-Sat",
    hospital: "Children's Medical Center",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400",
    email: "emily.rodriguez@example.com",
    phone: "(555) 345-6789"
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Dermatologist",
    location: "Los Angeles, CA",
    experience: "8 years",
    rating: 4.6,
    availability: "Tue-Sat",
    hospital: "Skin Care Clinic",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
    email: "james.wilson@example.com",
    phone: "(555) 456-7890"
  },
  {
    id: 5,
    name: "Dr. Lisa Thompson",
    specialty: "Psychiatrist",
    location: "Chicago, IL",
    experience: "14 years",
    rating: 4.9,
    availability: "Mon-Fri",
    hospital: "Mental Wellness Center",
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400",
    email: "lisa.thompson@example.com",
    phone: "(555) 567-8901"
  },
  {
    id: 6,
    name: "Dr. David Kim",
    specialty: "Orthopedist",
    location: "Seattle, WA",
    experience: "11 years",
    rating: 4.7,
    availability: "Mon-Thu",
    hospital: "Joint & Bone Center",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
    email: "david.kim@example.com",
    phone: "(555) 678-9012"
  }
]

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedAvailability, setSelectedAvailability] = useState("")

  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))]
  const locations = [...new Set(doctors.map(doctor => doctor.location))]
  const availabilities = [...new Set(doctors.map(doctor => doctor.availability))]

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty
      const matchesLocation = !selectedLocation || doctor.location === selectedLocation
      const matchesAvailability = !selectedAvailability || doctor.availability === selectedAvailability

      return matchesSearch && matchesSpecialty && matchesLocation && matchesAvailability
    })
  }, [searchTerm, selectedSpecialty, selectedLocation, selectedAvailability])

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Find the Right Doctor</h1>
          <p>Connect with qualified healthcare professionals based on your needs</p>
        </div>

        <section className={styles.searchSection}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search by name, specialty, or hospital..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Specialty</label>
              <select
                className={styles.select}
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Location</label>
              <select
                className={styles.select}
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Availability</label>
              <select
                className={styles.select}
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
              >
                <option value="">Any Availability</option>
                {availabilities.map(availability => (
                  <option key={availability} value={availability}>{availability}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <div className={styles.doctorsGrid}>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <div key={doctor.id} className={styles.doctorCard}>
                <img src={doctor.image} alt={doctor.name} className={styles.doctorImage} />
                <div className={styles.doctorInfo}>
                  <h2 className={styles.doctorName}>{doctor.name}</h2>
                  <p className={styles.doctorSpecialty}>{doctor.specialty}</p>
                  <div className={styles.doctorDetails}>
                    <div className={styles.detailItem}>
                      <MapPin size={16} />
                      {doctor.location}
                    </div>
                    <div className={styles.detailItem}>
                      <Clock size={16} />
                      {doctor.experience} experience
                    </div>
                    <div className={styles.detailItem}>
                      <Building size={16} />
                      {doctor.hospital}
                    </div>
                    <div className={styles.detailItem}>
                      <Mail size={16} />
                      {doctor.email}
                    </div>
                    <div className={styles.detailItem}>
                      <Phone size={16} />
                      {doctor.phone}
                    </div>
                    <div className={styles.detailItem}>
                      <div className={styles.rating}>
                        <Star size={16} fill="currentColor" />
                        {doctor.rating}
                      </div>
                    </div>
                  </div>
                  <button className={styles.bookButton}>Book Appointment</button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              No doctors found matching your criteria
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}