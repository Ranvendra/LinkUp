import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authAPI } from "../../services/api";
import { removeUser } from "../../store/userSlice";

const DangerZone = ({ setToast }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your profile? This action cannot be undone.",
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
  };

  return (
    <div className="mt-8 bg-white rounded-2xl border border-red-100 overflow-hidden shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
        <p className="text-gray-500 text-sm mb-4">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <button
          onClick={handleDelete}
          className="px-6 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium hover:bg-red-100 transition-all flex items-center gap-2"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default DangerZone;
