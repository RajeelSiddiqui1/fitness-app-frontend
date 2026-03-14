import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { axiosInstance } from "../../lib/axios"
import { 
  Users, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Activity
} from "lucide-react"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get("/support/admin/stats")
      setStats(response.data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const statCards = [
    { 
      title: "Total Tickets", 
      value: stats?.stats?.total || 0, 
      icon: MessageCircle, 
      color: "bg-blue-500" 
    },
    { 
      title: "Pending", 
      value: stats?.stats?.pending || 0, 
      icon: Clock, 
      color: "bg-yellow-500" 
    },
    { 
      title: "In Progress", 
      value: stats?.stats?.inProgress || 0, 
      icon: Activity, 
      color: "bg-purple-500" 
    },
    { 
      title: "Resolved", 
      value: stats?.stats?.resolved || 0, 
      icon: CheckCircle, 
      color: "bg-green-500" 
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: "var(--theme-text)" }}>
          Admin Dashboard
        </h1>
        <button
          onClick={() => navigate("/admin/tickets")}
          className="px-4 py-2 rounded-xl font-medium flex items-center gap-2"
          style={{ background: "linear-gradient(135deg, #FF69B4, #FF1493)", color: "white" }}
        >
          <MessageCircle size={18} />
          View All Tickets
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="rounded-xl p-5"
              style={{ 
                background: "var(--theme-card)", 
                border: "1px solid var(--theme-border)" 
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: "var(--theme-textSecondary)" }}>
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-1" style={{ color: "var(--theme-text)" }}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets by Type */}
        <div 
          className="rounded-xl p-5"
          style={{ 
            background: "var(--theme-card)", 
            border: "1px solid var(--theme-border)" 
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--theme-text)" }}>
            Tickets by Type
          </h2>
          <div className="space-y-3">
            {stats?.ticketsByType?.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span style={{ color: "var(--theme-textSecondary)" }}>
                  {getIssueTypeLabel(item._id)}
                </span>
                <div className="flex items-center gap-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${(item.count / (stats?.stats?.total || 1)) * 100}%`,
                      background: "linear-gradient(135deg, #FF69B4, #FF1493)" 
                    }}
                  />
                  <span className="font-medium" style={{ color: "var(--theme-text)" }}>
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tickets */}
        <div 
          className="rounded-xl p-5"
          style={{ 
            background: "var(--theme-card)", 
            border: "1px solid var(--theme-border)" 
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--theme-text)" }}>
            Recent Tickets
          </h2>
          <div className="space-y-3">
            {stats?.recentTickets?.map((ticket) => (
              <div 
                key={ticket._id}
                className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:opacity-80"
                style={{ background: "var(--theme-input-bg)" }}
                onClick={() => navigate(`/admin/tickets?id=${ticket._id}`)}
              >
                <div>
                  <p className="font-medium" style={{ color: "var(--theme-text)" }}>
                    {ticket.userName}
                  </p>
                  <p className="text-sm" style={{ color: "var(--theme-textSecondary)" }}>
                    {getIssueTypeLabel(ticket.issueType)}
                  </p>
                </div>
                <span 
                  className="px-2 py-1 text-xs rounded-full"
                  style={{ 
                    background: ticket.status === "pending" ? "rgba(234, 179, 8, 0.2)" : 
                               ticket.status === "resolved" ? "rgba(34, 197, 94, 0.2)" :
                               "rgba(168, 85, 247, 0.2)",
                    color: ticket.status === "pending" ? "#eab308" : 
                           ticket.status === "resolved" ? "#22c55e" :
                           "#a855f7"
                  }}
                >
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
