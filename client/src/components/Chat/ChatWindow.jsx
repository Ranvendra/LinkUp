import { ArrowLeft, Search, Phone, MoreVertical, Edit2 } from "lucide-react";

const ChatWindow = ({
  activeChat,
  getOtherParticipant,
  messages,
  user,
  startEditing,
  scrollRef,
  setActiveChat,
}) => {
  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 mt-5 pt-3 pb-3 mb-2 flex items-center justify-between bg-white z-10 shrink-0">
        <div className="flex items-center gap-4 w-full">
          <button
            className="md:hidden text-gray-500 hover:text-gray-900 bg-gray-50 p-2 rounded-xl transition-colors"
            onClick={() => setActiveChat(null)}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-[32px] font-bold text-gray-900 tracking-tight mb-0">
              {getOtherParticipant(activeChat)?.name ||
                getOtherParticipant(activeChat)?.firstName +
                  " " +
                  getOtherParticipant(activeChat)?.lastName ||
                "Unknown User"}
            </h2>
            <p className="text-[15px] text-gray-500 font-medium tracking-wide">
              2 members, Online
            </p>
          </div>

          <div className="flex items-center gap-6 text-gray-400 shrink-0">
            <button className="hover:text-[#ff1c1c] transition-colors">
              <Search className="w-6 h-6 stroke-[1.5]" />
            </button>
            <button className="hover:text-[#ff1c1c] transition-colors">
              <Phone className="w-6 h-6 stroke-[1.5]" />
            </button>
            <button className="hover:text-[#ff1c1c] transition-colors">
              <MoreVertical className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 space-y-5 bg-white custom-scrollbar pb-6 relative">
        {messages.map((msg, idx) => {
          const isMe = msg.sender?._id === user._id;
          const senderName =
            msg.sender?.name || msg.sender?.firstName || "Unknown";
          const senderPhoto =
            msg.sender?.photoUrl ||
            msg.sender?.profilePicture ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

          return (
            <div
              key={msg._id || idx}
              className={`flex w-full animate-slideUp group pt-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[85%] lg:max-w-[70%] xl:max-w-[60%] items-end ${
                  isMe ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div className="w-[42px] h-[42px] shrink-0 bg-gray-200 rounded-[14px] overflow-hidden shadow-sm self-end mb-1">
                  <img
                    src={senderPhoto}
                    alt={senderName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Bubble */}
                <div className="relative">
                  <div
                    className={`px-5 pt-3.5 pb-2.5 ${
                      isMe
                        ? "bg-[#ff1c1c] text-white rounded-[20px] rounded-br-[4px]"
                        : "bg-[#fff5f5] text-gray-800 rounded-[20px] rounded-bl-[4px]"
                    }`}
                  >
                    {!isMe && (
                      <p className="text-[#8a1111] text-[13px] font-semibold mb-1 ml-0.5 tracking-wide">
                        {senderName}
                      </p>
                    )}

                    <p className="text-[15.5px] leading-[1.6] whitespace-pre-wrap">
                      {msg.content}
                    </p>

                    {/* Timestamp / Read state inside bubble */}
                    <div
                      className={`flex items-center gap-1.5 justify-end mt-1 ${
                        isMe ? "text-white/80" : "text-gray-400"
                      }`}
                    >
                      {isMe && (
                        <div className="flex -space-x-1 mr-1 text-[11px] items-center">
                          <svg
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-[14px] h-[14px] mr-1 opacity-80"
                          >
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                          <span>10</span>
                        </div>
                      )}
                      {!isMe && (
                        <div className="flex items-center gap-0.5 text-[11px] opacity-80">
                          <svg
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-[14px] h-[14px]"
                          >
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                          <span className="mr-1">16</span>
                        </div>
                      )}
                      <span className={`text-[11px] font-medium`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isMe && (
                    <div className="absolute top-1/2 -translate-y-1/2 right-full pr-3 opacity-0 md:group-hover:opacity-100 transition-opacity flex">
                      <button
                        onClick={() => startEditing(msg)}
                        className="text-gray-400 hover:text-[#ff1c1c] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-1.5 rounded-full transition-colors"
                        title="Edit message"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} className="h-4" />
      </div>
    </div>
  );
};

export default ChatWindow;
