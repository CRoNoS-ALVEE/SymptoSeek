"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, BookOpen, History, ExternalLink, FileText } from "lucide-react"
import Navbar from "../components/Navbar/Navbar"
import styles from "./chatbot.module.css"

interface Message {
  text: string
  isUser: boolean
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm your SymptoSeek assistant. How can I help you with your health concerns today?", isUser: false },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isTyping) return

    // Add user message
    setMessages((prev) => [...prev, { text: inputMessage, isUser: true }])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response with typing indicator
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "I understand you're concerned. Could you tell me more about your symptoms? For example, when did they start and are there any specific triggers you've noticed?",
          isUser: false,
        },
      ])
      setIsTyping(false)
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
              <h2>SymptoSeek Assistant</h2>
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
                <div className={styles.svgWrapper1}>
                  <div className={styles.svgWrapper}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                          fill="currentColor"
                          d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <span>Send</span>
              </button>
            </form>
          </main>
          <aside className={styles.sidebar}>
            <section className={styles.section}>
              <h2>
                <BookOpen size={16} />
                Recommended Articles
              </h2>
              <ul>
                <li>
                  <FileText size={14} />
                  <a href="#">
                    Understanding Common Symptoms
                    <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <FileText size={14} />
                  <a href="#">
                    When to Seek Medical Help
                    <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <FileText size={14} />
                  <a href="#">
                    Preventive Health Measures
                    <ExternalLink size={12} />
                  </a>
                </li>
              </ul>
            </section>
            <section className={styles.section}>
              <h2>
                <History size={16} />
                Recent Interactions
              </h2>
              <ul>
                <li>Discussed headache symptoms</li>
                <li>Reviewed sleep patterns</li>
                <li>Analyzed dietary habits</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
  )
}