'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Check,
  X,
  Eye,
  Star,
  User
} from 'lucide-react'
import styles from './feedback.module.css'

interface FeedbackItem {
  _id: string
  userName: string
  userEmail: string
  rating: number
  feedback: string
  category: string
  isPublic: boolean
  isApproved: boolean
  createdAt: string
}

export default function AdminFeedbackPage() {
  const [user, setUser] = useState<any>(null)
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const categories = [
    { value: 'general', label: 'General Feedback' },
    { value: 'accuracy', label: 'Accuracy' },
    { value: 'user_experience', label: 'User Experience' },
    { value: 'support', label: 'Support' },
    { value: 'feature_request', label: 'Feature Request' }
  ]

  useEffect(() => {
    checkAuth()
    fetchAllFeedback()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin/auth')
        return
      }

      // For admin pages, we can directly check the stored admin info
      const adminInfo = localStorage.getItem('adminInfo')
      if (adminInfo) {
        const admin = JSON.parse(adminInfo)
        if (admin.role === 'admin') {
          setUser(admin)
        } else {
          router.push('/admin/auth')
          return
        }
      } else {
        router.push('/admin/auth')
        return
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/admin/auth')
    } finally {
      setLoading(false)
    }
  }

  const fetchAllFeedback = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('http://localhost:5000/api/feedback/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setFeedbacks(data.data)
        setError(null)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to fetch feedback')
      }
    } catch (error) {
      console.error('Error fetching feedback:', error)
      setError('Network error. Please check your connection.')
    }
  }

  const handleApproval = async (feedbackId: string, isApproved: boolean) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:5000/api/feedback/admin/${feedbackId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isApproved })
      })

      if (response.ok) {
        setSuccess(`Feedback ${isApproved ? 'approved' : 'rejected'} successfully!`)
        await fetchAllFeedback()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to update feedback')
      }
    } catch (error) {
      console.error('Error updating feedback:', error)
      setError('Network error. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminInfo')
    router.push('/admin/auth')
  }

  const renderStars = (rating: number) => {
    return (
      <div className={styles.rating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${styles.star} ${star <= rating ? styles.filled : ''}`}
          />
        ))}
      </div>
    )
  }

  const getStatusColor = (isPublic: boolean, isApproved: boolean) => {
    if (!isPublic) return styles.private
    return isApproved ? styles.approved : styles.pending
  }

  const getStatusText = (isPublic: boolean, isApproved: boolean) => {
    if (!isPublic) return 'Private'
    return isApproved ? 'Approved' : 'Pending'
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading feedback...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <LayoutDashboard size={24} />
          <span>Admin Panel</span>
        </div>

        <nav className={styles.navigation}>
          <Link href="/admin/dashboard" className={styles.navItem}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/admin/users" className={styles.navItem}>
            <Users size={20} />
            Users
          </Link>
          <Link href="/admin/doctors" className={styles.navItem}>
            <Users size={20} />
            Doctors
          </Link>
          <Link href="/admin/appointments" className={styles.navItem}>
            <Calendar size={20} />
            Appointments
          </Link>
          <Link href="/admin/feedback" className={`${styles.navItem} ${styles.active}`}>
            <MessageSquare size={20} />
            Feedback
          </Link>
          <Link href="/admin/reports" className={styles.navItem}>
            <FileText size={20} />
            Reports
          </Link>
          <Link href="/admin/settings" className={styles.navItem}>
            <Settings size={20} />
            Settings
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Feedback Management</h1>
            <p>Review and approve user feedback for public testimonials</p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.adminProfile}>
              {user?.profile_pic ? (
                <img
                  src={user.profile_pic}
                  alt={user.name}
                  className={styles.avatar}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove(styles.hidden);
                  }}
                />
              ) : null}
              <div className={`${styles.avatar} ${user?.profile_pic ? styles.hidden : ''}`}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span>{user?.name}</span>
            </div>
          </div>
        </header>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <MessageSquare size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>{feedbacks.length}</h3>
              <p>Total Feedback</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Eye size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>{feedbacks.filter(f => f.isPublic && !f.isApproved).length}</h3>
              <p>Pending Approval</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Check size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>{feedbacks.filter(f => f.isApproved).length}</h3>
              <p>Approved</p>
            </div>
          </div>
        </div>

        {/* Feedback Grid */}
        <div className={styles.feedbackGrid}>
          {feedbacks.map((feedback) => (
            <div key={feedback._id} className={styles.feedbackCard}>
              <div className={styles.cardHeader}>
                <div className={styles.userInfo}>
                  <User size={16} />
                  <span className={styles.userName}>{feedback.userName}</span>
                </div>
                <div className={styles.cardMeta}>
                  {renderStars(feedback.rating)}
                  <span className={styles.date}>
                    <Calendar size={14} />
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className={styles.category}>
                {categories.find(c => c.value === feedback.category)?.label}
              </div>

              <p className={styles.feedbackText}>{feedback.feedback}</p>

              <div className={styles.cardFooter}>
                <div className={styles.status}>
                  <span className={`${styles.statusBadge} ${getStatusColor(feedback.isPublic, feedback.isApproved)}`}>
                    <Eye size={12} />
                    {getStatusText(feedback.isPublic, feedback.isApproved)}
                  </span>
                </div>

                {feedback.isPublic && (
                  <div className={styles.actions}>
                    {!feedback.isApproved ? (
                      <>
                        <button
                          onClick={() => handleApproval(feedback._id, true)}
                          className={styles.approveBtn}
                          title="Approve feedback"
                        >
                          <Check size={16} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproval(feedback._id, false)}
                          className={styles.rejectBtn}
                          title="Reject feedback"
                        >
                          <X size={16} />
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleApproval(feedback._id, false)}
                        className={styles.unapproveBtn}
                        title="Remove approval"
                      >
                        <X size={16} />
                        Unapprove
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {feedbacks.length === 0 && (
          <div className={styles.noFeedback}>
            <p>No feedback submissions yet.</p>
          </div>
        )}
      </main>
    </div>
  )
}
