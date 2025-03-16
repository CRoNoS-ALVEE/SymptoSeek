"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, Stethoscope, User, Settings, LogOut } from "lucide-react"
import Image from "next/image"
import styles from "./Navbar.module.css"

interface NavbarProps {
  isLoggedIn?: boolean
  userImage?: string
}

export default function Navbar({ isLoggedIn, userImage }: NavbarProps) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    document.addEventListener("mousedown", handleClickOutside)
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
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
          <Link href="/doctors" className={pathname === "/doctors" ? styles.active : ""}>
            Doctors
          </Link>
          {isLoggedIn ? ( 
            <div className={styles.profileContainer} ref={profileRef}>
              <button onClick={toggleProfile} className={styles.profileButton}>
                <div className={styles.profilePicture}>
                  <Image
                    src={userImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"}
                    alt="Profile"
                    width={32}
                    height={32}
                  />
                </div>
              </button>
              {isProfileOpen && (
                <div className={styles.profileDropdown}>
                  <Link href="/profile" className={styles.dropdownItem}>
                    <User size={16} />
                    <span>Profile</span>
                  </Link>
                  <Link href="/settings" className={styles.dropdownItem}>
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                  <button onClick={() => {}} className={styles.dropdownItem}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth" className={styles.signUp}>
              Sign Up
            </Link>
          )}
          <button className={styles.closeButton} onClick={toggleMenu}>
            <X size={24} />
          </button>
        </div>
        {isMenuOpen && <div className={styles.overlay} onClick={toggleMenu}></div>}
      </div>
    </nav>
  )
}

