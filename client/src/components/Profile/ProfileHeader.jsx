import { Lock, Edit2, Save } from "lucide-react";

const ProfileHeader = ({
  isEditing,
  setIsEditing,
  handleSave,
  setShowPasswordModal,
  handleCancelEdit,
}) => {
  return (
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
            onClick={handleCancelEdit}
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
  );
};

export default ProfileHeader;
