'use client'

import { useState, useEffect } from 'react'
import { Star, Send, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import styles from './feedback.module.css'

interface Feedback {
  _id: string
  rating: number
  feedback: string
  isPublic: boolean
  isApproved: boolean
  category: string
  createdAt: string
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    rating: 5,
    feedback: '',
    isPublic: false,
    category: 'general'
  })

  const categories = [
    { value: 'general', label: 'General Feedback' },
    { value: 'accuracy', label: 'Accuracy' },
    { value: 'user_experience', label: 'User Experience' },
    { value: 'support', label: 'Support' },
    { value: 'feature_request', label: 'Feature Request' }
  ]

  useEffect(() => {
    fetchMyFeedback()
  }, [])

  const fetchMyFeedback = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Please log in to view your feedback')
        setLoading(false)
        return
      }

      const response = await fetch('http://localhost:5000/api/feedback/my-feedback', {
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
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Please log in to submit feedback')
        setSubmitting(false)
        return
      }

      if (!formData.feedback.trim()) {
        setError('Please enter your feedback')
        setSubmitting(false)
        return
      }

      const url = editingId ? `http://localhost:5000/api/feedback/${editingId}` : 'http://localhost:5000/api/feedback/submit'
      const method = editingId ? 'PUT' : 'POST'

      console.log('Submitting feedback:', { url, method, formData })

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const responseData = await response.json()
      console.log('Response:', responseData)

      if (response.ok) {
        setSuccess(editingId ? 'Feedback updated successfully!' : 'Feedback submitted successfully!')
        await fetchMyFeedback()
        setFormData({
          rating: 5,
          feedback: '',
          isPublic: false,
          category: 'general'
        })
        setEditingId(null)

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(responseData.message || 'Failed to submit feedback')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (feedback: Feedback) => {
    setFormData({
      rating: feedback.rating,
      feedback: feedback.feedback,
      isPublic: feedback.isPublic,
      category: feedback.category
    })
    setEditingId(feedback._id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Please log in to delete feedback')
        return
      }

      const response = await fetch(`http://localhost:5000/api/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setSuccess('Feedback deleted successfully!')
        await fetchMyFeedback()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to delete feedback')
      }
    } catch (error) {
      console.error('Error deleting feedback:', error)
      setError('Network error. Please try again.')
    }
  }

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            className={`${styles.star} ${star <= rating ? styles.filled : ''} ${
              interactive ? styles.interactive : ''
            }`}
            onClick={interactive && onChange ? () => onChange(star) : undefined}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading your feedback...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Your Feedback</h1>
        <p>Share your experience with SymptoSeek and help us improve</p>
      </div>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <h2>{editingId ? 'Edit Feedback' : 'Submit New Feedback'}</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Rating</label>
              {renderStars(formData.rating, true, (rating) =>
                setFormData({ ...formData, rating })
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={styles.select}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Your Feedback</label>
              <textarea
                value={formData.feedback}
                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                placeholder="Share your experience with SymptoSeek..."
                required
                className={styles.textarea}
                rows={4}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                />
                Make this feedback public (will appear in testimonials after approval)
              </label>
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                disabled={submitting}
                className={styles.submitBtn}
              >
                <Send size={16} />
                {submitting ? 'Submitting...' : editingId ? 'Update Feedback' : 'Submit Feedback'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null)
                    setFormData({
                      rating: 5,
                      feedback: '',
                      isPublic: false,
                      category: 'general'
                    })
                  }}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
              )}
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}
          </form>
        </div>

        <div className={styles.feedbackList}>
          <h2>Your Previous Feedback</h2>
          {feedbacks.length === 0 ? (
            <div className={styles.noFeedback}>
              <p>You haven't submitted any feedback yet.</p>
            </div>
          ) : (
            <div className={styles.feedbackGrid}>
              {feedbacks.map((feedback) => (
                <div key={feedback._id} className={styles.feedbackCard}>
                  <div className={styles.feedbackHeader}>
                    {renderStars(feedback.rating)}
                    <div className={styles.feedbackMeta}>
                      <span className={styles.category}>
                        {categories.find(c => c.value === feedback.category)?.label}
                      </span>
                      <span className={styles.date}>
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <p className={styles.feedbackText}>{feedback.feedback}</p>

                  <div className={styles.feedbackFooter}>
                    <div className={styles.status}>
                      <span className={`${styles.statusBadge} ${feedback.isPublic ? styles.public : styles.private}`}>
                        {feedback.isPublic ? <Eye size={14} /> : <EyeOff size={14} />}
                        {feedback.isPublic ? 'Public' : 'Private'}
                      </span>
                      {feedback.isPublic && (
                        <span className={`${styles.statusBadge} ${feedback.isApproved ? styles.approved : styles.pending}`}>
                          {feedback.isApproved ? 'Approved' : 'Pending Approval'}
                        </span>
                      )}
                    </div>

                    <div className={styles.actions}>
                      <button
                        onClick={() => handleEdit(feedback)}
                        className={styles.editBtn}
                        title="Edit feedback"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(feedback._id)}
                        className={styles.deleteBtn}
                        title="Delete feedback"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
