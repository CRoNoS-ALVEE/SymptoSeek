"use client";

import Link from "next/link"
import axios from "axios";
import Image from "next/image"
import { useState, useEffect, type ReactNode } from "react"
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Bell,
  Settings,
  LogOut,
  User,
  Clock,
  Stethoscope,
  Hash,
  Activity,
  Heart,
  Edit,
  Menu,
} from "lucide-react"
import styles from "./profile.module.css"
import { getApiUrl, API_CONFIG } from '@/config/api';
import Loading from "../components/Loading/Loading";

interface NavItemProps {
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}
interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  gender: string;
  age: number | null;
  phone: string;
  address: string;
  zip_code: string;
  country: string;
  state: string;
  city: string;
  profile_pic: string;
  role: string;
  status: string;
  blood_group: string;
  weight: string;
  height: string;
  allergies: string;
  medical_conditions: string;
  medications: string;
  surgeries: string;
  family_medical_history: string;
  emergency_contact: string;
  date: string;
  __v: number;
}

const NavItem = ({ href, children, className, onClick }: NavItemProps) => {
  const classes = `${styles.navItem} ${className || ''}`

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  )
}

export default function ProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatActivities, setChatActivities] = useState<any[]>([]);
  const [otherActivities, setOtherActivities] = useState<any[]>([]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    setUser(null); // Reset user state
    router.push("/auth"); // Redirect to auth page
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const fetchChatActivities = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.CHAT.HISTORY), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setChatActivities(response.data.conversations || []);
      }
    } catch (error) {
      console.error("Failed to fetch chat activities:", error);
    }
  };

  const fetchOtherActivities = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const activities: any[] = [];

      // Fetch appointments from the correct endpoint
      try {
        const appointmentsResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.APPOINTMENTS.MY_APPOINTMENTS), {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Add appointment activities
        if (appointmentsResponse.data && appointmentsResponse.data.length > 0) {
          appointmentsResponse.data.forEach((appointment: any) => {
            activities.push({
              title: `Appointment with Dr. ${appointment.doctors_id?.name || 'Unknown'}`,
              description: `${appointment.appointmentType || 'Medical'} appointment - ${appointment.reason || 'No reason provided'}`,
              timestamp: appointment.createdAt,
              icon: <Calendar size={16} />,
              type: 'appointment'
            });
          });
        }
      } catch (appointmentError) {
        console.error("Failed to fetch appointments:", appointmentError);
      }

      // Add profile update activity (when user data changes)
      if (user) {
        activities.push({
          title: 'Profile Updated',
          description: 'Updated profile information and personal details',
          timestamp: user.date || new Date().toISOString(),
          icon: <User size={16} />,
          type: 'profile'
        });
      }

      // Fetch feedback activities
      try {
        const feedbackResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.FEEDBACK.USER), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (feedbackResponse.data && feedbackResponse.data.length > 0) {
          feedbackResponse.data.forEach((feedback: any) => {
            activities.push({
              title: 'Feedback Submitted',
              description: `Submitted feedback: ${feedback.message?.substring(0, 50)}...`,
              timestamp: feedback.createdAt,
              icon: <Heart size={16} />,
              type: 'feedback'
            });
          });
        }
      } catch (feedbackError) {
        console.error("Failed to fetch feedback:", feedbackError);
      }

      // Fetch reminders
      try {
        const remindersResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.REMINDERS.LIST), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (remindersResponse.data && remindersResponse.data.length > 0) {
          remindersResponse.data.forEach((reminder: any) => {
            activities.push({
              title: 'Reminder Created',
              description: `Set reminder: ${reminder.title || reminder.message}`,
              timestamp: reminder.createdAt,
              icon: <Bell size={16} />,
              type: 'reminder'
            });
          });
        }
      } catch (reminderError) {
        console.error("Failed to fetch reminders:", reminderError);
      }

      // Sort activities by timestamp (most recent first)
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setOtherActivities(activities.slice(0, 15)); // Show last 15 activities
    } catch (error) {
      console.error("Failed to fetch other activities:", error);
      // Set some default activities if all API calls fail
      setOtherActivities([
        {
          title: 'Account Created',
          description: 'Welcome to SymptoSeek! Your account has been successfully created.',
          timestamp: new Date().toISOString(),
          icon: <User size={16} />,
          type: 'account'
        }
      ]);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }
      try {
        const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.PROFILE), {
          headers: {Authorization: `Bearer ${token}`},
        });
        console.log(response.data)
        setUser(response.data);

        // Fetch activities after user data is loaded
        await fetchChatActivities();
        await fetchOtherActivities();
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        // localStorage.removeItem("token");
        // router.push("/auth");
      } finally {
        setLoading(false);
      }
    };

    if (isMounted) {
      fetchUserData();
    }
  }, [router, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const toggleSidebar = () => {
    if (isMounted) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  if (!isMounted || loading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={toggleSidebar}>
        <Menu size={24} />
      </button>
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <Link href="/" className={styles.mainLogo}>
          <div className={styles.logoIcon}>
            <Stethoscope size={24} />
          </div>
          <span>SymptoSeek</span>
        </Link>

        <nav className={styles.navigation}>
          <NavItem href="/dashboard">
            <LayoutDashboard size={20} />
            Dashboard
          </NavItem>
          <NavItem href="/reports">
            <FileText size={20} />
            Reports
          </NavItem>
          <NavItem href="/appointments">
            <Calendar size={20} />
            Appointments
          </NavItem>
          <NavItem href="/reminders">
            <Bell size={20} />
            Reminders
          </NavItem>
          <NavItem href="/profile/feedback">
            <Heart size={20} />
            Feedback
          </NavItem>
          <NavItem href="/profile" className={styles.active}>
            <User size={20} />
            Profile
          </NavItem>
        </nav>

        <div className={styles.bottomNav}>
          <NavItem href="/settings">
            <Settings size={20} />
            Settings
          </NavItem>
          <NavItem onClick={handleLogout} className={styles.logoutButton}>
            <LogOut size={20} />
            Log out
          </NavItem>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.profileImage}>
            <Image
              src={user?.profile_pic || "https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?w=740"}
              alt="Profile"
              width={120}
              height={120}
            />
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.name}>{user?.name}</h1>
            <div className={styles.metadata}>
              <div className={styles.metaItem}>
                <User size={16} />
                Age: {user?.age || 'Not availabe'}
              </div>
              <div className={styles.metaItem}>
                <Clock size={16} />
                Last analysis: Today
              </div>
              <div className={styles.metaItem}>
                <Hash size={16} />
                User ID: J8D2N0E5
              </div>
            </div>
          </div>
          <Link href="/profile/edit" className={styles.editButton}>
            <Edit size={16} />
            Edit Profile
          </Link>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <Activity size={20} />
            Recent Activities
          </h2>

          {/* Chat Activities Section */}
          <div className={styles.activitySection}>
            <h3 className={styles.sectionTitle}>Chat Activities</h3>
            <div className={styles.activityList}>
              {chatActivities.length > 0 ? (
                chatActivities.map((chat, index) => (
                  <div key={index} className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <Hash size={16} />
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityTitle}>{chat.title}</div>
                      <div className={styles.activityMeta}>
                        {chat.message_count} messages • {formatDate(chat.last_updated)}
                      </div>
                      <div className={styles.activityDescription}>
                        {chat.last_message}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>No chat activities yet</div>
              )}
            </div>
          </div>

          {/* Other Activities Section */}
          <div className={styles.activitySection}>
            <h3 className={styles.sectionTitle}>Other Activities</h3>
            <div className={styles.activityList}>
              {otherActivities.length > 0 ? (
                otherActivities.map((activity, index) => (
                  <div key={index} className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      {activity.icon}
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityTitle}>{activity.title}</div>
                      <div className={styles.activityMeta}>
                        {formatDate(activity.timestamp)}
                      </div>
                      <div className={styles.activityDescription}>
                        {activity.description}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>No other activities yet</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}