"use client"

import { useCallback, useEffect, useState } from "react"
import Particles from "react-tsparticles"
import { loadSlim } from "tsparticles-slim"
import Link from "next/link"
import axios from "axios";
import { useRouter } from "next/navigation";
import type { Engine } from "tsparticles-engine"
import { Calendar, Clock, MessageSquare, Stethoscope, User, Plus } from "lucide-react"
import Navbar from "../components/Navbar/Dashboard-Navbar"
import Footer from "../components/Footer/Footer"
import styles from "./dashboard.module.css"
import { getApiUrl, API_CONFIG } from "../../config/api"

interface User {
  profile_pic?: string;
  name?: string;
  email?: string;
}

interface DashboardStats {
  upcomingAppointments: number;
  pastConsultations: number;
  activeReminders: number;
  totalChatInteractions: number;
}

interface RecentActivity {
  icon: JSX.Element;
  title: string;
  time: string;
  type: string;
}

interface CompletedAppointment {
  _id: string;
  doctors_id: {
    name: string;
    speciality: string;
    hospital_name: string;
    image_source?: string;
  };
  date: string;
  appointmentType: string;
  reason: string;
  status: string;
  completedAt?: string;
  createdAt?: string;
  adminNote?: string;
}

interface AppointmentModalData {
  _id: string;
  doctors_id: {
    name: string;
    speciality: string;
    hospital_name: string;
    image_source?: string;
    address?: string;
    number?: string;
  };
  date: string;
  appointmentType: string;
  reason: string;
  status: string;
  completedAt?: string;
  createdAt?: string;
  adminNote?: string;
}

