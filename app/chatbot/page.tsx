"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, BookOpen, History, ExternalLink, FileText, Send, Zap } from "lucide-react"
import Navbar from "../components/Navbar/Navbar"
import styles from "./chatbot.module.css"

interface Message {
  text: string
  isUser: boolean
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your AI health assistant powered by advanced medical knowledge. How can I help you today?",
      isUser: false,
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isTyping) return

    setMessages((prev) => [...prev, { text: inputMessage, isUser: true }])
    setInputMessage("")
    setIsTyping(true)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "I understand your concern. Could you provide more details about your symptoms? For example, when did they start, and have you noticed any patterns or triggers?",
          isUser: false,
        },
      ])
      setIsTyping(false)
      typingTimeoutRef.current = null
    }, 2000)
  }

  return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.content}>
          <main className={styles.chatContainer}>
            <div className={styles.header}>
              <div className={styles.botAvatar}>
                <Bot size={24} />
              </div>
              <h2>
                AI Health Assistant
                <div className={styles.status} title="Online"></div>
              </h2>
            </div>
            <div className={styles.messages}>
              {messages.map((message, index) => (
                  <div key={index} className={styles.messageWrapper}>
                    {!message.isUser && (
                        <div className={styles.botAvatar}>
                          <Bot size={20} />
                        </div>
                    )}
                    <div
                        className={`${styles.message} ${
                            message.isUser ? styles.userMessage : styles.assistantMessage
                        }`}
                    >
                      {message.text}
                    </div>
                  </div>
              ))}
              {isTyping && (
                  <div className={styles.messageWrapper}>
                    <div className={styles.botAvatar}>
                      <Bot size={20} />
                    </div>
                    <div className={styles.typing}>
                      <div className={styles.typingDot}></div>
                      <div className={styles.typingDot}></div>
                      <div className={styles.typingDot}></div>
                    </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className={styles.inputContainer}>
              <div className={styles.inputWrapper}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className={styles.input}
                    disabled={isTyping}
                />
              </div>
              <button type="submit" className={styles.button} disabled={!inputMessage.trim() || isTyping}>
                <Send size={18} />
                Send
              </button>
            </form>
          </main>
          <aside className={styles.sidebar}>
            <section className={styles.section}>
              <h2>
                <Zap size={18} />
                Quick Tips
              </h2>
              <ul>
                <li>Be specific about your symptoms</li>
                <li>Mention when symptoms started</li>
                <li>Include any relevant medical history</li>
                <li>Describe symptom severity</li>
              </ul>
            </section>
            <section className={styles.section}>
              <h2>
                <BookOpen size={18} />
                Resources
              </h2>
              <ul>
                <li>
                  <FileText size={16} />
                  <a href="#">
                    Health Guidelines
                    <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <FileText size={16} />
                  <a href="#">
                    Emergency Signs
                    <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <FileText size={16} />
                  <a href="#">
                    Wellness Tips
                    <ExternalLink size={12} />
                  </a>
                </li>
              </ul>
            </section>
            <section className={styles.section}>
              <h2>
                <History size={18} />
                Recent Topics
              </h2>
              <ul>
                <li>Sleep patterns analysis</li>
                <li>Stress management</li>
                <li>Diet recommendations</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
  )
}