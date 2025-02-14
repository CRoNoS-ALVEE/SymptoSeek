"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, Stethoscope } from "lucide-react"
import styles from "./Navbar.module.css"

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
      <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Stethoscope size={24} />
            </div>
            <span>SymptoSeek</span>
          </Link>
          <button className={styles.menuButton} onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ""}`}>
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
            <button className={styles.closeButton} onClick={toggleMenu}>
              <X size={24} />
            </button>
          </div>
          {isMenuOpen && <div className={styles.overlay} onClick={toggleMenu}></div>
          }
        </div>
      </nav>
  )
}

