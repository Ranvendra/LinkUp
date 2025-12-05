import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api, { authAPI } from "../services/api";
import { addUser, removeUser } from "../store/userSlice";
import {
  Save,
  Camera,
  Mail,
  Edit2,
  CheckCircle2,
  Lock,
  X,
  Calendar,
  User,
  Hash,
  Heart,
} from "lucide-react";
import LazyImage from "./LazyImage";

const ChangePasswordModal = ({ onClose, onSuccess }) => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await api.patch("/profile/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scaleIn mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#FF6B5A]" />
            Change Password
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
            <X className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B5A] focus:ring-2 focus:ring-[#FF6B5A]/10 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B5A] focus:ring-2 focus:ring-[#FF6B5A]/10 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B5A] focus:ring-2 focus:ring-[#FF6B5A]/10 transition-all"
              required
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-[#FF6B5A] text-white rounded-xl font-medium hover:bg-[#E85545] transition-all shadow-lg shadow-[#FF6B5A]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    photoUrl: user?.photoUrl || user?.profilePicture || "",
    about: user?.about || "",
    gender: user?.gender || "Male",
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split("T")[0]
      : "",
    interests: user?.interests?.join(", ") || "",
  });
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Convert interests string back to array
      const { photoUrl, ...rest } = formData;
      const dataToSend = {
        ...rest,
        interests: formData.interests
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i),
        profilePicture: photoUrl,
      };

      const res = await api.patch("/profile/edit", dataToSend);
      dispatch(addUser(res.data.data));
      setToast({ type: "success", message: "Profile updated successfully!" });
      setIsEditing(false);
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Update failed",
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (!user) return null;

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-4 z-50 animate-slideDown">
          <div
            className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSuccess={() => {
            setToast({
              type: "success",
              message: "Password updated successfully!",
            });
            setTimeout(() => setToast(null), 3000);
          }}
        />
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-500">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <div className="flex gap-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 bg-[#FF6B5A] text-white rounded-xl font-medium hover:bg-[#E85545] transition-all flex items-center gap-2 shadow-lg shadow-[#FF6B5A]/30"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: user?.name || "",
                  username: user?.username || "",
                  photoUrl: user?.photoUrl || user?.profilePicture || "",
                  about: user?.about || "",
                  gender: user?.gender || "Male",
                  dateOfBirth: user?.dateOfBirth
                    ? new Date(user.dateOfBirth).toISOString().split("T")[0]
                    : "",
                  interests: user?.interests?.join(", ") || "",
                });
              }}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-[#FF6B5A] text-white rounded-xl font-medium hover:bg-[#E85545] transition-all flex items-center gap-2 shadow-lg shadow-[#FF6B5A]/30"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Cover */}
        <div
          className="h-48 relative"
          style={{
            background:
              "linear-gradient(135deg, #FF6B5A 0%, #FF8777 50%, #FFB4AB 100%)",
          }}
        >
          <div className="absolute -bottom-16 left-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white border-4 border-white shadow-lg">
                <LazyImage
                  src={
                    formData.photoUrl ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <div className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white w-8 h-8" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-20 px-8 pb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {user.name}
            </h2>
            <div className="flex items-center gap-4 text-gray-500 text-sm">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />@{user.username || "username"}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {user.email}
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-8">
            {/* Basic Info Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#FF6B5A]" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B5A] focus:ring-2 focus:ring-[#FF6B5A]/10 transition-all"
                      placeholder="John Doe"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900">
                      {user.name}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        @
                      </span>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B5A] focus:ring-2 focus:ring-[#FF6B5A]/10 transition-all"
                        placeholder="username"
                      />
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900">
                      @{user.username || "-"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#FF6B5A]" />
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B5A] focus:ring-2 focus:ring-[#FF6B5A]/10 transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900">
                      {formData.dateOfBirth || "-"}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B5A] focus:ring-2 focus:ring-[#FF6B5A]/10 transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900">
                      {user.gender || "-"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* About & Interests */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#FF6B5A]" />
                About & Interests
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About
                  </label>
                  {isEditing ? (
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B5A] focus:ring-2 focus:ring-[#FF6B5A]/10 transition-all resize-none h-24"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900">
                      {user.about || "No bio yet"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interests{" "}
                    <span className="text-gray-400 font-normal">
                      (comma separated)
                    </span>
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="interests"
                        value={formData.interests}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B5A] focus:ring-2 focus:ring-[#FF6B5A]/10 transition-all"
                        placeholder="Coding, Music, Travel..."
                      />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.interests && user.interests.length > 0 ? (
                        user.interests.map((interest, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium border border-red-100"
                          >
                            #{interest}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm italic">
                          No interests added
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photo URL
                    </label>
                    <div className="relative">
                      <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="photoUrl"
                        value={formData.photoUrl}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B5A] focus:ring-2 focus:ring-[#FF6B5A]/10 transition-all"
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-8 bg-white rounded-2xl border border-red-100 overflow-hidden shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-gray-500 text-sm mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button
            onClick={async () => {
              if (
                window.confirm(
                  "Are you sure you want to delete your profile? This action cannot be undone."
                )
              ) {
                try {
                  await authAPI.deleteProfile();
                  dispatch(removeUser());
                  navigate("/");
                } catch (err) {
                  console.error(err);
                  setToast({
                    type: "error",
                    message: "Failed to delete profile",
                  });
                }
              }
            }}
            className="px-6 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium hover:bg-red-100 transition-all flex items-center gap-2"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
