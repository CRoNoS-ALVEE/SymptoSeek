import Navbar from "./components/Navbar/Navbar"
import Hero from "./components/Hero/Hero"
import Features from "./components/Features/Features"
import Statistics from "./components/Statistics/Statistics"
import HowItWorks from "./components/HowItWorks/HowItWorks"
import Testimonials from "./components/Testimonials/Testimonials"
import Footer from "./components/Footer/Footer"
import styles from "./page.module.css"

export default function Home() {
  return (
    <div className={styles.app}>
      <Navbar />
      <main className={styles.main}>
        <Hero />
        <Features />
        <Statistics />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}

