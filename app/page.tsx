import Navbar from "./components/Navbar/Navbar"
import Hero from "./components/Hero/Hero"
import Features from "./components/Features/Features"
import Footer from "./components/Footer/Footer"
import styles from "./page.module.css"

export default function Home() {
  return (
    <div className={styles.app}>
      <Navbar />
      <main className={styles.main}>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  )
}

