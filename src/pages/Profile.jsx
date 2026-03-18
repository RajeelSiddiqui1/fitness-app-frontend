// pages/Profile.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  MapPin,
  Globe,
  Calendar,
  Edit2,
  Save,
  X,
  Camera,
  Ruler,
  Weight,
  Bell,
  Mail as MailIcon,
  Moon,
  Sun,
  Check,
  Users,
  ChevronLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";
import GlassCard from "../components/GlassCard";
import ThemeToggle from "../components/ThemeToggle";
import FollowersModal from "../components/FollowersModal";
import FollowingModal from "../components/FollowingModal";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { axiosInstance } from "../lib/axios";

// Get gender-based default avatar
const getDefaultAvatar = (gender) => {
  const avatarBaseUrl = import.meta.env.VITE_AVATAR_PLACEHOLDER_URL || 'https://avatar-placeholder.iran.liara.run/avatars/';
  const genderKey = gender?.toLowerCase() || 'male';
  return `${avatarBaseUrl}?gender=${genderKey}`;
};

const Profile = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user: authUser, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    age: "",
    country: "",
    city: "",
    gender: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Fetch user data only once on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        if (response.data.user) {
          const userData = response.data.user;
          const newFormData = {
            email: userData.email || "",
            age: userData.age || "",
            country: userData.country || "",
            city: userData.city || "",
            gender: userData.gender || "",
          };
          setFormData(newFormData);
          setAvatarPreview(userData.avatar || "");
          updateUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to auth context data
        if (authUser) {
          setFormData({
            email: authUser.email || "",
            age: authUser.age || "",
            country: authUser.country || "",
            city: authUser.city || "",
            gender: authUser.gender || "",
          });
          setAvatarPreview(authUser.avatar || "");
        }
      } finally {
        setInitialDataLoaded(true);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array - run only once on mount

  // Update form data when authUser changes but only if not in edit mode
  useEffect(() => {
    if (authUser && !editMode && initialDataLoaded) {
      setFormData({
        email: authUser.email || "",
        age: authUser.age || "",
        country: authUser.country || "",
        city: authUser.city || "",
        gender: authUser.gender || "",
      });
      setAvatarPreview(authUser.avatar || "");
    }
  }, [authUser, editMode, initialDataLoaded]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Append avatar if changed
      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile);
      }

      const response = await axiosInstance.put(
        "/auth/update-profile",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.user) {
        // Update user in auth context
        updateUser(response.data.user);
        
        // Update local storage
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Update form data with response
        setFormData({
          email: response.data.user.email || "",
          age: response.data.user.age || "",
          country: response.data.user.country || "",
          city: response.data.user.city || "",
          gender: response.data.user.gender || "",
        });
        
        setAvatarPreview(response.data.user.avatar || "");
        
        toast.success("Profile updated successfully!");
        setEditMode(false);
        setAvatarFile(null);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setAvatarFile(null);
    // Reset to original authUser data
    if (authUser) {
      setAvatarPreview(authUser.avatar || "");
      setFormData({
        email: authUser.email || "",
        age: authUser.age || "",
        country: authUser.country || "",
        city: authUser.city || "",
        gender: authUser.gender || "",
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!authUser && !initialDataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 md:p-6"
      style={{ background: "var(--theme-bg)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-white/5 transition-colors"
              style={{ color: "var(--theme-textSecondary)" }}
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold gradient-text">
              My Profile
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl btn-primary"
              >
                <Edit2 size={18} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={() => setEditMode(false)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "var(--theme-text)",
                }}
              >
                <X size={18} />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Avatar & Basic Info */}
          <div className="md:col-span-1">
            <GlassCard className="p-4 md:p-6">
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="relative mb-4 group">
                  <div
                    className="w-32 h-32 rounded-full overflow-hidden border-4"
                    style={{ borderColor: "var(--theme-primary)" }}
                  >
                    {avatarPreview ? (
                      <img
                        src={
                          avatarPreview.startsWith("data:")
                            ? avatarPreview
                            : `https://fitness-app-backend-navy.vercel.app/${avatarPreview}`
                        }
                        alt={authUser?.userName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-4xl font-bold text-white" style="background: ${theme.gradient}">${authUser?.userName?.charAt(0).toUpperCase()}</div>`;
                        }}
                      />
                    ) : (
                      <img
                        src={getDefaultAvatar(authUser?.gender)}
                        alt={authUser?.userName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-4xl font-bold text-white" style="background: ${theme.gradient}">${authUser?.userName?.charAt(0).toUpperCase()}</div>`;
                        }}
                      />
                    )}
                  </div>

                 
                </div>

                <h2
                  className="text-xl font-bold mb-1"
                  style={{ color: "var(--theme-text)" }}
                >
                  {authUser?.userName}
                </h2>
                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--theme-textSecondary)" }}
                >
                  Member since {formatDate(authUser?.createdAt || new Date())}
                </p>

                {/* Location Display - Show in view mode */}
                {!editMode && (formData.country || formData.city) && (
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <MapPin
                      size={16}
                      style={{ color: "var(--theme-primary)" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--theme-textSecondary)" }}
                    >
                      {formData.city}
                      {formData.city && formData.country && ", "}
                      {formData.country}
                    </span>
                  </div>
                )}

                {/* Stats */}
                <div className="w-full grid grid-cols-3 gap-2 mt-4">
                  <button
                    onClick={() => setShowFollowersModal(true)}
                    className="text-center p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <p
                      className="text-lg font-bold"
                      style={{ color: "var(--theme-text)" }}
                    >
                      {authUser?.followers?.length || 0}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--theme-textMuted)" }}
                    >
                      Followers
                    </p>
                  </button>
                  <button
                    onClick={() => setShowFollowingModal(true)}
                    className="text-center p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <p
                      className="text-lg font-bold"
                      style={{ color: "var(--theme-text)" }}
                    >
                      {authUser?.following?.length || 0}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--theme-textMuted)" }}
                    >
                      Following
                    </p>
                  </button>
                  <div
                    className="text-center p-2 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <p
                      className="text-lg font-bold"
                      style={{ color: "var(--theme-text)" }}
                    >
                      {formData.age || "-"}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--theme-textMuted)" }}
                    >
                      Age
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2">
            <GlassCard className="p-4 md:p-6">
              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="mb-6">
                  <h3
                    className="text-lg font-semibold mb-4"
                    style={{ color: "var(--theme-text)" }}
                  >
                    Basic Information
                  </h3>

                  <div className="space-y-4">
                    {/* Email */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--theme-textSecondary)" }}
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2"
                          size={18}
                          style={{ color: "var(--theme-textMuted)" }}
                        />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!editMode}
                          className={`theme-input w-full pl-10 pr-4 py-2.5 ${
                            !editMode ? "opacity-80 cursor-not-allowed" : ""
                          }`}
                          style={{
                            background: !editMode
                              ? "rgba(255,255,255,0.03)"
                              : "",
                            pointerEvents: editMode ? "auto" : "none",
                          }}
                        />
                      </div>
                      
                    </div>

                    {/* Age & Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: "var(--theme-textSecondary)" }}
                        >
                          Age
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          disabled={!editMode}
                          placeholder={
                            !editMode
                              ? "Click Edit to add age"
                              : "Enter your age"
                          }
                          className={`theme-input w-full px-4 py-2.5 ${
                            !editMode ? "opacity-80 cursor-not-allowed" : ""
                          }`}
                          style={{
                            background: !editMode
                              ? "rgba(255,255,255,0.03)"
                              : "",
                            pointerEvents: editMode ? "auto" : "none",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: "var(--theme-textSecondary)" }}
                        >
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          disabled={!editMode}
                          className={`theme-input w-full px-4 py-2.5 ${
                            !editMode ? "opacity-80 cursor-not-allowed" : ""
                          }`}
                          style={{
                            background: !editMode
                              ? "rgba(255,255,255,0.03)"
                              : "",
                            pointerEvents: editMode ? "auto" : "none",
                          }}
                        >
                          <option value="">
                            {!editMode ? "Not specified" : "Select gender"}
                          </option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: "var(--theme-textSecondary)" }}
                        >
                          Country
                        </label>
                        <div className="relative">
                          <Globe
                            className="absolute left-3 top-1/2 transform -translate-y-1/2"
                            size={18}
                            style={{ color: "var(--theme-textMuted)" }}
                          />
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder={
                              !editMode
                                ? "Click Edit to add country"
                                : "Enter your country"
                            }
                            disabled={!editMode}
                            className={`theme-input w-full pl-10 pr-4 py-2.5 ${
                              !editMode ? "opacity-80 cursor-not-allowed" : ""
                            }`}
                            style={{
                              background: !editMode
                                ? "rgba(255,255,255,0.03)"
                                : "",
                              pointerEvents: editMode ? "auto" : "none",
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: "var(--theme-textSecondary)" }}
                        >
                          City
                        </label>
                        <div className="relative">
                          <MapPin
                            className="absolute left-3 top-1/2 transform -translate-y-1/2"
                            size={18}
                            style={{ color: "var(--theme-textMuted)" }}
                          />
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder={
                              !editMode
                                ? "Click Edit to add city"
                                : "Enter your city"
                            }
                            disabled={!editMode}
                            className={`theme-input w-full pl-10 pr-4 py-2.5 ${
                              !editMode ? "opacity-80 cursor-not-allowed" : ""
                            }`}
                            style={{
                              background: !editMode
                                ? "rgba(255,255,255,0.03)"
                                : "",
                              pointerEvents: editMode ? "auto" : "none",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Show edit hint when not in edit mode */}
                    {!editMode && !formData.country && !formData.city && (
                      <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <p className="text-sm text-blue-400">
                          💡 Click "Edit Profile" to add your country and city
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit Mode Buttons */}
                {editMode && (
                  <div className="flex space-x-3 mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl btn-primary"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        color: "var(--theme-text)",
                      }}
                    >
                      <X size={18} />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </form>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Followers and Following Modals */}
      <FollowersModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
      />
      <FollowingModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
      />
    </div>
  );
};

export default Profile;