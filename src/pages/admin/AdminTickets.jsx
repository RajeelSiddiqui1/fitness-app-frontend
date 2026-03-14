import React, { useState, useEffect } from "react"
import { axiosInstance } from "../../lib/axios"
import { toast } from "react-hot-toast"
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MessageCircle,
  Send,
  User,
  Mail,
  Calendar
} from "lucide-react"

const AdminTickets = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [responseText, setResponseText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchTickets()
  }, [statusFilter])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== "all") {
        params.append("status", statusFilter)
      }
      const response = await axiosInstance.get(`/support/admin/tickets?${params}`)
      setTickets(response.data.tickets)
    } catch (error) {
      console.error("Failed to fetch tickets:", error)
      toast.error("Failed to fetch tickets")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      setSubmitting(true)
      await axiosInstance.put(`/support/admin/ticket/${ticketId}`, {
        status: newStatus,
        adminResponse: responseText
      })
      toast.success("Ticket updated successfully")
      setResponseText("")
      fetchTickets()
      if (selectedTicket) {
        const updated = tickets.find(t => t._id === ticketId)
        if (updated) setSelectedTicket({ ...updated, status: newStatus })
      }
    } catch (error) {
      toast.error("Failed to update ticket")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock size={16} className="text-yellow-500" />
      case "in_progress": return <AlertCircle size={16} className="text-purple-500" />
      case "resolved": return <CheckCircle size={16} className="text-green-500" />
      case "closed": return <XCircle size={16} className="text-gray-500" />
      default: return <Clock size={16} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return { bg: "rgba(234, 179, 8, 0.2)", text: "#eab308" }
      case "in_progress": return { bg: "rgba(168, 85, 247, 0.2)", text: "#a855f7" }
      case "resolved": return { bg: "rgba(34, 197, 94, 0.2)", text: "#22c55e" }
      case "closed": return { bg: "rgba(107, 114, 128, 0.2)", text: "#6b7280" }
      default: return { bg: "rgba(107, 114, 128, 0.2)", text: "#6b7280" }
    }
  }

  const getIssueTypeLabel = (type) => {
    const labels = {
      account: "Account Issues",
      workout: "Workout Related",
      nutrition: "Nutrition Related",
      progress: "Progress Tracking",
      technical: "Technical Problem",
      feedback: "Feedback & Suggestions",
      other: "Other"
    }
    return labels[type] || type
  }

  const filteredTickets = tickets.filter(ticket => 
    ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: "var(--theme-text)" }}>
          Support Tickets
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--theme-textSecondary)" }}
          />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl"
            style={{ 
              background: "var(--theme-input-bg)",
              border: "1px solid var(--theme-border)",
              color: "var(--theme-text)"
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} style={{ color: "var(--theme-textSecondary)" }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl"
            style={{ 
              background: "var(--theme-input-bg)",
              border: "1px solid var(--theme-border)",
              color: "var(--theme-text)"
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredTickets.length === 0 ? (
            <div 
              className="text-center py-8 rounded-xl"
              style={{ background: "var(--theme-card)", border: "1px solid var(--theme-border)" }}
            >
              <MessageCircle size={48} className="mx-auto mb-2 opacity-50" style={{ color: "var(--theme-textSecondary)" }} />
              <p style={{ color: "var(--theme-textSecondary)" }}>No tickets found</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => {
              const statusColors = getStatusColor(ticket.status)
              return (
                <div
                  key={ticket._id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="p-4 rounded-xl cursor-pointer transition-all"
                  style={{ 
                    background: selectedTicket?._id === ticket._id 
                      ? "linear-gradient(135deg, rgba(255, 105, 180, 0.2), rgba(255, 20, 147, 0.1))"
                      : "var(--theme-card)",
                    border: selectedTicket?._id === ticket._id 
                      ? "1px solid #FF69B4"
                      : "1px solid var(--theme-border)"
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold" style={{ color: "var(--theme-text)" }}>
                      {ticket.userName}
                    </h3>
                    {getStatusIcon(ticket.status)}
                  </div>
                  <p className="text-sm mb-2" style={{ color: "var(--theme-textSecondary)" }}>
                    {getIssueTypeLabel(ticket.issueType)}
                  </p>
                  <p className="text-sm line-clamp-2" style={{ color: "var(--theme-textSecondary)" }}>
                    {ticket.message}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ background: statusColors.bg, color: statusColors.text }}
                    >
                      {ticket.status}
                    </span>
                    <span className="text-xs" style={{ color: "var(--theme-textSecondary)" }}>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Ticket Details */}
        <div 
          className="lg:col-span-2 rounded-xl p-6"
          style={{ 
            background: "var(--theme-card)", 
            border: "1px solid var(--theme-border)" 
          }}
        >
          {selectedTicket ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--theme-text)" }}>
                    {selectedTicket.userName}
                  </h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-sm" style={{ color: "var(--theme-textSecondary)" }}>
                      <Mail size={14} />
                      {selectedTicket.userEmail}
                    </span>
                    <span className="flex items-center gap-1 text-sm" style={{ color: "var(--theme-textSecondary)" }}>
                      <Calendar size={14} />
                      {new Date(selectedTicket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span 
                  className="px-3 py-1 rounded-full flex items-center gap-1"
                  style={{ 
                    background: getStatusColor(selectedTicket.status).bg, 
                    color: getStatusColor(selectedTicket.status).text 
                  }}
                >
                  {getStatusIcon(selectedTicket.status)}
                  {selectedTicket.status}
                </span>
              </div>

              <div 
                className="p-4 rounded-xl"
                style={{ background: "var(--theme-input-bg)" }}
              >
                <p className="text-sm font-medium mb-2" style={{ color: "var(--theme-textSecondary)" }}>
                  Issue Type: {getIssueTypeLabel(selectedTicket.issueType)}
                </p>
                <p style={{ color: "var(--theme-text)" }}>{selectedTicket.message}</p>
              </div>

              {selectedTicket.adminResponse && (
                <div 
                  className="p-4 rounded-xl"
                  style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)" }}
                >
                  <p className="text-sm font-medium mb-2" style={{ color: "#22c55e" }}>
                    Admin Response:
                  </p>
                  <p style={{ color: "var(--theme-text)" }}>{selectedTicket.adminResponse}</p>
                </div>
              )}

              {/* Response Form */}
              <div className="space-y-3">
                <label className="text-sm font-medium" style={{ color: "var(--theme-textSecondary)" }}>
                  Update Status & Response
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Write your response to the user..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl resize-none"
                  style={{ 
                    background: "var(--theme-input-bg)",
                    border: "1px solid var(--theme-border)",
                    color: "var(--theme-text)"
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusUpdate(selectedTicket._id, "in_progress")}
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl font-medium flex items-center gap-2"
                    style={{ background: "rgba(168, 85, 247, 0.2)", color: "#a855f7" }}
                  >
                    <AlertCircle size={16} />
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedTicket._id, "resolved")}
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl font-medium flex items-center gap-2"
                    style={{ background: "rgba(34, 197, 94, 0.2)", color: "#22c55e" }}
                  >
                    <CheckCircle size={16} />
                    Resolved
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedTicket._id, "closed")}
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl font-medium flex items-center gap-2"
                    style={{ background: "rgba(107, 114, 128, 0.2)", color: "#6b7280" }}
                  >
                    <XCircle size={16} />
                    Closed
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <MessageCircle size={64} className="mb-4 opacity-30" style={{ color: "var(--theme-textSecondary)" }} />
              <p style={{ color: "var(--theme-textSecondary)" }}>Select a ticket to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminTickets
