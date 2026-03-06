import { BellDot, Check, X } from "lucide-react";
import LazyImage from "../Shared/LazyImage";

const InvitationList = ({ requests, reviewRequest }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pl-2">
        <h2 className="text-[22px] font-bold text-gray-900 flex items-center gap-3 tracking-tight">
          <div className="w-10 h-10 rounded-[12px] bg-[#FFF5F3] flex items-center justify-center">
            <BellDot
              className="w-[20px] h-[20px] text-[#FF715B]"
              strokeWidth={2.5}
            />
          </div>
          Invitations
        </h2>
        <span className="px-3 py-1 bg-[#FF715B] text-white rounded-[10px] text-[13px] font-bold shadow-sm border border-[#FF715B]">
          {requests.length}
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-10 text-center flex flex-col items-center justify-center h-[280px]">
          <div className="w-16 h-16 rounded-[1.2rem] bg-gray-50 flex items-center justify-center mb-4">
            <BellDot className="w-7 h-7 text-gray-300" strokeWidth={2.5} />
          </div>
          <p className="text-gray-500 text-[15px] font-medium">
            No pending invitations
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
          <div className="h-[450px] overflow-y-auto p-4 space-y-3 custom-scrollbar bg-white">
            {requests.map((request) => {
              const user = request.fromUserId;
              if (!user) return null; // Skip if user data is missing
              return (
                <div
                  key={request._id}
                  className="bg-white p-4 rounded-[1.3rem] border border-gray-100 hover:border-[#ff1c1c]/20 hover:shadow-[0_4px_16px_rgba(255,28,28,0.05)] transition-all group"
                >
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-[52px] h-[52px] rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                      <LazyImage
                        src={
                          user.photoUrl ||
                          user.profilePicture ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        }
                        alt={user.firstName || user.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 pr-1">
                      <h3 className="font-bold text-gray-900 text-[15px] tracking-tight truncate group-hover:text-[#ff1c1c] transition-colors">
                        {user.name || "Unknown User"}
                      </h3>
                      <p className="text-[13px] text-gray-500 truncate mt-0.5">
                        {user.about || "No bio available"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => reviewRequest("rejected", request._id)}
                      className="flex-1 py-2 text-[13.5px] font-bold text-gray-600 bg-[#fff5f5] hover:bg-gray-200 rounded-xl transition-colors border border-gray-100 shadow-sm"
                    >
                      Ignore
                    </button>
                    <button
                      onClick={() => reviewRequest("accepted", request._id)}
                      className="flex-1 py-2 text-[13.5px] font-bold text-white bg-[#ff1c1c] hover:bg-[#e61919] rounded-xl transition-colors shadow-[0_4px_12px_rgba(255,28,28,0.25)]"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitationList;
