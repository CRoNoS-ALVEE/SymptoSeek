"use client"

import React from 'react'
import styles from './Loading.module.css'

interface LoadingProps {
  fullScreen?: boolean
  className?: string
}

export default function Loading({ fullScreen = true, className = '' }: LoadingProps) {
  const containerClass = fullScreen ? styles.fullScreenContainer : styles.container

  return (
    <div className={`${containerClass} ${className}`}>
      <div id="page" className={styles.page}>
        <div id="container" className={styles.container}>
          <div id="ring" className={styles.ring}></div>
          <div id="ring" className={styles.ring}></div>
          <div id="ring" className={styles.ring}></div>
          <div id="ring" className={styles.ring}></div>
          <div id="h3" className={styles.loadingText}>loading</div>
        </div>
      </div>
    </div>
  )
}
