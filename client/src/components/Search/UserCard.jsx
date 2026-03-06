import { UserPlus, Check, MessageCircle } from "lucide-react";

const UserCard = ({
  user,
  sendConnectionRequest,
  requestedUsers,
  navigate,
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group">
      {/* Image */}
      <div className="relative aspect-4/5 overflow-hidden bg-gray-100">
        <img
          src={
            user.photoUrl ||
            user.profilePicture ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          alt={
            user.name ||
            (user.firstName
              ? `${user.firstName} ${user.lastName || ""}`
              : "User")
          }
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Connect / Status Buttons - Visible on hover at Top Right */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform translate-y-0 md:translate-y-2 md:group-hover:translate-y-0">
          {user.connectionStatus === "connected" ? (
            <div className="bg-green-500 text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg">
              <Check className="w-4 h-4" />
              Connected
            </div>
          ) : user.connectionStatus === "pending" ? (
            <div className="bg-yellow-500 text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg">
              <Check className="w-4 h-4" />
              Pending
            </div>
          ) : requestedUsers.has(user._id) ? (
            <div className="bg-blue-500 text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg">
              <Check className="w-4 h-4" />
              Request Sent
            </div>
          ) : (
            <button
              onClick={() => sendConnectionRequest(user._id)}
              className="bg-white/95 backdrop-blur-sm text-[#FF6B5A] px-4 py-2 rounded-full font-medium text-sm hover:bg-white hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
            >
              <UserPlus className="w-4 h-4" />
              Connect
            </button>
          )}
        </div>

        {/* Message Button - Visible on hover at Bottom Center */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform translate-y-4 md:group-hover:translate-y-0 w-max">
          <button
            onClick={() =>
              navigate("/chat", { state: { targetUserId: user._id } })
            }
            className="bg-blue-500 text-white px-8 py-2.5 rounded-full font-semibold text-sm hover:bg-blue-600 hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-blue-500/30"
          >
            <MessageCircle className="w-5 h-5" />
            Message
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {user.name ||
              (user.firstName
                ? `${user.firstName} ${user.lastName || ""}`
                : "Unknown User")}
          </h3>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            {user.age && (
              <>
                <span>
                  <span className="font-semibold text-gray-700">age:</span>{" "}
                  {user.age}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              </>
            )}
            <span
              className={
                user.gender == "male" || user.gender == "Male"
                  ? "text-blue-500 font-bold"
                  : "text-red-500 font-bold"
              }
            >
              {user.gender || "Not specified"}
            </span>
          </p>
        </div>

        {user.about && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {user.about}
          </p>
        )}

        <div className="flex gap-2 flex-wrap">
          {user.interests?.slice(0, 2).map((interest, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
            >
              {interest}
            </span>
          ))}
          {user.interests?.length > 2 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              +{user.interests.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