export default function DashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<DashboardStats>({
    upcomingAppointments: 0,
    pastConsultations: 0,
    activeReminders: 0,
    totalChatInteractions: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [completedConsultations, setCompletedConsultations] = useState<CompletedAppointment[]>([]);
  const [allAppointments, setAllAppointments] = useState<CompletedAppointment[]>([]);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentModalData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token ? "exists" : "missing");

      if (!token) {
        console.log("No token found, redirecting to auth");
        router.push("/auth");
        return;
      }

      try {
        console.log("Attempting to fetch user data...");
        const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.PROFILE), {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("User data fetched successfully:", response.data);
        setUser(response.data);

        // Fetch dashboard stats after user data is loaded
        await fetchDashboardStats(token);
        await fetchRecentActivity(token);

      } catch (err: any) {
        console.error("Failed to fetch user data:", err);
        console.log("Error response:", err.response);

        if (err.response && err.response.status === 401) {
          console.log("Token is invalid/expired, clearing localStorage and redirecting");
          localStorage.removeItem("token");
          localStorage.removeItem("id");
          router.push("/auth");
        } else {
          setError("Failed to fetch user data. Please try refreshing the page.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const fetchDashboardStats = async (token: string) => {
    try {
      // Fetch appointments
      const appointmentsResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.APPOINTMENTS.MY_APPOINTMENTS), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const appointments = appointmentsResponse.data;
      const now = new Date();

      // Calculate upcoming appointments (approved and in future)
      const upcomingAppointments = appointments.filter((apt: any) =>
          new Date(apt.date) > now && apt.status === 'Approved'
      ).length;

      // Past consultations should only count COMPLETED appointments
      const pastConsultations = appointments.filter((apt: any) =>
          apt.status === 'Completed'
      ).length;

      // Store completed consultations for display
      const completedAppts = appointments.filter((apt: any) =>
          apt.status === 'Completed'
      ).sort((a: any, b: any) => new Date(b.completedAt || b.date).getTime() - new Date(a.completedAt || a.date).getTime());

      setCompletedConsultations(completedAppts);
      setAllAppointments(appointments); // Store all appointments

      // Fetch reminders for active reminders count
      const remindersResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.REMINDERS.LIST), {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Calculate active reminders (reminders that are not completed and are active today)
      const today = new Date();
      const todayDateString = today.toISOString().split('T')[0];

      const activeReminders = remindersResponse.data.filter((reminder: any) => {
        // Don't count completed reminders
        if (reminder.isCompleted) return false;

        // Check if reminder is active today
        if (reminder.recurring === 'daily') {
          return true;
        } else if (reminder.recurring === 'weekly' && reminder.daysOfWeek) {
          const todayDayOfWeek = today.getDay();
          return reminder.daysOfWeek.includes(todayDayOfWeek);
        } else if (reminder.date) {
          const reminderDate = new Date(reminder.date).toISOString().split('T')[0];
          return reminderDate === todayDateString;
        } else if (reminder.recurring === 'none' && !reminder.date) {
          return true;
        }

        return false;
      }).length;

      // Fetch total chat interactions from chat history
      const chatResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.CHAT.HISTORY), {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Count total interactions (messages) across all conversations
      const totalChatInteractions = chatResponse.data.conversations
        ? chatResponse.data.conversations.reduce((total: number, conv: any) => total + (conv.message_count || 0), 0)
        : 0;

      setStats({
        upcomingAppointments,
        pastConsultations,
        activeReminders,
        totalChatInteractions
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchRecentActivity = async (token: string) => {
    try {
      const activities: RecentActivity[] = [];

      // Fetch recent appointments
      const appointmentsResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.APPOINTMENTS.MY_APPOINTMENTS), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const recentAppointments = appointmentsResponse.data
          .slice(0, 2)
          .map((apt: any) => ({
            icon: <Calendar size={20} />,
            title: `Appointment ${apt.status.toLowerCase()} with Dr. ${apt.doctors_id?.name || 'Unknown'}`,
            time: getRelativeTime(apt.createdAt),
            type: 'appointment'
          }));

      // Fetch recent reminders
      const remindersResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.REMINDERS.LIST), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const recentReminders = remindersResponse.data
          .slice(0, 2)
          .map((reminder: any) => ({
            icon: reminder.type === 'medication' ? <Stethoscope size={20} /> : <Clock size={20} />,
            title: reminder.title,
            time: getRelativeTime(reminder.createdAt),
            type: 'reminder'
          }));

      // Fetch recent chat conversations
      try {
        const chatResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.CHAT.HISTORY), {
          headers: { Authorization: `Bearer ${token}` },
        });

        const recentChatActivities = chatResponse.data.conversations
          ? chatResponse.data.conversations
              .slice(0, 2)
              .map((conversation: any) => ({
                icon: <MessageSquare size={20} />,
                title: `Chat: ${conversation.title || 'Health consultation'}`,
                time: getRelativeTime(conversation.last_updated || conversation.created_at),
                type: 'chat'
              }))
          : [{
              icon: <MessageSquare size={20} />,
              title: "AI Health Assistant available",
              time: "Now",
              type: 'chat'
            }];

        activities.push(...recentChatActivities);
      } catch (chatError) {
        console.error("Error fetching chat history:", chatError);
        // Add default chat activity if API fails
        activities.push({
          icon: <MessageSquare size={20} />,
          title: "Chat with AI Health Assistant",
          time: "Available now",
          type: 'chat'
        });
      }

      setRecentActivity([...recentAppointments, ...recentReminders, ...activities].slice(0, 4));

    } catch (error) {
      console.error("Error fetching recent activity:", error);
      // Set default activity if API fails
      setRecentActivity([
        {
          icon: <MessageSquare size={20} />,
          title: "Welcome to SymptoSeek!",
          time: "Now",
          type: 'welcome'
        }
      ]);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "Yesterday";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      setUser(null);
      router.push("/auth");
    }
  };

  const handleAppointmentClick = (appointment: CompletedAppointment) => {
    setSelectedAppointment(appointment as AppointmentModalData);
    setShowAppointmentModal(true);
  };

  const closeModal = () => {
    setShowAppointmentModal(false);
    setSelectedAppointment(null);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'Approved': { bg: '#10b981', text: 'white' },
      'Completed': { bg: '#059669', text: 'white' },
      'Pending': { bg: '#f59e0b', text: 'white' },
      'Cancelled': { bg: '#ef4444', text: 'white' },
      'Rejected': { bg: '#dc2626', text: 'white' }
    };
    const colors = statusColors[status as keyof typeof statusColors] || { bg: '#6b7280', text: 'white' };
    return (
        <span style={{
          background: colors.bg,
          color: colors.text,
          padding: '0.25rem 0.75rem',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
        {status}
      </span>
    );
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  const dashboardStats = [
    { value: stats.upcomingAppointments.toString(), label: "Upcoming Appointments", link: "/appointments"},
    { value: stats.pastConsultations.toString(), label: "Past Consultations" },
    { value: stats.activeReminders.toString(), label: "Active Reminders", link: "/reminders" },
    { value: stats.totalChatInteractions.toString(), label: "Chat Interactions", link: "/chatbot" },
  ]

  if (loading) return <p className={styles.loading}></p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
      <div className={styles.container}>
        <Navbar isLoggedIn={true} userImage={user?.profile_pic || "/default-avatar.png"} onLogout={handleLogout} />
        <main className={styles.main}>
          <section className={styles.welcomeSection}>
            <Particles
                className={styles.particles}
                init={particlesInit}
                options={{
                  fullScreen: { enable: false },
                  background: {
                    color: {
                      value: "transparent",
                    },
                  },
                  fpsLimit: 120,
                  interactivity: {
                    events: {
                      onHover: {
                        enable: true,
                        mode: "repulse",
                      },
                      resize: true,
                    },
                    modes: {
                      repulse: {
                        distance: 100,
                        duration: 0.4,
                      },
                    },
                  },
                  particles: {
                    color: {
                      value: "#9333EA",
                    },
                    links: {
                      color: "#9333EA",
                      distance: 150,
                      enable: true,
                      opacity: 0.2,
                      width: 1,
                    },
                    move: {
                      direction: "none",
                      enable: true,
                      outModes: {
                        default: "bounce",
                      },
                      random: false,
                      speed: 2,
                      straight: false,
                    },
                    number: {
                      density: {
                        enable: true,
                        area: 800,
                      },
                      value: 50,
                    },
                    opacity: {
                      value: 0.2,
                    },
                    shape: {
                      type: "circle",
                    },
                    size: {
                      value: { min: 1, max: 3 },
                    },
                  },
                  detectRetina: true,
                }}
            />
            <div className={styles.welcomeContent}>
              <h1 className={styles.welcomeTitle}>Welcome back, {user?.name || "User"}! </h1>
              <p className={styles.welcomeText}>
                Track your health journey and manage your appointments all in one place
              </p>
            </div>
          </section>

          <div className={styles.statsGrid}>
            {dashboardStats.map((stat, index) => (
                <Link
                    key={index}
                    href={stat.link || "#"}
                    className={styles.statCard}
                    style={{ textDecoration: 'none' }}
                >
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                  {stat.link && (
                      <div className={styles.statAction}>
                        <Plus size={16} />
                        View
                      </div>
                  )}
                </Link>
            ))}
          </div>

          {/* Upcoming Appointments Section */}
          <section className={styles.recentActivity}>
            <h2 className={styles.sectionTitle}>Upcoming Appointments</h2>
            <div className={styles.activityList}>
              {allAppointments.filter(apt =>
                  new Date(apt.date) > new Date() && apt.status === 'Approved'
              ).slice(0, 5).length > 0 ? (
                  allAppointments.filter(apt =>
                      new Date(apt.date) > new Date() && apt.status === 'Approved'
                  ).slice(0, 5).map((appointment, index) => (
                      <div key={appointment._id} className={styles.activityItem} onClick={() => handleAppointmentClick(appointment)}>
                        <div className={styles.activityIcon}>
                          <Calendar size={20} />
                        </div>
                        <div className={styles.activityContent}>
                          <div className={styles.activityTitle}>
                            Dr. {appointment.doctors_id.name} - {appointment.doctors_id.speciality}
                          </div>
                          <div className={styles.activityTime}>
                            {new Date(appointment.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })} at {new Date(appointment.date).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                          </div>
                          <div className={styles.activityMeta}>
                            {appointment.appointmentType || 'Consultation'} • {appointment.doctors_id.hospital_name}
                            <div className={styles.activityStatus}>{getStatusBadge(appointment.status)}</div>
                          </div>
                        </div>
                      </div>
                  ))
              ) : (
                  <div className={styles.emptyActivityState}>
                    <Calendar size={24} className={styles.emptyActivityIcon} />
                    <div>
                      <div className={styles.emptyActivityTitle}>No upcoming appointments</div>
                      <div className={styles.emptyActivityText}>
                        <Link href="/doctors" className={styles.emptyActivityLink}>Book your next appointment</Link>
                      </div>
                    </div>
                  </div>
              )}
            </div>
          </section>

          {/* Past Consultations Section - Matching Recent Activity Format */}
          <section className={styles.recentActivity}>
            <h2 className={styles.sectionTitle}>Past Consultations</h2>
            <div className={styles.activityList}>
              {completedConsultations.length > 0 ? (
                  completedConsultations.slice(0, 5).map((consultation, index) => (
                      <div key={consultation._id} className={styles.activityItem} onClick={() => handleAppointmentClick(consultation)}>
                        <div className={styles.activityIcon}>
                          <Stethoscope size={20} />
                        </div>
                        <div className={styles.activityContent}>
                          <div className={styles.activityTitle}>
                            Dr. {consultation.doctors_id.name} - {consultation.doctors_id.speciality}
                          </div>
                          <div className={styles.activityTime}>
                            {new Date(consultation.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })} at {new Date(consultation.date).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                          </div>
                          <div className={styles.activityMeta}>
                            {consultation.appointmentType || 'Consultation'} • {consultation.doctors_id.hospital_name}
                            {consultation.completedAt && (
                                <span className={styles.completedIndicator}> • Completed {getRelativeTime(consultation.completedAt)}</span>
                            )}
                          </div>
                        </div>
                        <div className={styles.completedBadgeSmall}>✓</div>
                      </div>
                  ))
              ) : (
                  <div className={styles.emptyActivityState}>
                    <Stethoscope size={24} className={styles.emptyActivityIcon} />
                    <div>
                      <div className={styles.emptyActivityTitle}>No completed consultations yet</div>
                      <div className={styles.emptyActivityText}>Your completed appointments will appear here</div>
                    </div>
                  </div>
              )}

              {completedConsultations.length > 5 && (
                  <div className={styles.viewMoreActivity}>
                    <Link href="/appointments" className={styles.viewMoreActivityLink}>
                      View all {completedConsultations.length} consultations
                    </Link>
                  </div>
              )}
            </div>
          </section>

          {showAppointmentModal && selectedAppointment && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Appointment Details</h2>
                    <button className={styles.modalClose} onClick={closeModal}>×</button>
                  </div>
                  <div className={styles.modalBody}>
                    <div className={styles.modalSection}>
                      <h3 className={styles.modalSectionTitle}>Appointment Info</h3>
                      <div className={styles.modalInfoRow}>
                        <div className={styles.modalInfoLabel}>Doctor:</div>
                        <div className={styles.modalInfoValue}>Dr. {selectedAppointment.doctors_id.name}</div>
                      </div>
                      <div className={styles.modalInfoRow}>
                        <div className={styles.modalInfoLabel}>Speciality:</div>
                        <div className={styles.modalInfoValue}>{selectedAppointment.doctors_id.speciality}</div>
                      </div>
                      <div className={styles.modalInfoRow}>
                        <div className={styles.modalInfoLabel}>Hospital:</div>
                        <div className={styles.modalInfoValue}>{selectedAppointment.doctors_id.hospital_name}</div>
                      </div>
                      <div className={styles.modalInfoRow}>
                        <div className={styles.modalInfoLabel}>Type:</div>
                        <div className={styles.modalInfoValue}>{selectedAppointment.appointmentType || 'Consultation'}</div>
                      </div>
                      <div className={styles.modalInfoRow}>
                        <div className={styles.modalInfoLabel}>Date & Time:</div>
                        <div className={styles.modalInfoValue}>
                          {new Date(selectedAppointment.date).toLocaleString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </div>
                      </div>
                      <div className={styles.modalInfoRow}>
                        <div className={styles.modalInfoLabel}>Status:</div>
                        <div className={styles.modalInfoValue}>
                          {getStatusBadge(selectedAppointment.status)}
                        </div>
                      </div>
                    </div>

                    <div className={styles.modalSection}>
                      <h3 className={styles.modalSectionTitle}>Additional Details</h3>
                      <div className={styles.modalDetailRow}>
                        <div className={styles.modalDetailLabel}>Reason for Visit:</div>
                        <div className={styles.modalDetailValue}>{selectedAppointment.reason || 'General consultation'}</div>
                      </div>
                      <div className={styles.modalDetailRow}>
                        <div className={styles.modalDetailLabel}>Admin Note:</div>
                        <div className={styles.modalDetailValue}>{selectedAppointment.adminNote || 'No additional notes'}</div>
                      </div>
                      {selectedAppointment.completedAt && (
                          <div className={styles.modalDetailRow}>
                            <div className={styles.modalDetailLabel}>Completed:</div>
                            <div className={styles.modalDetailValue}>{getRelativeTime(selectedAppointment.completedAt)}</div>
                          </div>
                      )}
                    </div>

                    <div className={styles.modalActions}>
                      <button className={styles.modalButton} onClick={closeModal}>Close</button>
                    </div>
                  </div>
                </div>
              </div>
          )}
        </main>
        <Footer />
      </div>
  )
}