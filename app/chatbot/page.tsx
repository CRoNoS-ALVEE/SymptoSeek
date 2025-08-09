"use client"

import React, { useState, useRef, useEffect } from "react"
import { Bot, Plus, Mic, Paperclip, Send, MessageSquare, Stethoscope, Menu, X, Search, Bell, User, Settings, LogOut, Home, Calendar, FileText, MapPin, ExternalLink } from "lucide-react"
import styles from "./chatbot.module.css"
import { useRouter } from "next/navigation"
import axios from "axios"
import Link from "next/link"
import Navbar from "../components/Navbar/Navbar"
import Toast from "../components/Toast/Toast"
import NotificationDropdown from "../components/Notifications/NotificationDropdown"
import Loading from "../components/Loading/Loading"
import { API_CONFIG, getApiUrl, getFlaskUrl } from "../../config/api"

// MapComponent for displaying doctor locations
const MapComponent: React.FC<{ mapData: any }> = ({ mapData }) => {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)

  if (!mapData || !mapData.doctors || mapData.doctors.length === 0) {
    return (
      <div className={styles.mapContainer}>
        <div className={styles.mapPlaceholder}>
          <MapPin size={24} />
          <p>No location data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapHeader}>
        <h4>📍 Doctor Locations Near You</h4>
        <p>Click on a doctor below to see their location</p>
      </div>
      
      <div className={styles.doctorsList}>
        {mapData.doctors.map((doctor: any, index: number) => (
          <div 
            key={doctor.id || index}
            className={`${styles.doctorCard} ${selectedDoctor?.id === doctor.id ? styles.selected : ''}`}
            onClick={() => setSelectedDoctor(doctor)}
          >
            <div className={styles.doctorInfo}>
              <h5>{doctor.name}</h5>
              <p className={styles.specialty}>{doctor.specialty}</p>
              <p className={styles.distance}>📍 {doctor.distance} away</p>
              <p className={styles.address}>{doctor.address}</p>
              <p className={styles.phone}>📞 {doctor.phone}</p>
            </div>
            <div className={styles.doctorActions}>
              {doctor.map_url && (
                <a 
                  href={doctor.map_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.mapButton}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={16} />
                  View on Map
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div className={styles.selectedDoctorInfo}>
          <h5>Selected: {selectedDoctor.name}</h5>
          <p>📍 Coordinates: {selectedDoctor.lat.toFixed(4)}, {selectedDoctor.lng.toFixed(4)}</p>
          <div className={styles.mapActions}>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDoctor.lat},${selectedDoctor.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.directionsButton}
            >
              Get Directions
            </a>
            <a 
              href={selectedDoctor.map_url || `https://www.openstreetmap.org/?mlat=${selectedDoctor.lat}&mlon=${selectedDoctor.lng}&zoom=16`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewMapButton}
            >
              View on Map
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

interface Message {
  text?: string
  isUser: boolean
  timestamp: Date
  type?: 'text' | 'doctors' | 'map'
  doctorData?: any[]
  mapData?: {
    center: { lat: number; lng: number }
    doctors: Array<{
      id: number
      name: string
      specialty: string
      distance: string
      lat: number
      lng: number
      address: string
      phone: string
      map_url: string
    }>
  }
}

interface Conversation {
  chat_id: string
  title: string
  last_message: string
  last_updated: string
  message_count: number
}

interface UserLocation {
  latitude: number | null
  longitude: number | null
}

export default function ChatbotPage() {
  const router = useRouter()

  interface User {
    profile_pic?: string
    name?: string
  }

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  
    useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setLoggedIn(false)
        setLoading(false)
        setIsInitialLoading(false)
        return
      }
      try {
        const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.PROFILE), {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(response.data)
        setLoggedIn(true)
      } catch (err) {
        console.error("Failed to fetch user data:", err)
        setError("Failed to fetch user data.")
        setLoggedIn(false)
      } finally {
        setLoading(false)
        setIsInitialLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  // Load chat history when component mounts
  useEffect(() => {
    if (loggedIn && user) {
      loadChatHistory()
    }
  }, [loggedIn, user])

  // Function to load chat history
  const loadChatHistory = async () => {
    setLoadingHistory(true)
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.CHAT.HISTORY), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setConversations(response.data.conversations);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
    } finally {
      setLoadingHistory(false)
    }
  }

  // Function to load messages for a specific chat
  const loadChatMessages = async (chatId: string) => {
    setLoadingMessages(true)
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(getApiUrl(`${API_CONFIG.ENDPOINTS.CHAT.MESSAGES}/${chatId}/messages`), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setCurrentChatId(chatId);
        
        // Convert database messages to frontend format
        const formattedMessages = response.data.messages.map((msg: any) => ({
          text: msg.content,
          isUser: msg.role === 'user',
          timestamp: new Date(msg.timestamp),
          type: msg.message_type || 'text'
        }));
        
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to load chat messages:', error)
      setMessages([{
        text: "Sorry, I couldn't load this conversation. Let's start fresh!",
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      }])
    } finally {
      setLoadingMessages(false)
    }
  }

  // Function to create a new chat
  const createNewChat = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.CHAT.NEW), {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const newChatId = response.data.chat_id;
        setCurrentChatId(newChatId);
        setCurrentConversation(null);
        setMessages([]);
        
        // Refresh chat history
        loadChatHistory();
      }
    } catch (error) {
      console.error('Failed to create new chat:', error)
      // Fallback: generate local chat ID
      const newChatId = `chat_${Date.now()}`
      setCurrentChatId(newChatId)
      setCurrentConversation(null)
      setMessages([])
    }
  }

  // Function to delete a chat
  const deleteChat = async (chatId: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(getApiUrl(`${API_CONFIG.ENDPOINTS.CHAT.DELETE}/${chatId}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove from local state
      setConversations(prev => prev.filter(conv => conv.chat_id !== chatId))
      
      // If this was the current chat, create a new one
      if (currentChatId === chatId) {
        createNewChat();
      }
    } catch (error) {
      console.error('Failed to delete chat:', error)
    }
  }


  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("id")
      setUser(null)
      setLoggedIn(false)
      router.push("/auth")
    }
  }

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)
  const [isSidebarPinned, setIsSidebarPinned] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isMobile, setIsMobile] = useState(true) // Start as true to prevent flash
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  
  // Toast state
  const [toast, setToast] = useState<{
    show: boolean
    title: string
    message: string
    type: 'success' | 'error' | 'info'
  }>({
    show: false,
    title: '',
    message: '',
    type: 'info'
  })

  // Toast helper function
  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, title, message, type })
  }
  
  // File upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [stagedFile, setStagedFile] = useState<File | null>(null) // File ready to send
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<number | null>(null)
  const sidebarTimeoutRef = useRef<number | null>(null)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (window.innerWidth > 768) {
        setIsSidebarHovered(false)
        setIsSidebarPinned(false)
      } else {
        // On mobile, ensure sidebar is closed by default
        setIsSidebarHovered(false)
        setIsSidebarPinned(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mouse area detection for sidebar auto-show/hide
  useEffect(() => {
    if (isMobile || !loggedIn) return

    const handleMouseMove = (e: MouseEvent) => {
      const sidebarTriggerZone = 20 // pixels from left edge
      const sidebarWidth = 280
      
      // Show sidebar when mouse is near left edge or over sidebar
      if (e.clientX <= sidebarTriggerZone || (e.clientX <= sidebarWidth && isSidebarHovered)) {
        if (!isSidebarHovered && !isSidebarPinned) {
          setIsSidebarHovered(true)
        }
      }
      // Hide sidebar when mouse moves away (unless pinned)
      else if (e.clientX > sidebarWidth + 50 && isSidebarHovered && !isSidebarPinned) {
        setIsSidebarHovered(false)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile, loggedIn, isSidebarHovered, isSidebarPinned])

  // Handle click outside notifications - removed as using NotificationDropdown component

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const handleMouseEnterSidebar = () => {
    if (isMobile) return
    if (sidebarTimeoutRef.current) {
      clearTimeout(sidebarTimeoutRef.current)
    }
    setIsSidebarHovered(true)
  }

  const handleMouseLeaveSidebar = () => {
    if (isMobile) return
    if (!isSidebarPinned) {
      sidebarTimeoutRef.current = window.setTimeout(() => {
        setIsSidebarHovered(false)
      }, 300)
    }
  }

  const toggleSidebarPin = () => {
    if (isMobile) {
      const newState = !isSidebarHovered
      setIsSidebarHovered(newState)
      setIsSidebarPinned(false) // Never pin on mobile
      return
    }
    setIsSidebarPinned(!isSidebarPinned)
    if (!isSidebarPinned) {
      setIsSidebarHovered(true)
    }
  }

  // File upload functions
  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  // Process and validate file (for both upload and paste)
  const processFile = (file: File) => {
    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/tiff']
    if (!allowedTypes.includes(file.type)) {
      showToast('Invalid File Type', 'Please upload only PDF or image files (JPEG, JPG, PNG, BMP, TIFF)', 'error')
      return
    }
    
    // Check file size (max 16MB)
    const maxSize = 16 * 1024 * 1024
    if (file.size > maxSize) {
      showToast('File Too Large', 'File size must be less than 16MB', 'error')
      return
    }
    
    // Stage the file instead of immediately uploading
    setStagedFile(file)
    setSelectedFile(file)
  }

  // Handle paste events for images
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault()
        const blob = item.getAsFile()
        if (blob) {
          // Convert blob to File with proper name
          const file = new File([blob], `pasted-image-${Date.now()}.png`, { type: blob.type })
          processFile(file)
        }
        break
      }
    }
  }

  // Remove staged file
  const removeStagedFile = () => {
    setStagedFile(null)
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadFile = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    setIsTyping(true)

    try {
      // Add user message showing file upload
      const fileMessage: Message = {
        text: `📎 Uploading medical report: ${file.name}`,
        isUser: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, fileMessage])

      // Create form data
      const formData = new FormData()
      formData.append('file', file)

      // Upload to Flask backend
      const response = await axios.post(getFlaskUrl(API_CONFIG.ENDPOINTS.FLASK.UPLOAD_REPORT), formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        // Process bot response parts
        const botResponseParts = response.data.bot_response_parts || []
        
        for (const part of botResponseParts) {
          const botMessage: Message = {
            text: part.content,
            isUser: false,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, botMessage])
          
          // Small delay between parts for better UX
          await new Promise(resolve => setTimeout(resolve, 500))
        }

        // Save file upload to chat history if logged in
        if (loggedIn && currentChatId) {
          try {
            await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.CHAT.SAVE), {
              chat_id: currentChatId,
              message: fileMessage.text,
              response: botResponseParts.map((part: any) => part.content).join('\n\n'),
              timestamp: new Date().toISOString()
            }, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            });
            
            // Refresh chat history to show the new messages
            loadChatHistory();
          } catch (saveError) {
            console.error('Error saving file upload to chat history:', saveError);
          }
        }
      } else {
        throw new Error(response.data.error || 'Upload failed')
      }
    } catch (error: any) {
      console.error('File upload error:', error)
      const errorMessage: Message = {
        text: `❌ Sorry, there was an error analyzing your medical report: ${error.response?.data?.error || error.message}`,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsUploading(false)
      setIsTyping(false)
      setSelectedFile(null)
      setStagedFile(null) // Clear staged file after upload
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!inputMessage.trim() && !stagedFile) || isTyping) return

    // Handle file upload if there's a staged file
    if (stagedFile) {
      await uploadFile(stagedFile)
      return
    }

    const newMessage: Message = {
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    }

    setMessages((prev: Message[]) => [...prev, newMessage])
    const userMessage = inputMessage
    setInputMessage("")
    setIsTyping(true)

    // Check for reset command
    if (userMessage.toLowerCase() === 'reset') {
      setMessages([{
        text: "Session has been reset. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      }])
      setIsTyping(false)
      return
    }

    // Handle non-logged-in users
    if (!loggedIn) {
      setTimeout(() => {
        const response = getBotResponse(userMessage);
        
        const botResponse: Message = {
          text: response.text,
          isUser: false,
          timestamp: new Date(),
          type: 'text'
        }
        setMessages((prev: Message[]) => [...prev, botResponse])
        setIsTyping(false)
        
        // Show login modal if suggested by response
        if (response.showModal) {
          setTimeout(() => setShowLoginModal(true), 1000);
        }
      }, 1500)
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Authentication error. Please login again.")
        router.push("/auth")
        return
      }

      // Get user location if available
      let userLocation: UserLocation = { latitude: null, longitude: null }
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject)
          })
          userLocation.latitude = position.coords.latitude
          userLocation.longitude = position.coords.longitude
        } catch (err) {
          console.warn("Could not get location:", err)
        }
      }

      const response = await axios.post(
        getApiUrl(API_CONFIG.ENDPOINTS.CHAT.MESSAGES),  // Changed to dynamic URL
        {
          message: userMessage,
          chat_id: currentChatId,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const data = response.data
      
      // Update current chat ID if returned from backend
      if (data.chat_id && !currentChatId) {
        setCurrentChatId(data.chat_id)
      }

      if (data.bot_response_parts) {
        // Process bot response parts
        for (const part of data.bot_response_parts) {
          if (part.type === 'text') {
            const botResponse: Message = {
              text: part.content,
              isUser: false,
              timestamp: new Date(),
              type: 'text'
            }
            setMessages((prev: Message[]) => [...prev, botResponse])
          } else if (part.type === 'doctors' && Array.isArray(part.content)) {
            // Handle doctors list
            let doctorText = "📋 **Recommended Doctors:**\n\n"
            part.content.forEach((doc: any, index: number) => {
              doctorText += `**${index + 1}. ${doc.name || 'N/A'}**\n`
              doctorText += `   🏥 ${doc.hospital_name || doc.speciality || 'N/A'}\n`
              doctorText += `   📍 Distance: ${doc.distance || 'N/A'}\n`
              doctorText += `   📞 ${doc.number || doc.phone || 'Contact hospital'}\n`
              if (doc.map_url) {
                doctorText += `   🗺️ [View on Map](${doc.map_url})\n`
              }
              doctorText += `\n`
            })
            
            const doctorMessage: Message = {
              text: doctorText,
              isUser: false,
              timestamp: new Date(),
              type: 'doctors',
              doctorData: part.content
            }
            setMessages((prev: Message[]) => [...prev, doctorMessage])
          } else if (part.type === 'map' && part.content) {
            // Handle map display
            const mapMessage: Message = {
              text: "🗺️ **Doctor Locations Map**",
              isUser: false,
              timestamp: new Date(),
              type: 'map',
              mapData: part.content
            }
            setMessages((prev: Message[]) => [...prev, mapMessage])
          }
        }
      } else {
        // Handle cases where bot_response_parts is not available
        const botResponse: Message = {
          text: data.message || "I'm here to help. Could you provide more details about your symptoms?",
          isUser: false,
          timestamp: new Date(),
          type: 'text'
        }
        setMessages((prev: Message[]) => [...prev, botResponse])
      }
    } catch (error: any) {
      console.error('Send message error:', error)
      let errorMessage = "I'm having trouble connecting right now. Please try again."
      
      if (error.response?.status === 401) {
        errorMessage = "Your session has expired. Please login again."
        router.push("/auth")
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      const errorResponse: Message = {
        text: errorMessage,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      }
      setMessages((prev: Message[]) => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const startNewConversation = () => {
    createNewChat()
  }

  const selectConversation = (conversationId: string) => {
    setCurrentConversation(conversationId)
    setCurrentChatId(conversationId)
    loadChatMessages(conversationId)
  }

  const quickActions = [
    "I have a headache",
    "I'm feeling nauseous", 
    "I have chest pain",
    "I have a fever",
    "I have stomach pain",
    "Find doctors near me"
  ]

  // Notification functionality moved to NotificationDropdown component

  const formatTime = (dateInput: Date | string) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const handleQuickAction = (action: string) => {
    setInputMessage(action)
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent
    handleSubmit(syntheticEvent)
  }

  // Bot response function for non-logged-in users
  const getBotResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase().trim();
    
    // Greeting responses
    if (message.includes('hi') || message.includes('hello') || message.includes('hey') || 
        message.includes('good morning') || message.includes('good afternoon') || 
        message.includes('good evening') || message === 'sup') {
      return {
        text: "Hello! 👋 Nice to meet you! I'm SymptoSeek AI, your health companion. To get personalized health advice and doctor recommendations, please log in first. If you're new here, signing up is very easy! Would you like to continue?",
        showModal: true
      };
    }
    
    // Thank you responses  
    if (message.includes('thank') || message.includes('thanks')) {
      return {
        text: "You're welcome! 😊 For better health insights and personalized care, consider creating an account with us. It's quick and easy!",
        showModal: true
      };
    }
    
    // Health-related queries
    if (message.includes('pain') || message.includes('hurt') || message.includes('sick') ||
        message.includes('fever') || message.includes('headache') || message.includes('doctor') ||
        message.includes('symptom') || message.includes('health')) {
      return {
        text: "I understand you're looking for health guidance. While I can provide general information, for accurate diagnosis and personalized treatment recommendations, please log in first. If you're a new user, signing up is very easy and takes just a minute!",
        showModal: true
      };
    }
    
    // Default response for other queries
    return {
      text: "I can help you with health-related questions, but to provide personalized advice and local doctor recommendations, please log in first. If you're new here, signing up is very easy! Would you like to continue?",
      showModal: true
    };
  }

  // Modal handlers for non-logged-in users
  const handleLoginRedirect = () => {
    setShowLoginModal(false)
    router.push('/auth')
  }

  const handleContinueWithoutLogin = () => {
    setShowLoginModal(false)
    // Add a message to chat explaining limited functionality
    const botResponse: Message = {
      text: "Alright! You can continue chatting, but please note that I can only provide general health information without personalized recommendations. For the best experience, consider signing up later! 😊",
      isUser: false,
      timestamp: new Date()
    }
    setMessages((prev: Message[]) => [...prev, botResponse])
  }

  // Show loading spinner during initial load
  if (isInitialLoading) {
    return <Loading />
  }

  return (
      <div className={styles.container}>
        {/* Always show navbar */}
        {loggedIn ? (
            /* Top Navbar for logged in users */
            <div className={`${styles.topNavbar} ${styles.darkNavbar}`}>
              <div className={styles.navbarContent}>
                <div className={styles.navbarLeft}>
                  <div
                      className={styles.sidebarTrigger}
                      onClick={toggleSidebarPin}
                  >
                    <Menu size={20} />
                  </div>
                  <div className={styles.logoContainer}>
                    <div className={styles.logoIcon}>
                      <Stethoscope size={20} />
                    </div>
                    <span className={styles.logoText}>SymptoSeek</span>
                  </div>
                </div>
                <div className={styles.navbarRight}>
                  <NotificationDropdown />
                  <Link href="/profile" className={styles.userProfile}>
                    <img
                        src={user?.profile_pic || "https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?w=740"}
                        alt="Profile"
                        className={styles.profileImage}
                    />
                  </Link>
                </div>
              </div>
            </div>
        ) : (
            /* Regular navbar for non-logged users */
            <Navbar
                isLoggedIn={false}
                onLogout={handleLogout}
            />
        )}

        {loggedIn && (
            /* Sidebar only for logged in users */
            <div
                className={`${styles.sidebar} ${(isSidebarHovered || isSidebarPinned) ? styles.sidebarExpanded : ''}`}
                onMouseEnter={!isMobile ? handleMouseEnterSidebar : undefined}
                onMouseLeave={!isMobile ? handleMouseLeaveSidebar : undefined}
            >
              <div className={styles.sidebarContent}>
                <div className={styles.sidebarTop}>
                  <div className={styles.sidebarSearch}>
                    <Search size={16} />
                    <input type="text" placeholder="Search..." />
                  </div>
                </div>

                <div className={styles.sidebarHeader}>
                  <button className={styles.newChatButton} onClick={startNewConversation}>
                    <Plus size={18} />
                    <span>New chat</span>
                  </button>
                </div>

                <div className={styles.conversationsList}>
                  {loadingHistory ? (
                    <div className={styles.loadingHistory}>
                      <div className={styles.loadingSpinner}></div>
                      <p>Loading chat history...</p>
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className={styles.emptyHistory}>
                      <p>No previous conversations</p>
                      <p>Start a new chat to begin!</p>
                    </div>
                  ) : (
                    conversations.map((conversation) => (
                      <div
                          key={conversation.chat_id}
                          className={`${styles.conversationItem} ${currentConversation === conversation.chat_id ? styles.active : ''}`}
                          onClick={() => selectConversation(conversation.chat_id)}
                      >
                        <div className={styles.conversationContent}>
                          <div className={styles.conversationTitle}>{conversation.title}</div>
                          <div className={styles.conversationPreview}>{conversation.last_message}</div>
                          <div className={styles.conversationMeta}>
                            <span className={styles.conversationTime}>{formatTime(conversation.last_updated)}</span>
                            <span className={styles.messageCount}>{conversation.message_count} messages</span>
                          </div>
                        </div>
                        <button 
                          className={styles.deleteButton}
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteChat(conversation.chat_id, e)
                          }}
                          title="Delete conversation"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className={styles.sidebarBottom}>
                  <Link href="/dashboard" className={styles.sidebarNavItem}>
                    <Home size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/profile" className={styles.sidebarNavItem}>
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                  <Link href="/settings" className={styles.sidebarNavItem}>
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                  <button onClick={handleLogout} className={styles.sidebarNavItem}>
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Main Chat Area */}
        <div className={`${styles.mainChat} ${loggedIn ? styles.loggedInLayout : styles.notLoggedInLayout} ${loggedIn && (isSidebarHovered || isSidebarPinned) && !isMobile ? styles.withSidebar : ''}`}>
          {!currentConversation && messages.length === 0 ? (
              // Welcome Screen
              <div
                  className={`${styles.welcomeScreen} ${!loggedIn ? styles.welcomeScreenNotLoggedIn : ''}`}
              >
                <div className={styles.welcomeContent}>
                  <div className={styles.welcomeHeader}>
                    <h1>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}{user?.name ? `, ${user.name}` : ''}!</h1>
                    <p>{loggedIn ? 'What can I help you with today?' : 'Get AI-powered health insights. Sign up for personalized recommendations!'}</p>
                  </div>

                  <div className={styles.quickActions}>
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            className={styles.quickActionButton}
                            onClick={() => handleQuickAction(action)}
                        >
                          {action}
                        </button>
                    ))}
                  </div>

                  {/* File Upload Section for Welcome Screen */}
                  <div className={styles.welcomeFileUpload}>
                    {/* <div className={styles.fileUploadHeader}>
                      <h3>📋 Upload Medical Report</h3>
                      <p>Upload your medical reports, lab results, or prescriptions for instant AI analysis</p>
                    </div> */}
                    {/* <button 
                      className={styles.welcomeFileButton}
                      onClick={handleFileButtonClick}
                      disabled={isUploading}
                    >
                      <Paperclip size={20} />
                      {isUploading ? 'Uploading...' : 'Choose Medical Report'}
                      <span className={styles.fileFormats}>(PDF, JPEG, PNG)</span>
                    </button> */}
                    {selectedFile && (
                      <div className={styles.selectedFileInfo}>
                        <span>Selected: {selectedFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.inputSection}>
                  {/* File Preview Section */}
                  {stagedFile && (
                    <div className={styles.filePreview}>
                      <div className={styles.filePreviewContent}>
                        <div className={styles.fileIcon}>
                          <Paperclip size={16} />
                        </div>
                        <div className={styles.fileInfo}>
                          <span className={styles.fileName}>{stagedFile.name}</span>
                          <span className={styles.fileSize}>
                            {(stagedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>
                        <button 
                          type="button"
                          className={styles.removeFileButton}
                          onClick={removeStagedFile}
                          title="Remove file"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className={styles.inputContainer}>
                    <div className={styles.inputWrapper}>
                      <input
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onPaste={handlePaste}
                          placeholder={stagedFile ? `Press Enter to send ${stagedFile.name}` : "Ask anything..."}
                          className={styles.input}
                          disabled={isTyping}
                      />
                      <div className={styles.inputActions}>
                        <button
                          type="button" 
                          className={styles.actionButton}
                          onClick={handleFileButtonClick}
                          disabled={isUploading}
                          title="Upload medical report (PDF, JPEG, PNG)"
                        >
                          <Paperclip size={18} />
                        </button>
                        <button 
                          type="button" 
                          className={styles.actionButton}
                          title="Voice input (coming soon)"
                        >
                          <Mic size={18} />
                        </button>
                        <button 
                          type="submit" 
                          className={styles.sendButton} 
                          disabled={(!inputMessage.trim() && !stagedFile) || isTyping}
                          title="Send message"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className={styles.disclaimer}>
                    <Stethoscope size={16} />
                    <span>{loggedIn 
                      ? 'SymptoSeek uses AI. Check for mistakes. Conversations are used to train AI and SymptoSeek can learn about your health patterns.'
                      : 'SymptoSeek uses AI. Check for mistakes. Sign up for personalized health tracking and doctor recommendations.'
                    }</span>
                  </div>
                </div>
              </div>
          ) : (
              // Chat Messages
              <div className={styles.chatMessages}>
                <div className={styles.messagesContainer}>
                  {messages.map((message, index) => (
                      <div key={index} className={styles.messageWrapper}>
                        {!message.isUser && (
                            <div className={styles.botAvatar}>
                              <Stethoscope size={20} />
                            </div>
                        )}
                        <div className={`${styles.message} ${message.isUser ? styles.userMessage : styles.assistantMessage}`}>
                          {message.type === 'map' && message.mapData ? (
                            <MapComponent mapData={message.mapData} />
                          ) : (
                            <div className={styles.messageText}>
                              {message.text?.split('\n').map((line, lineIndex) => {
                                // Enhanced text formatting for better readability
                                if (line.startsWith('**') && line.endsWith('**')) {
                                  return <strong key={lineIndex}>{line.slice(2, -2)}</strong>
                                }
                                if (line.startsWith('# ')) {
                                  return <h3 key={lineIndex} className={styles.messageHeading}>{line.slice(2)}</h3>
                                }
                                if (line.startsWith('## ')) {
                                  return <h4 key={lineIndex} className={styles.messageSubheading}>{line.slice(3)}</h4>
                                }
                                if (line.startsWith('• ')) {
                                  return <div key={lineIndex} className={styles.messageBullet}>• {line.slice(2)}</div>
                                }
                                if (line.includes('🔗') || line.includes('[') && line.includes('](')) {
                                  // Handle markdown links
                                  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
                                  const parts = line.split(linkRegex)
                                  return (
                                    <p key={lineIndex}>
                                      {parts.map((part, partIndex) => {
                                        if (partIndex % 3 === 1) {
                                          return (
                                            <a 
                                              key={partIndex}
                                              href={parts[partIndex + 1]}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className={styles.messageLink}
                                            >
                                              {part}
                                            </a>
                                          )
                                        } else if (partIndex % 3 === 2) {
                                          return null // Skip URL part
                                        }
                                        return part
                                      })}
                                    </p>
                                  )
                                }
                                return line ? <p key={lineIndex}>{line}</p> : <br key={lineIndex} />
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                  ))}
                  {isTyping && (
                      <div className={styles.messageWrapper}>
                        <div className={styles.botAvatar}>
                          <Stethoscope size={20} />
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

                <div className={styles.inputSection}>
                  {/* File Preview Section */}
                  {stagedFile && (
                    <div className={styles.filePreview}>
                      <div className={styles.filePreviewContent}>
                        <div className={styles.fileIcon}>
                          <Paperclip size={16} />
                        </div>
                        <div className={styles.fileInfo}>
                          <span className={styles.fileName}>{stagedFile.name}</span>
                          <span className={styles.fileSize}>
                            {(stagedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>
                        <button 
                          type="button"
                          className={styles.removeFileButton}
                          onClick={removeStagedFile}
                          title="Remove file"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className={styles.inputContainer}>
                    <div className={styles.inputWrapper}>
                      <input
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onPaste={handlePaste}
                          placeholder={stagedFile ? `Press Enter to send ${stagedFile.name}` : "Ask anything..."}
                          className={styles.input}
                          disabled={isTyping}
                      />
                      <div className={styles.inputActions}>
                        <button 
                          type="button" 
                          className={styles.actionButton}
                          onClick={handleFileButtonClick}
                          disabled={isUploading || isTyping}
                          title="Upload medical report (PDF, JPEG, PNG)"
                        >
                          <Paperclip size={18} />
                        </button>
                        <button 
                          type="button" 
                          className={styles.actionButton}
                          title="Voice input (coming soon)"
                        >
                          <Mic size={18} />
                        </button>
                        <button 
                          type="submit" 
                          className={styles.sendButton} 
                          disabled={(!inputMessage.trim() && !stagedFile) || isTyping}
                          title="Send message"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
          )}
        </div>

        {/* Overlay for mobile sidebar */}
        {loggedIn && isMobile && isSidebarHovered && (
            <div className={styles.sidebarOverlay} onClick={() => {
              setIsSidebarHovered(false)
              setIsSidebarPinned(false)
            }} />
        )}

        {/* Login Modal for non-logged-in users */}
        {!loggedIn && showLoginModal && (
            <div 
                className={styles.modalOverlay}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setShowLoginModal(false);
                    }
                }}
            >
                <div className={styles.modalContent}>
                    <button
                        onClick={() => setShowLoginModal(false)}
                        className={styles.closeButton}
                    >
                        <X size={20} />
                    </button>
                    
                    <div className={styles.modalHeader}>
                        <div className={styles.modalIcon}>
                            <Stethoscope />
                        </div>
                        <h3 className={styles.modalTitle}>
                            Welcome to SymptoSeek!
                        </h3>
                        <p className={styles.modalDescription}>
                            Sign in to unlock personalized health recommendations, save your chat history, and get the most accurate medical guidance.
                        </p>
                    </div>
                    
                    <div className={styles.modalActions}>
                        <button
                            onClick={handleLoginRedirect}
                            className={styles.primaryButton}
                        >
                            <User size={20} />
                            Sign In to Continue
                        </button>
                        
                        <div className={styles.divider}>
                            <span className={styles.dividerText}>or</span>
                        </div>
                        
                        <button
                            onClick={handleContinueWithoutLogin}
                            className={styles.secondaryButton}
                        >
                            Continue as Guest
                        </button>
                    </div>
                    
                    <div className={styles.modalFooter}>
                        <p>🔒 Your privacy is our priority. All data is encrypted and secure.</p>
                    </div>
                </div>
            </div>
        )}

        {/* Global hidden file input for both welcome screen and chat */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.bmp,.tiff"
          onChange={handleFileChange}
          className={styles.hiddenFileInput}
          title="Select medical report file"
          aria-label="Select medical report file for upload"
        />

        {/* Toast component */}
        <Toast
          isOpen={toast.show}
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      </div>
  )
}