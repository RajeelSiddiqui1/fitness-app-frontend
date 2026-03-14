import React, { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { axiosInstance } from "../lib/axios"
import { toast } from "react-hot-toast"
import { MessageCircle, Send, Mail, User, AlertCircle } from "lucide-react"

const Support = () => {
  const { user } = useAuth()
  const [issueType, setIssueType] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const issueTypes = [
    { value: "account", label: "Account Issues" },
    { value: "workout", label: "Workout Related" },
    { value: "nutrition", label: "Nutrition Related" },
    { value: "progress", label: "Progress Tracking" },
    { value: "technical", label: "Technical Problem" },
    { value: "feedback", label: "Feedback & Suggestions" },
    { value: "other", label: "Other" }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!issueType) {
      toast.error("Please select an issue type")
      return
    }

    if (!message.trim()) {
      toast.error("Please describe your problem")
      return
    }

    if (message.trim().length < 10) {
      toast.error("Please provide more details (at least 10 characters)")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await axiosInstance.post("/support/submit", {
        issueType,
        message
      })

      toast.success(response.data.message || "Support request submitted successfully!")
      setIssueType("")
      setMessage("")
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to submit support request"
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div 
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #FF69B4, #FF1493)" }}
        >
          <MessageCircle size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--theme-text)" }}>
          R-fit Support
        </h1>
        <p style={{ color: "var(--theme-textSecondary)" }}>
          We're here to help! Fill out the form below and we'll get back to you.
        </p>
      </div>

      <div 
        className="rounded-2xl p-6"
        style={{ 
          background: "var(--theme-card)", 
          border: "1px solid var(--theme-border)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Info (Read-only from session) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label 
                className="block text-sm font-medium mb-2 flex items-center gap-2"
                style={{ color: "var(--theme-textSecondary)" }}
              >
                <User size={16} />
                Name
              </label>
              <input
                type="text"
                value={user?.userName || ""}
                readOnly
                className="w-full px-4 py-3 rounded-xl cursor-not-allowed"
                style={{ 
                  background: "var(--theme-input-bg)",
                  border: "1px solid var(--theme-border)",
                  color: "var(--theme-text)"
                }}
              />
            </div>
            <div>
              <label 
                className="block text-sm font-medium mb-2 flex items-center gap-2"
                style={{ color: "var(--theme-textSecondary)" }}
              >
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full px-4 py-3 rounded-xl cursor-not-allowed"
                style={{ 
                  background: "var(--theme-input-bg)",
                  border: "1px solid var(--theme-border)",
                  color: "var(--theme-text)"
                }}
              />
            </div>
          </div>

          {/* Issue Type Dropdown */}
          <div>
            <label 
              className="block text-sm font-medium mb-2 flex items-center gap-2"
              style={{ color: "var(--theme-textSecondary)" }}
            >
              <AlertCircle size={16} />
              Select Issue Type
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl"
              style={{ 
                background: "var(--theme-input-bg)",
                border: "1px solid var(--theme-border)",
                color: "var(--theme-text)",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                backgroundSize: "16px"
              }}
            >
              <option value="" disabled style={{ background: "var(--theme-card)", color: "var(--theme-text)" }}>Choose an option...</option>
              {issueTypes.map((type) => (
                <option key={type.value} value={type.value} style={{ background: "var(--theme-card)", color: "var(--theme-text)" }}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message Textarea */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--theme-textSecondary)" }}
            >
              Describe Your Problem
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe your issue in detail..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl resize-none"
              style={{ 
                background: "var(--theme-input-bg)",
                border: "1px solid var(--theme-border)",
                color: "var(--theme-text)"
              }}
            />
            <p className="text-xs mt-2" style={{ color: "var(--theme-textSecondary)" }}>
              Minimum 10 characters. Please provide as much detail as possible.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200"
            style={{ 
              background: "linear-gradient(135deg, #FF69B4, #FF1493)",
              color: "white"
            }}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={20} />
                Submit Request
              </>
            )}
          </button>
        </form>

        {/* Info Box */}
        <div 
          className="mt-6 p-4 rounded-xl"
          style={{ background: "rgba(255, 105, 180, 0.1)" }}
        >
          <p className="text-sm" style={{ color: "var(--theme-textSecondary)" }}>
            <strong>Note:</strong> You'll receive a confirmation email at your registered email address. 
            Our team typically responds within 24-48 hours.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Support
