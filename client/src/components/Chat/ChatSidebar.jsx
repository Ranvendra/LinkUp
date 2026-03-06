import { Search, Pin, CheckCheck } from "lucide-react";

const ChatSidebar = ({
  chats,
  activeChat,
  searchQuery,
  setSearchQuery,
  handleChatSelect,
  getOtherParticipant,
  formatShortTime,
  user,
}) => {
  const filteredChats = chats.filter((chat) => {
    const otherUser = getOtherParticipant(chat);
    const name = (
      otherUser?.name ||
      `${otherUser?.firstName || ""} ${otherUser?.lastName || ""}`
    ).toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <div
      className={`w-full md:w-[340px] lg:w-[370px] flex flex-col pt-8 pb-4 border-r border-gray-100 z-10 ${
        activeChat ? "hidden md:flex" : "flex"
      }`}
    >
      {/* Search Bar */}
      <div className="mb-6 px-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-500 group-focus-within:text-[#ff1c1c] transition-colors" />
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3 bg-[#fff0f0] hover:bg-[#fff0f0]/80 rounded-[14px] text-[15px] font-medium text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff1c1c]/30 transition-all border-none"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar scroll-smooth space-y-0.5">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => {
            const otherUser = getOtherParticipant(chat);
            const isActive = activeChat?._id === chat._id;
            const lastMessageContent =
              chat.latestMessage?.content || "No messages yet";
            const isMyLastMessage =
              chat.latestMessage?.sender === user._id ||
              chat.latestMessage?.sender?._id === user._id;

            return (
              <div
                key={chat._id}
                onClick={() => handleChatSelect(chat)}
                className={`p-3 flex items-center gap-3.5 cursor-pointer rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#fff5f5] shadow-sm shadow-[#ff1c1c]/5"
                    : "hover:bg-gray-50/80"
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-[52px] h-[52px] rounded-[18px] overflow-hidden bg-gray-200">
                    <img
                      src={
                        otherUser?.photoUrl ||
                        otherUser?.profilePicture ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt={otherUser?.firstName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className="font-bold text-gray-900 text-[15px] truncate pr-2 tracking-tight">
                      {otherUser?.name ||
                        (otherUser?.firstName
                          ? `${otherUser.firstName} ${otherUser.lastName}`
                          : "Unknown User")}
                    </h3>
                    <span
                      className={`text-[13px] shrink-0 font-medium ${
                        chat.unreadCount > 0 ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {formatShortTime(chat.updatedAt)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <p
                      className={`text-[14px] truncate pr-3 flex-1 ${
                        isActive
                          ? "text-[#ff1c1c]"
                          : chat.unreadCount > 0
                            ? "text-gray-900 font-medium"
                            : "text-gray-500"
                      }`}
                    >
                      {isMyLastMessage && (
                        <span className="text-[#ff1c1c]">You: </span>
                      )}
                      {lastMessageContent}
                    </p>

                    {/* Status Icons / Badges */}
                    <div className="flex items-center gap-1.5 shrink-0 pl-1">
                      {chat.unreadCount > 0 ? (
                        <div className="bg-[#FF715B] text-white text-[12px] font-bold h-[22px] min-w-[22px] px-1.5 rounded-full flex items-center justify-center shadow-sm">
                          {chat.unreadCount}
                        </div>
                      ) : (
                        chat.latestMessage?.content &&
                        (isActive ? (
                          <Pin className="w-[18px] h-[18px] text-[#ff1c1c] fill-[#ff1c1c] -rotate-45 opacity-80" />
                        ) : (
                          <CheckCheck className="w-[20px] h-[20px] text-gray-300" />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-3xl bg-[#fff5f5] flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-[15px] font-medium">
              No conversations found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
