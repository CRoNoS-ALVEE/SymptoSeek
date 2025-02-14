"use client"

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { useState } from "react"
import { useGoogleLogin } from "@react-oauth/google"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { faGoogle, faMicrosoft, faTwitter } from "@fortawesome/free-brands-svg-icons"
import styles from "./auth.module.css"

config.autoAddCss = false

export default function AuthContent() {
  const [isSignUpMode, setIsSignUpMode] = useState(false)

  const handleSignUpClick = () => {
    setIsSignUpMode(true)
  }

  const handleSignInClick = () => {
    setIsSignUpMode(false)
  }

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse)
      // Handle successful login here
    },
    onError: (error) => {
      console.error("Login Failed:", error)
    },
  })

  return (
      <div className={`${styles.container} ${isSignUpMode ? styles.signUpMode : ""}`}>
        <div className={styles.formsContainer}>
          <div className={styles.signinSignup}>
            <form className={`${styles.formWrapper} ${styles.signInForm}`}>
              <h2 className={styles.title}>Sign in</h2>
              <div className={styles.inputField}>
                <i>
                  <FontAwesomeIcon icon={faEnvelope} />
                </i>
                <input type="email" placeholder="Email" />
              </div>
              <div className={styles.inputField}>
                <i>
                  <FontAwesomeIcon icon={faLock} />
                </i>
                <input type="password" placeholder="Password" />
              </div>
              <input type="submit" value="Login" className={styles.btn} />
              <p className={styles.socialText}>Or Sign in with social platforms</p>
              <div className={styles.socialMedia}>
                <a href="#" className={styles.socialIcon} onClick={() => login()}>
                  <FontAwesomeIcon icon={faGoogle} />
                </a>
                <a href="#" className={styles.socialIcon}>
                  <FontAwesomeIcon icon={faMicrosoft} />
                </a>
                <a href="#" className={styles.socialIcon}>
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
              </div>
            </form>
            <form className={`${styles.formWrapper} ${styles.signUpForm}`}>
              <h2 className={styles.title}>Sign up</h2>
              <div className={styles.inputField}>
                <i>
                  <FontAwesomeIcon icon={faUser} />
                </i>
                <input type="text" placeholder="Full Name" />
              </div>
              <div className={styles.inputField}>
                <i>
                  <FontAwesomeIcon icon={faEnvelope} />
                </i>
                <input type="email" placeholder="Email" />
              </div>
              <div className={styles.inputField}>
                <i>
                  <FontAwesomeIcon icon={faLock} />
                </i>
                <input type="password" placeholder="Password" />
              </div>
              <input type="submit" className={styles.btn} value="Sign up" />
              <p className={styles.socialText}>Or Sign up with social platforms</p>
              <div className={styles.socialMedia}>
                <a href="#" className={styles.socialIcon} onClick={() => login()}>
                  <FontAwesomeIcon icon={faGoogle} />
                </a>
                <a href="#" className={styles.socialIcon}>
                  <FontAwesomeIcon icon={faMicrosoft} />
                </a>
                <a href="#" className={styles.socialIcon}>
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
              </div>
            </form>
          </div>
        </div>
        <div className={styles.panelsContainer}>
          <div className={`${styles.panel} ${styles.leftPanel}`}>
            <div className={styles.content}>
              <h3>New here ?</h3>
              <p>
                Join SymptoSeek to access personalized health insights and connect with our AI-powered symptom analysis.
              </p>
              <button className={`${styles.btn} ${styles.transparent}`} onClick={handleSignUpClick}>
                Sign up
              </button>
            </div>
            <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/log-k7snnCr50CZaS0nowddBS8zQWSl4Dd.svg"
                className={styles.image}
                alt="Sign In illustration"
                width={400}
                height={400}
                priority
            />
          </div>
          <div className={`${styles.panel} ${styles.rightPanel}`}>
            <div className={styles.content}>
              <h3>One of us ?</h3>
              <p>Welcome back! Sign in to continue your health journey with SymptoSeek.</p>
              <button className={`${styles.btn} ${styles.transparent}`} onClick={handleSignInClick}>
                Sign in
              </button>
            </div>
            <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/register-0OxCKpnMUkcjl19rsUa9ymhgx8h2dU.svg"
                className={styles.image}
                alt="Sign Up illustration"
                width={400}
                height={400}
                priority
            />
          </div>
        </div>
      </div>
  )
}

