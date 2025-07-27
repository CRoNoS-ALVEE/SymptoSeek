"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Bell, Clock, CheckCircle, Calendar, Pill, AlertCircle } from "lucide-react"
import styles from "./NotificationDropdown.module.css"

interface TodayReminder {
  _id: string
  title: string
  description: string
  type: string
  scheduleTime: string
  isCompleted: boolean
  createdAt: string
}

interface TodayAppointment {
  _id: string
  doctors_id: {
    name: string
    speciality: string
    hospital_name: string
  }
  date: string
  appointmentType: string
  reason: string
  status: string
}

interface NotificationDropdownProps {
  className?: string
}

export default function NotificationDropdown({ className }: NotificationDropdownProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [todayReminders, setTodayReminders] = useState<TodayReminder[]>([])
  const [todayAppointments, setTodayAppointments] = useState<TodayAppointment[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  // Ensure component is mounted before running effects
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Fetch data immediately when component mounts
    fetchTodayItems()

    // Poll for updates every 2 minutes
    const interval = setInterval(() => {
      if (mounted) {
        fetchTodayItems()
      }
    }, 120000)

    return () => {
      clearInterval(interval)
    }
  }, [mounted])

  // Also fetch when component becomes visible (page focus)
  useEffect(() => {
    if (!mounted) return

    const handleVisibilityChange = () => {
      if (!document.hidden && mounted) {
        fetchTodayItems()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted) return

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [showNotifications, mounted])

  const fetchTodayItems = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      console.log("No token found for notifications")
      return
    }

    try {
      setLoading(true)
      const today = new Date()
      const todayDateString = today.toISOString().split('T')[0] // Get today's date in YYYY-MM-DD format

      console.log("Fetching today's items for date:", todayDateString)

      let fetchedReminders: TodayReminder[] = []
      let fetchedAppointments: TodayAppointment[] = []

      // Fetch today's reminders from the correct endpoint
      try {
        console.log("Fetching reminders from: http://localhost:5000/api/reminder")
        const remindersResponse = await axios.get("http://localhost:5000/api/reminder", {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        })

        console.log("Raw reminders response:", remindersResponse.data)

        // Filter reminders for today - handle both one-time and recurring reminders
        const todayRemindersList = remindersResponse.data.filter((reminder: any) => {
          console.log("Processing reminder:", reminder)

          let isValidForToday = false

          if (reminder.recurring === 'daily') {
            console.log("Daily reminder found:", reminder.title)
            isValidForToday = true
          } else if (reminder.recurring === 'weekly' && reminder.daysOfWeek) {
            const todayDayOfWeek = today.getDay() // 0 = Sunday, 6 = Saturday
            console.log(`Weekly reminder check: today is ${todayDayOfWeek}, reminder days:`, reminder.daysOfWeek)
            isValidForToday = reminder.daysOfWeek.includes(todayDayOfWeek)
          } else if (reminder.date) {
            const reminderDate = new Date(reminder.date).toISOString().split('T')[0]
            console.log(`One-time reminder check: reminder date ${reminderDate} vs today ${todayDateString}`)
            isValidForToday = reminderDate === todayDateString
          } else if (reminder.recurring === 'none' && !reminder.date) {
            console.log("No date reminder, assuming today:", reminder.title)
            isValidForToday = true
          }

          // If the reminder is valid for today, check if it's still upcoming
          if (isValidForToday) {
            // Create the reminder datetime for today
            const reminderDateTime = new Date(`${todayDateString}T${reminder.time}:00`)
            const currentTime = new Date()

            console.log(`Time check for ${reminder.title}:`)
            console.log(`  - Reminder time: ${reminderDateTime.toLocaleTimeString()}`)
            console.log(`  - Current time: ${currentTime.toLocaleTimeString()}`)
            console.log(`  - Is upcoming: ${reminderDateTime > currentTime}`)

            // Only include if the reminder time hasn't passed yet
            return reminderDateTime > currentTime
          }

          return false
        }).map((reminder: any) => ({
          ...reminder,
          // Fix time formatting - create proper datetime string
          scheduleTime: reminder.date
              ? `${reminder.date.split('T')[0]}T${reminder.time}:00`
              : `${todayDateString}T${reminder.time}:00`
        }))

        console.log("Filtered today's reminders:", todayRemindersList)
        fetchedReminders = todayRemindersList
        setTodayReminders(todayRemindersList)

      } catch (reminderError) {
        console.error("Error fetching reminders:", reminderError)
        console.error("Reminder error details:", (reminderError as any)?.response?.data || (reminderError as Error)?.message)
      }

      // Fetch today's appointments
      try {
        console.log("Fetching appointments from: http://localhost:5000/api/appointments/my-appointments")
        const appointmentsResponse = await axios.get("http://localhost:5000/api/appointments/my-appointments", {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        })

        console.log("Raw appointments response:", appointmentsResponse.data)

        // Filter appointments for today AND only approved ones
        const todayAppointmentsList = appointmentsResponse.data.filter((appointment: TodayAppointment) => {
          const appointmentDate = new Date(appointment.date).toISOString().split('T')[0]
          const isToday = appointmentDate === todayDateString
          const isApproved = appointment.status && appointment.status.toLowerCase() === 'approved'

          console.log(`Appointment check: ${appointment._id}`)
          console.log(`  - Date: ${appointmentDate} vs today ${todayDateString} = ${isToday}`)
          console.log(`  - Status: ${appointment.status} = ${isApproved ? 'APPROVED' : 'NOT APPROVED'}`)
          console.log(`  - Include: ${isToday && isApproved}`)

          return isToday && isApproved
        })

        console.log("Filtered today's APPROVED appointments:", todayAppointmentsList)
        fetchedAppointments = todayAppointmentsList
        setTodayAppointments(todayAppointmentsList)

      } catch (appointmentError) {
        console.error("Error fetching appointments:", appointmentError)
        console.error("Appointment error details:", (appointmentError as any)?.response?.data || (appointmentError as Error)?.message)
      }

      // Use the fetched data to calculate total count
      const total = fetchedReminders.length + fetchedAppointments.length
      console.log(`Setting total count: ${fetchedReminders.length} reminders + ${fetchedAppointments.length} appointments = ${total}`)
      setTotalCount(total)

    } catch (error) {
      console.error("Error fetching today's items:", error)
      console.error("Error details:", (error as any)?.response?.data || (error as Error)?.message)
    } finally {
      setLoading(false)
    }
  }

  const markReminderAsCompleted = async (reminderId: string) => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      await axios.patch(
          `http://localhost:5000/api/reminder/${reminderId}`,
          { isCompleted: true },
          { headers: { Authorization: `Bearer ${token}` } }
      )

      // Update local state
      setTodayReminders(prev =>
          prev.map(r =>
              r._id === reminderId ? { ...r, isCompleted: true } : r
          )
      )
    } catch (error) {
      console.error("Error marking reminder as completed:", error)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, '0')
    return `${displayHours}:${displayMinutes} ${ampm}`
  }

  const getItemIcon = (type: string, itemType: 'reminder' | 'appointment') => {
    if (itemType === 'appointment') {
      return <Calendar size={16} className={styles.appointmentIcon} />
    }

    switch (type) {
      case 'medicine':
      case 'medication':
        return <Pill size={16} className={styles.medicineIcon} />
      case 'exercise':
        return '🏃‍♂️'
      case 'appointment':
        return <Calendar size={16} className={styles.appointmentIcon} />
      default:
        return <AlertCircle size={16} className={styles.defaultIcon} />
    }
  }

  const toggleNotifications = () => {
    if (!mounted) return
    setShowNotifications(!showNotifications)
    if (!showNotifications) {
      fetchTodayItems()
    }
  }

  // Don't render anything until component is mounted
  if (!mounted) {
    return (
        <div className={`${styles.notificationContainer} ${className}`}>
          <button className={styles.notificationButton}>
            <Bell size={20} />
          </button>
        </div>
    )
  }

  return (
      <div className={`${styles.notificationContainer} ${className}`} ref={notificationRef}>
        <button
            className={styles.notificationButton}
            onClick={toggleNotifications}
        >
          <Bell size={20} />
          {totalCount > 0 && (
              <span className={styles.notificationBadge}>
            {totalCount > 99 ? '99+' : totalCount}
          </span>
          )}
        </button>

        {showNotifications && (
            <div className={styles.notificationDropdown}>
              <div className={styles.notificationHeader}>
                <h3>Today's Schedule</h3>
                {totalCount > 0 && (
                    <span className={styles.unreadCount}>{totalCount} items</span>
                )}
              </div>

              <div className={styles.notificationList}>
                {loading ? (
                    <div className={styles.loadingState}>
                      <Clock size={24} />
                      <span>Loading today's items...</span>
                    </div>
                ) : totalCount === 0 ? (
                    <div className={styles.emptyState}>
                      <Calendar size={48} />
                      <h4>No Items Today</h4>
                      <p>You have no appointments or reminders scheduled for today.</p>
                    </div>
                ) : (
                    <>
                      {/* Today's Appointments */}
                      {todayAppointments.length > 0 && (
                          <>
                            <div className={styles.sectionHeader}>
                              <Calendar size={16} />
                              <span>Today's Appointments</span>
                            </div>
                            {todayAppointments.map((appointment) => (
                                <div
                                    key={`apt-${appointment._id}`}
                                    className={`${styles.notificationItem} ${styles.appointmentItem}`}
                                >
                                  <div className={styles.notificationIcon}>
                                    {getItemIcon('appointment', 'appointment')}
                                  </div>
                                  <div className={styles.notificationContent}>
                                    <div className={styles.notificationTitle}>
                                      Dr. {appointment.doctors_id?.name || 'Unknown'}
                                    </div>
                                    <div className={styles.notificationMessage}>
                                      {appointment.appointmentType} - {appointment.reason}
                                    </div>
                                    <div className={styles.notificationMeta}>
                            <span className={styles.notificationTime}>
                              <Clock size={12} />
                              {formatTime(appointment.date)}
                            </span>
                                      <span className={`${styles.notificationType} ${styles.statusBadge} ${styles[appointment.status.toLowerCase()]}`}>
                              {appointment.status}
                            </span>
                                    </div>
                                  </div>
                                </div>
                            ))}
                          </>
                      )}

                      {/* Today's Reminders */}
                      {todayReminders.length > 0 && (
                          <>
                            <div className={styles.sectionHeader}>
                              <Bell size={16} />
                              <span>Today's Reminders</span>
                            </div>
                            {todayReminders.map((reminder) => (
                                <div
                                    key={`rem-${reminder._id}`}
                                    className={`${styles.notificationItem} ${!reminder.isCompleted ? styles.unread : styles.completed}`}
                                >
                                  <div className={styles.notificationIcon}>
                                    {getItemIcon(reminder.type, 'reminder')}
                                  </div>
                                  <div className={styles.notificationContent}>
                                    <div className={styles.notificationTitle}>
                                      {reminder.title}
                                    </div>
                                    <div className={styles.notificationMessage}>
                                      {reminder.description}
                                    </div>
                                    <div className={styles.notificationMeta}>
                            <span className={styles.notificationTime}>
                              <Clock size={12} />
                              {formatTime(reminder.scheduleTime)}
                            </span>
                                      <span className={styles.notificationType}>
                              {reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)}
                            </span>
                                    </div>
                                  </div>
                                  {!reminder.isCompleted && (
                                      <button
                                          className={styles.markReadButton}
                                          onClick={() => markReminderAsCompleted(reminder._id)}
                                          title="Mark as completed"
                                      >
                                        <CheckCircle size={16} />
                                      </button>
                                  )}
                                </div>
                            ))}
                          </>
                      )}
                    </>
                )}
              </div>

              <div className={styles.notificationFooter}>
                <button className={styles.footerButton} onClick={() => window.location.href = '/appointments'}>
                  View All Appointments
                </button>
                <button className={styles.footerButton} onClick={() => window.location.href = '/reminders'}>
                  View All Reminders
                </button>
              </div>
            </div>
        )}
      </div>
  )
}