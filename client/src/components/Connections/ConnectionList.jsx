import { Search, UserMinus, MessageCircle } from "lucide-react";
import LazyImage from "../Shared/LazyImage";

const ConnectionList = ({
  connectionsCount,
  filteredConnections,
  searchQuery,
  setSearchQuery,
  handleMessage,
  removeConnection,
}) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex items-center justify-between pl-2">
        <h2 className="text-[22px] font-bold text-gray-900 flex items-center gap-3 tracking-tight">
          <div className="w-10 h-10 rounded-[12px] bg-[#fff0f0] flex items-center justify-center">
            <UserPlus
              className="w-[20px] h-[20px] text-[#ff1c1c]"
              strokeWidth={2.5}
            />
          </div>
          My Connections
        </h2>
        <span className="px-3.5 py-1.5 bg-[#fff5f5] text-gray-700 rounded-xl text-[14px] font-bold shadow-sm border border-gray-100">
          {connectionsCount}
        </span>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff1c1c] w-[18px] h-[18px] transition-colors" />
          <input
            type="text"
            placeholder="Search connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 shadow-sm rounded-[16px] focus:outline-none focus:ring-4 focus:ring-[#ff1c1c]/10 focus:border-[#ff1c1c]/50 transition-all font-medium text-[15px] placeholder:text-gray-400"
          />
        </div>
        <button className="px-6 py-3.5 bg-[#ff1c1c] text-white font-semibold rounded-[16px] hover:bg-[#e61919] transition-colors shadow-[0_4px_14px_rgba(255,28,28,0.3)] flex items-center gap-2">
          <Search className="w-[18px] h-[18px]" strokeWidth={2.5} />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      {filteredConnections.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-12 text-center flex flex-col items-center justify-center h-[350px]">
          <div className="w-20 h-20 mx-auto mb-5 rounded-[1.2rem] bg-[#fff5f5] flex items-center justify-center">
            <UserPlus className="w-9 h-9 text-[#ff1c1c]" strokeWidth={2.5} />
          </div>
          <h3 className="text-[20px] font-bold text-gray-900 mb-2 tracking-tight">
            {searchQuery ? "No matching connections" : "No connections yet"}
          </h3>
          <p className="text-gray-500 text-[15px] max-w-sm mx-auto">
            {searchQuery
              ? "Try searching for a different name"
              : "Start connecting with people to build your network!"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
          <div className="h-[450px] overflow-y-auto p-5 space-y-3.5 custom-scrollbar bg-white">
            {filteredConnections.map((connection) => (
              <div
                key={connection._id}
                className="bg-white p-4 rounded-[1.5rem] border border-gray-100 hover:border-[#ff1c1c]/30 hover:shadow-[0_8px_24px_rgba(255,28,28,0.06)] hover:bg-[#fff5f5]/50 transition-all flex items-center gap-4 group"
              >
                <div className="w-[68px] h-[68px] rounded-[1.2rem] overflow-hidden bg-gray-100 shrink-0 border border-gray-100 shadow-sm">
                  <LazyImage
                    src={
                      connection.profilePicture ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    alt={connection.firstName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 truncate text-[17px] mb-0.5 tracking-tight group-hover:text-[#ff1c1c] transition-colors">
                        {connection.name}
                      </h3>
                      <p className="text-[14px] text-gray-500 truncate mb-3 max-w-[200px] sm:max-w-xs leading-relaxed">
                        {connection.about || "No bio available"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <button
                      onClick={() => handleMessage(connection)}
                      className="flex-1 py-2 h-10 bg-[#fff0f0] text-[#ff1c1c] hover:bg-[#ff1c1c] hover:text-white rounded-xl text-[14px] font-semibold transition-all flex items-center justify-center gap-2 border border-transparent hover:shadow-[0_4px_12px_rgba(255,28,28,0.25)]"
                    >
                      <MessageSquareText
                        className="w-[18px] h-[18px]"
                        strokeWidth={2.5}
                      />
                      Message
                    </button>
                    <button
                      onClick={() => removeConnection(connection._id)}
                      className="px-4 py-2 h-10 bg-[#FFF5F3] text-[#FF715B] hover:bg-[#FF715B] hover:text-white rounded-xl flex items-center justify-center transition-all border border-transparent shrink-0"
                      title="Remove Connection"
                    >
                      <UserMinus
                        className="w-[18px] h-[18px]"
                        strokeWidth={2.5}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionList;
