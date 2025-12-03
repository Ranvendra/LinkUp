import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../services/api";
import { addUser } from "../store/userSlice";
import { Save, Camera, Mail, Edit2, CheckCircle2 } from "lucide-react";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || user?.name || "",
    lastName: user?.lastName || "",
    photoUrl: user?.photoUrl || user?.profilePicture || "",
    about: user?.about || "",
    gender: user?.gender || "Male",
    age: user?.age || "",
  });
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const res = await api.patch("/profile/edit", formData);
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
    <div className="animate-fadeIn max-w-4xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-slideDown">
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

      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-500">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2.5 bg-[#FF6B5A] text-white rounded-xl font-medium hover:bg-[#E85545] transition-all flex items-center gap-2 shadow-lg shadow-[#FF6B5A]/30"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  firstName: user?.firstName || user?.name || "",
                  lastName: user?.lastName || "",
                  photoUrl: user?.photoUrl || user?.profilePicture || "",
                  about: user?.about || "",
                  gender: user?.gender || "Male",
                  age: user?.age || "",
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
              Save
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
                <img
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {user.firstName || user.name} {user.lastName}
            </h2>
            <p className="text-gray-500 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {user.email}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B5A] focus:ring-2 focus:ring-[#FF6B5A]/10 transition-all"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900">
                    {user.firstName || user.name}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B5A] focus:ring-2 focus:ring-[#FF6B5A]/10 transition-all"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900">
                    {user.lastName || "-"}
                  </div>
                )}
              </div>
            </div>

            {/* Photo URL */}
            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo URL
                </label>
                <input
                  type="text"
                  name="photoUrl"
                  value={formData.photoUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B5A] focus:ring-2 focus:ring-[#FF6B5A]/10 transition-all"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            )}

            {/* About */}
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

            {/* Gender and Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B5A] focus:ring-2 focus:ring-[#FF6B5A]/10 transition-all"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900">
                    {user.age || "-"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
