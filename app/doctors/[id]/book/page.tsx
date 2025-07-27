"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Calendar as CalendarIcon, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import styles from "./book.module.css"

interface Doctor {
  _id: string
  name: string
  speciality: string
  hospital_name: string
  image_source: string
  visiting_hours: string
  degree: string
  address: string
  number: string
  About: string
  latitude: string
  longitude: string
}

interface TimeSlot {
  time: string
  available: boolean
}

interface User {
  _id: string
  name: string
  email: string
  bio: string
  gender: string
  age: number | null
  phone: string
  address: string
  zip_code: string
  country: string
  state: string
  city: string
  profile_pic: string
  role: string
  status: string
  blood_group: string
  weight: string
  height: string
  allergies: string
  medical_conditions: string
  medications: string
  surgeries: string
  family_medical_history: string
  emergency_contact: string
  date: string
  __v: number
}

export default function BookAppointmentPage() {
  const router = useRouter()
  const params = useParams()
  const doctorId = params.id as string
  console.log(doctorId)

  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentType, setAppointmentType] = useState("consultation")
  const [notes, setNotes] = useState("")
  const [submitLoading, setSubmitLoading] = useState(false)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [bookingDetails, setBookingDetails] = useState<any>(null)

  // Fetch user data and check authentication
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setLoggedIn(false)
        setLoading(false)
        router.push("/auth")
        return
      }
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(response.data)
        setLoggedIn(true)
      } catch (err) {
        console.error("Failed to fetch user data:", err)
        setError("Failed to fetch user data.")
        setLoggedIn(false)
        router.push("/auth")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return
      try {
        const response = await axios.get<Doctor>(`http://localhost:5000/api/doctors/${doctorId}`)
        setDoctor(response.data)
        // Generate time slots from visiting_hours
        const slots = generateTimeSlots(response.data.visiting_hours)
        setTimeSlots(slots)
      } catch (err) {
        console.error("Failed to fetch doctor data:", err)
        setError("Failed to fetch doctor data.")
      }
    }

    fetchDoctor()
  }, [doctorId])

  // Function to parse visiting_hours and generate time slots
  const generateTimeSlots = (visitingHours: string): TimeSlot[] => {
    console.log('Generating time slots for visiting hours:', visitingHours)

    // Try multiple regex patterns to handle different formats
    let match = visitingHours.match(/(\d+)(?::\d+)?\s*(am|pm)\s*to\s*(\d+)(?::\d+)?\s*(am|pm)\s*\(([^)]+)\)/i)

    // If first pattern doesn't match, try without parentheses (for "Everyday" cases)
    if (!match) {
      match = visitingHours.match(/(\d+)(?::\d+)?\s*(am|pm)\s*to\s*(\d+)(?::\d+)?\s*(am|pm)/i)
      console.log('Trying pattern without parentheses:', match)
    }

    // If still no match, try with different separators
    if (!match) {
      match = visitingHours.match(/(\d+)(?::\d+)?\s*(am|pm)\s*[-–—]\s*(\d+)(?::\d+)?\s*(am|pm)/i)
      console.log('Trying pattern with dash separator:', match)
    }

    if (!match) {
      console.log('No matching pattern found for visiting hours:', visitingHours)
      // Return default slots if we can't parse the format
      return [
        { time: "9:00 AM", available: true },
        { time: "9:30 AM", available: true },
        { time: "10:00 AM", available: true },
        { time: "10:30 AM", available: true },
        { time: "11:00 AM", available: true },
        { time: "11:30 AM", available: true },
        { time: "2:00 PM", available: true },
        { time: "2:30 PM", available: true },
        { time: "3:00 PM", available: true },
        { time: "3:30 PM", available: true },
        { time: "4:00 PM", available: true },
        { time: "4:30 PM", available: true }
      ]
    }

    const [, startHour, startPeriod, endHour, endPeriod] = match
    let start = parseInt(startHour)
    let end = parseInt(endHour)
    
    console.log('Parsed time:', { startHour, startPeriod, endHour, endPeriod })

    // Convert to 24-hour format for calculation
    if (startPeriod.toLowerCase() === "pm" && start !== 12) start += 12
    if (startPeriod.toLowerCase() === "am" && start === 12) start = 0
    if (endPeriod.toLowerCase() === "pm" && end !== 12) end += 12
    if (endPeriod.toLowerCase() === "am" && end === 12) end = 0

    console.log('Converted to 24-hour:', { start, end })

    const slots: TimeSlot[] = []
    for (let hour = start; hour < end; hour++) {
      // Convert back to 12-hour format for display
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      const period = hour < 12 ? "AM" : "PM"
      const time = `${displayHour}:00 ${period}`
      slots.push({ time, available: true })
      
      // Add 30-minute slot if not at the end
      if (hour + 0.5 < end) {
        const halfTime = `${displayHour}:30 ${period}`
        slots.push({ time: halfTime, available: true })
      }
    }

    console.log('Generated time slots:', slots)
    return slots
  }

  // Validate selected date against visiting days
  const isValidDate = (date: string): boolean => {
    if (!doctor || !date) return false
    
    // Check if date is in the future or today
    const selectedDateObj = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    selectedDateObj.setHours(0, 0, 0, 0)

    if (selectedDateObj < today) return false
    
    // Try to extract days from visiting hours
    const match = doctor.visiting_hours.match(/\(([^)]+)\)/)
    if (!match) {
      console.log('No specific days found in visiting hours, allowing all days')
      return true // If no days specified, assume all days are valid
    }

    const daysString = match[1].toLowerCase().trim()

    // Handle "Everyday" case
    if (daysString === 'everyday' || daysString === 'every day' || daysString === 'daily') {
      console.log('Doctor available everyday, allowing all dates')
      return true
    }

    const selectedDay = selectedDateObj.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase()

    console.log('Date validation debug:', {
      selectedDate: date,
      selectedDay: selectedDay,
      daysString: daysString,
      visitingHours: doctor.visiting_hours
    })

    // Improved day matching logic - handle common abbreviations and full names
    const dayMappings: { [key: string]: string[] } = {
      'sun': ['sun', 'sunday', 'sn'],
      'mon': ['mon', 'monday', 'mn'],
      'tue': ['tue', 'tuesday', 'tu', 'tues'],
      'wed': ['wed', 'wednesday', 'wd'],
      'thu': ['thu', 'thursday', 'th', 'thurs'],
      'fri': ['fri', 'friday', 'fr'],
      'sat': ['sat', 'saturday', 'st']
    }
    
    const validDays = dayMappings[selectedDay] || [selectedDay]

    // Check if any of the valid day formats match what's in the visiting hours
    const isValidDay = validDays.some(day => {
      // Check for exact match or word boundary match to avoid partial matches
      const regex = new RegExp(`\\b${day}\\b`, 'i')
      return regex.test(daysString) || daysString.includes(day)
    })

    console.log('Day validation result:', {
      validDays,
      isValidDay,
      selectedDay,
      daysString
    })

    return isValidDay
  }

  // Generate list of valid dates for the next 30 days
  const getValidDates = (): string[] => {
    if (!doctor) return []

    const validDates: string[] = []
    const today = new Date()

    // Check next 30 days
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() + i)
      const dateString = checkDate.toISOString().split('T')[0]

      if (isValidDate(dateString)) {
        validDates.push(dateString)
      }
    }

    return validDates
  }

  // Get the next valid date
  const getNextValidDate = (): string => {
    const validDates = getValidDates()
    return validDates.length > 0 ? validDates[0] : ''
  }

  // Extract visiting days for display
  const getVisitingDays = (): string => {
    if (!doctor) return 'Not available'

    const match = doctor.visiting_hours.match(/\(([^)]+)\)/)
    return match ? match[1] : 'All days'
  }

  // Effect to auto-select first valid date if current selection is invalid
  useEffect(() => {
    if (doctor && (!selectedDate || !isValidDate(selectedDate))) {
      const nextValid = getNextValidDate()
      if (nextValid) {
        setSelectedDate(nextValid)
      }
    }
  }, [doctor])

  // Convert time format from "11:00 AM" to "11:00" (24-hour format)
  const convertTo24HourFormat = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ')
    let [hours, minutes] = time.split(':')
    if (hours === '12') {
      hours = modifier === 'AM' ? '00' : '12'
    } else {
      hours = modifier === 'AM' ? hours : String(parseInt(hours, 10) + 12)
    }
    return `${hours.padStart(2, '0')}:${minutes}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation checks
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time for your appointment.")
      return
    }

    if (!isValidDate(selectedDate)) {
      alert("Selected date is not within the doctor's visiting days. Please choose a valid date.")
      return
    }

    setSubmitLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("Please log in to book an appointment.")
        router.push("/auth")
        return
      }

      // Convert time format from "11:00 AM" to "11:00" (24-hour format)
      const timeIn24Format = convertTo24HourFormat(selectedTime)
      const appointmentDateTime = new Date(`${selectedDate}T${timeIn24Format}:00`)
      
      // Prepare appointment data for backend
      const appointmentData = {
        doctors_id: doctor?._id,
        date: appointmentDateTime.toISOString(),
        reason: notes || `${appointmentType.charAt(0).toUpperCase() + appointmentType.slice(1)} appointment with Dr. ${doctor?.name}`,
        appointmentType: appointmentType
      }

      console.log("Submitting appointment data:", appointmentData)

      const response = await axios.post(
        "http://localhost:5000/api/appointments",
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      console.log("Appointment booked successfully:", response.data)

      // Store booking details and show success modal
      setBookingDetails({
        doctor: doctor?.name,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType.charAt(0).toUpperCase() + appointmentType.slice(1)
      })
      setShowSuccessModal(true)

    } catch (error: any) {
      console.error("Error booking appointment:", error)

      // Enhanced error handling
      if (error.response?.status === 401) {
        alert("Your session has expired. Please log in again to book an appointment.")
        router.push("/auth")
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || "Invalid appointment details"
        alert(`❌ Booking Failed: ${errorMessage}
        
