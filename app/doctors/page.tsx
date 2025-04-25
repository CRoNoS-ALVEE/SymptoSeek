"use client"

import { useState, useEffect, useMemo } from "react"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"
import { MapPin, Clock, Star, Phone, Mail, Building, Search } from "lucide-react"
import styles from "./doctors.module.css"
import { spec } from "node:test/reporters"

interface Doctor {
  _id: string
  image_source: string
  name: string
  speciality: string
  address: string
  number: string
  visiting_hours: string
  degree: string
  hospital_name: string
  about: string
  // Added fields for frontend display
  location?: string
  experience?: string
  rating?: number
  availability?: string
  email?: string
  phone?: string
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedAvailability, setSelectedAvailability] = useState("")
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [doctorsPerPage] = useState(6) // Matches grid layout
  const [totalDoctors, setTotalDoctors] = useState(0)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `http://localhost:5000/api/doctors?page=${currentPage}&limit=${doctorsPerPage}`
        )
        if (!response.ok) throw new Error('Failed to fetch doctors')
        
        const data = await response.json()
        // Map backend data to frontend structure
        const formattedDoctors = data.doctors.map((doctor: Doctor) => ({
          ...doctor,
          location: doctor.address,
          phone: doctor.number,
          degree: doctor.degree,
          speciality: doctor.speciality,
          visiting_hours: doctor.visiting_hours,
          hospital_name: doctor.hospital_name,
        }))
        
        setDoctors(formattedDoctors)
        setTotalPages(data.pagination.totalPages)
        setTotalDoctors(data.pagination.totalDoctors)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [currentPage, doctorsPerPage])

  const specialties = [...new Set(doctors.map(doctor => doctor.speciality))]
  const hospital_name = [...new Set(doctors.map(doctor => doctor.hospital_name))]
  const visiting_hours = [...new Set(doctors.map(doctor => doctor.visiting_hours))]

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.hospital_name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesSpecialty = !selectedSpecialty || doctor.speciality === selectedSpecialty
      const matchesLocation = !selectedLocation || doctor.hospital_name === selectedLocation
      const matchesAvailability = !selectedAvailability || doctor.visiting_hours === selectedAvailability

      return matchesSearch && matchesSpecialty && matchesLocation && matchesAvailability
    })
  }, [doctors, searchTerm, selectedSpecialty, selectedLocation, selectedAvailability])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.loading}>Loading doctors...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.error}>Error: {error}</div>
        </main>
        <Footer />
      </div>
    )
  }

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
                {hospital_name.map(hospital_name => (
                  <option key={hospital_name} value={hospital_name}>{hospital_name}</option>
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
                {visiting_hours.map((visiting_hour, index) => (
                  <option key={`${visiting_hour}-${index}`} value={visiting_hour}>{visiting_hour}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <div className={styles.doctorsGrid}>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <div key={doctor._id} className={styles.doctorCard}>
                <img 
                  src={doctor.image_source || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"} 
                  alt={doctor.name} 
                  className={styles.doctorImage} 
                />
                <div className={styles.doctorInfo}>
                  <h2 className={styles.doctorName}>{doctor.name}</h2>
                  <p className={styles.doctorSpecialty}>{doctor.speciality}</p>
                  <div className={styles.doctorDetails}>
                    <div className={styles.detailItem}>
                      <MapPin size={16} />
                      {doctor.location}
                    </div>
                    <div className={styles.detailItem}>
                      <Clock size={16} />
                      {doctor.visiting_hours}
                    </div>
                    <div className={styles.detailItem}>
                      <Building size={16} />
                      {doctor.hospital_name}
                    </div>
                    {/* <div className={styles.detailItem}>
                      <Mail size={16} />
                      {doctor.email}
                    </div> */}
                    <div className={styles.detailItem}>
                      <Phone size={16} />
                      {doctor.phone}
                    </div>
                    {/* <div className={styles.detailItem}>
                      <div className={styles.rating}>
                        <Star size={16} fill="currentColor" />
                        {doctor.rating}
                      </div>
                    </div> */}
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

        {totalPages > 1 && (
          <div className={styles.paginationContainer}>
            <div className={styles.pagination}>
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`${styles.paginationButton} ${
                      currentPage === pageNum ? styles.activePage : ''
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
            <div className={styles.paginationInfo}>
              Showing {(currentPage - 1) * doctorsPerPage + 1}-
              {Math.min(currentPage * doctorsPerPage, totalDoctors)} of {totalDoctors} doctors
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}