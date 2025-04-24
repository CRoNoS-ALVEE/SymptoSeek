"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar as CalendarIcon, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import styles from "./book.module.css"

interface TimeSlot {
  time: string
  available: boolean
}

const timeSlots: TimeSlot[] = [
  { time: "09:00 AM", available: true },
  { time: "09:30 AM", available: true },
  { time: "10:00 AM", available: false },
  { time: "10:30 AM", available: true },
  { time: "11:00 AM", available: true },
  { time: "11:30 AM", available: false },
  { time: "02:00 PM", available: true },
  { time: "02:30 PM", available: true },
  { time: "03:00 PM", available: true },
  { time: "03:30 PM", available: false },
  { time: "04:00 PM", available: true },
  { time: "04:30 PM", available: true }
]

export default function BookAppointmentPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentType, setAppointmentType] = useState("consultation")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Here you would typically make an API call to book the appointment
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      router.push("/appointments")
    } catch (error) {
      console.error("Error booking appointment:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/doctors" className={styles.backButton}>
          <ArrowLeft size={20} />
          Back to Doctors
        </Link>
        <h1>Book Appointment</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.doctorInfo}>
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"
            alt="Doctor"
            className={styles.doctorImage}
          />
          <div>
            <h2>Dr. Sarah Johnson</h2>
            <p>Cardiologist</p>
            <p className={styles.hospital}>Heart Care Center</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.bookingForm}>
          <div className={styles.formSection}>
            <h3>
              <CalendarIcon size={20} />
              Select Date & Time
            </h3>
            <div className={styles.dateTimeSelection}>
              <div className={styles.formGroup}>
                <label htmlFor="date">Appointment Date</label>
                <input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className={styles.timeSlots}>
                <label>Available Time Slots</label>
                <div className={styles.timeSlotsGrid}>
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`${styles.timeSlot} ${!slot.available ? styles.unavailable : ""} ${
                        selectedTime === slot.time ? styles.selected : ""
                      }`}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                    >
                      <Clock size={16} />
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Appointment Details</h3>
            <div className={styles.formGroup}>
              <label htmlFor="type">Appointment Type</label>
              <select
                id="type"
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                required
              >
                <option value="consultation">Consultation</option>
                <option value="followup">Follow-up</option>
                <option value="checkup">General Check-up</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific concerns or information you'd like to share..."
                rows={4}
              />
            </div>
          </div>

          <div className={styles.summary}>
            <h3>Appointment Summary</h3>
            <div className={styles.summaryDetails}>
              <div className={styles.summaryItem}>
                <span>Date:</span>
                <span>{selectedDate || "Not selected"}</span>
              </div>
              <div className={styles.summaryItem}>
                <span>Time:</span>
                <span>{selectedTime || "Not selected"}</span>
              </div>
              <div className={styles.summaryItem}>
                <span>Type:</span>
                <span>{appointmentType.charAt(0).toUpperCase() + appointmentType.slice(1)}</span>
              </div>
            </div>
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading || !selectedDate || !selectedTime}>
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  )}