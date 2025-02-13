"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./Navbar.module.css"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 25.2c-6.188 0-11.2-5.012-11.2-11.2S9.812 4.8 16 4.8 27.2 9.812 27.2 16 22.188 27.2 16 27.2z"
              fill="#9333EA"
            />
            <path
              d="M16 7.6c-4.632 0-8.4 3.768-8.4 8.4s3.768 8.4 8.4 8.4 8.4-3.768 8.4-8.4-3.768-8.4-8.4-8.4zm0 14c-3.08 0-5.6-2.52-5.6-5.6s2.52-5.6 5.6-5.6 5.6 2.52 5.6 5.6-2.52 5.6-5.6 5.6z"
              fill="#9333EA"
            />
            <path
              d="M16 12.8c-1.76 0-3.2 1.44-3.2 3.2s1.44 3.2 3.2 3.2 3.2-1.44 3.2-3.2-1.44-3.2-3.2-3.2z"
              fill="#9333EA"
            />
          </svg>
          <span>SymptoSeek</span>
        </Link>
        <div className={styles.menu}>
          <Link href="/" className={pathname === "/" ? styles.active : ""}>
            Home
          </Link>
          <Link href="/chatbot" className={pathname === "/chatbot" ? styles.active : ""}>
            Chatbot
          </Link>
          <Link href="/recommendations" className={pathname === "/recommendations" ? styles.active : ""}>
            Recommendations
          </Link>
          <Link href="/auth" className={styles.signUp}>
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )
}