Please check:
• Selected date and time are valid
• Doctor is available at this time
• All required fields are filled`)
      } else if (error.response?.status === 404) {
        alert("❌ Doctor not found. Please try selecting a different doctor.")
      } else if (error.response?.status === 500) {
        alert("❌ Server error occurred. Please try again later or contact support.")
      } else {
        const errorMessage = error.response?.data?.message || "Failed to book appointment"
        alert(`❌ Booking Failed: ${errorMessage}
        
Please try again. If the problem persists, contact our support team.`)
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleModalClose = () => {
    setShowSuccessModal(false)
    setBookingDetails(null)
    // Redirect to appointments page
    router.push("/appointments")
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!doctor) {
    return <div>Error loading doctor data.</div>
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
            src={doctor.image_source}
            alt={doctor.name}
            className={styles.doctorImage}
          />
          <div>
            <h2>{doctor.name}</h2>
            <p>{doctor.speciality}</p>
            <p className={styles.hospital}>{doctor.hospital_name}</p>
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
                {/* Show doctor's available days */}
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  marginTop: '5px',
                  padding: '8px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  border: '1px solid #e9ecef'
                }}>
                  📅 <strong>Doctor available on:</strong> {getVisitingDays()}<br/>
                  🕒 <strong>Hours:</strong> {doctor.visiting_hours.split('(')[0].trim()}
                  {getValidDates().length > 0 && (
                    <>
                      <br/>✅ <strong>Next available dates:</strong> {getValidDates().slice(0, 3).map(date =>
                        new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                      ).join(', ')}
                      {getValidDates().length > 3 && '...'}
                    </>
                  )}
                </div>

                {/* Show warning if selected date is invalid */}
                {selectedDate && !isValidDate(selectedDate) && (
                  <div style={{
                    color: '#dc3545',
                    fontSize: '12px',
                    marginTop: '5px',
                    padding: '8px',
                    backgroundColor: '#f8d7da',
                    borderRadius: '4px',
                    border: '1px solid #f5c6cb'
                  }}>
                    ⚠️ This date is not available. Doctor is only available on: {getVisitingDays()}
                  </div>
                )}
              </div>

              <div className={styles.timeSlots}>
                <label>Available Time Slots</label>
                <div className={styles.timeSlotsGrid}>
                  {timeSlots.length > 0 ? (
                    timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`${styles.timeSlot} ${!slot.available ? styles.unavailable : ""} ${
                          selectedTime === slot.time ? styles.selected : ""
                        }`}
                        onClick={() => {
                          if (slot.available) {
                            console.log('Time slot selected:', slot.time)
                            setSelectedTime(slot.time)
                          }
                        }}
                        disabled={!slot.available}
                      >
                        <Clock size={16} />
                        {slot.time}
                      </button>
                    ))
                  ) : (
                    <p>No available time slots.</p>
                  )}
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
                  <span>Doctor:</span>
                  <span>{doctor.name}</span>
                </div>
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

            <button
              type="submit"
              className={styles.submitButton}
              disabled={submitLoading || !selectedDate || !selectedTime}
              style={{
                display: 'block',
                margin: '2rem 0',
                width: '100%',
                minHeight: '50px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              {submitLoading ? "Booking..." : "Confirm Booking"}
            </button>
            
            {/* Show validation messages */}
            {!selectedDate && (
              <div style={{ color: '#ef4444', fontSize: '14px', marginBottom: '10px' }}>
                ⚠️ Please select an appointment date
              </div>
            )}
            {!selectedTime && selectedDate && (
              <div style={{ color: '#ef4444', fontSize: '14px', marginBottom: '10px' }}>
                ⚠️ Please select an appointment time
              </div>
            )}
            {selectedDate && !isValidDate(selectedDate) && (
              <div style={{ color: '#ef4444', fontSize: '14px', marginBottom: '10px' }}>
                ⚠️ Selected date is not available for this doctor
              </div>
            )}

            {/* Debug information */}
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
              <strong>Debug Info:</strong><br/>
              Date Selected: {selectedDate ? '✅ ' + selectedDate : '❌ Not selected'}<br/>
              Time Selected: {selectedTime ? '✅ ' + selectedTime : '❌ Not selected'}<br/>
              Valid Date: {selectedDate && isValidDate(selectedDate) ? '✅ Valid' : '❌ Invalid'}<br/>
              Button Enabled: {!submitLoading && selectedDate && selectedTime ? '✅ Enabled' : '❌ Disabled'}<br/>
              Doctor Visiting Hours: {doctor?.visiting_hours || 'Not available'}
            </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && bookingDetails && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Appointment Request Submitted</h2>
            <p>🎉 Your appointment request has been submitted successfully!</p>
            <div className={styles.modalDetails}>
              <div><strong>Doctor:</strong> Dr. {bookingDetails.doctor}</div>
              <div><strong>Date:</strong> {bookingDetails.date}</div>
              <div><strong>Time:</strong> {bookingDetails.time}</div>
              <div><strong>Type:</strong> {bookingDetails.type}</div>
            </div>
            <p>
              You will receive an email confirmation shortly.<br/>
              Please wait for the admin to approve your appointment.
            </p>
            <button onClick={handleModalClose} className={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
