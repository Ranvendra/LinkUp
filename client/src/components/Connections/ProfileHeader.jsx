import LazyImage from "../Shared/LazyImage";

const ProfileHeader = ({ user, connectionsCount, requestsCount }) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[1.8rem] border border-gray-100 shadow-sm overflow-hidden bg-[#fff5f5] shrink-0">
        <LazyImage
          src={
            user?.photoUrl ||
            user?.profilePicture ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          alt={user?.firstName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-center sm:text-left flex-1 mt-2">
        <h1 className="text-[28px] sm:text-[32px] font-bold text-gray-900 tracking-tight mb-1 leading-tight">
          {user?.name}
        </h1>
        <p className="text-[16px] text-gray-500 font-medium mb-4">
          {user?.headline || "Add a headline to your profile"}
        </p>
        <div className="flex justify-center sm:justify-start gap-8 text-[15px]">
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-2xl font-bold text-gray-900 leading-none mb-1">
              {connectionsCount}
            </span>
            <span className="font-medium text-gray-500 text-[13px] uppercase tracking-wider">
              Connections
            </span>
          </div>
          <div className="hidden sm:block w-px h-10 bg-gray-200"></div>
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-2xl font-bold text-gray-900 leading-none mb-1">
              {requestsCount}
            </span>
            <span className="font-medium text-gray-500 text-[13px] uppercase tracking-wider">
              Pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
