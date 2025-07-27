'use client'

import { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import styles from './Testimonials.module.css'

interface Testimonial {
  _id: string
  userName: string
  rating: number
  feedback: string
  createdAt: string
  category: string
  userProfilePic?: string | null
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/feedback/public?limit=6')
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data.data)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      // Fallback to static data if API fails
      setTestimonials([
        {
          _id: '1',
          userName: 'Sarah Johnson',
          rating: 5,
          feedback: 'SymptoSeek helped me understand my symptoms when I was unsure whether to see a doctor. The AI provided clear insights that helped me make an informed decision.',
          createdAt: new Date().toISOString(),
          category: 'general'
        },
        {
          _id: '2',
          userName: 'Michael Chen',
          rating: 5,
          feedback: 'The accuracy of the symptom analysis is impressive. It\'s like having a knowledgeable healthcare companion available 24/7.',
          createdAt: new Date().toISOString(),
          category: 'accuracy'
        },
        {
          _id: '3',
          userName: 'Emily Rodriguez',
          rating: 4,
          feedback: 'As someone with chronic conditions, having access to AI-powered health insights has been invaluable for managing my day-to-day health.',
          createdAt: new Date().toISOString(),
          category: 'user_experience'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className={styles.rating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`${styles.star} ${star <= rating ? styles.filled : ''}`}>
            ★
          </span>
        ))}
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return (
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <div className={styles.title}>
            <h2>What Our Users Say</h2>
            <p>Discover how SymptoSeek has helped people understand their health better</p>
          </div>
          <div className={styles.loading}>Loading testimonials...</div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.testimonials}>
      <div className={styles.container}>
        <div className={styles.title}>
          <h2>What Our Users Say</h2>
          <p>Discover how SymptoSeek has helped people understand their health better</p>
        </div>
        <div className={styles.grid}>
          {testimonials.map((testimonial) => (
            <div key={testimonial._id} className={styles.testimonial}>
              <div className={styles.testimonialHeader}>
                {renderStars(testimonial.rating)}
                <span className={styles.date}>
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className={styles.content}>
                &ldquo;{testimonial.feedback}&rdquo;
              </p>
              <div className={styles.author}>
                <div className={styles.avatar}>
                  {testimonial.userProfilePic ? (
                    <img
                      src={testimonial.userProfilePic}
                      alt={testimonial.userName}
                      className={styles.profileImage}
                      onError={(e) => {
                        // Hide the image and show initials fallback on error
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const initialsSpan = target.nextElementSibling as HTMLElement;
                        if (initialsSpan) {
                          initialsSpan.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <span
                    className={styles.initials}
                    style={{ display: testimonial.userProfilePic ? 'none' : 'flex' }}
                  >
                    {getInitials(testimonial.userName)}
                  </span>
                </div>
                <div className={styles.info}>
                  <h4>{testimonial.userName}</h4>
                  <p>Verified User</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {testimonials.length === 0 && (
          <div className={styles.noTestimonials}>
            <p>No testimonials available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}