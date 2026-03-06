import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../services/api";
import { addUser } from "../../store/userSlice";
import { CheckCircle2 } from "lucide-react";

import ChangePasswordModal from "./ChangePasswordModal";
import ProfileHeader from "./ProfileHeader";
import ProfileForm from "./ProfileForm";
import DangerZone from "./DangerZone";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
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

  const handleCancelEdit = () => {
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
      <ProfileHeader
        user={user}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleSave={handleSave}
        setShowPasswordModal={setShowPasswordModal}
        handleCancelEdit={handleCancelEdit}
      />

      {/* Profile Card / Form */}
      <ProfileForm
        user={user}
        isEditing={isEditing}
        formData={formData}
        handleChange={handleChange}
      />

      {/* Danger Zone */}
      <DangerZone setToast={setToast} />
    </div>
  );
};

export default Profile;
