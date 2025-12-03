import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import api, { BACKEND_URL } from "../services/api";
import { useLocation } from "react-router-dom";
import { Send, Search, MoreVertical, ArrowLeft, Edit2, X } from "lucide-react";

const Chat = () => {
  const user = useSelector((store) => store.user);
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingMessage, setEditingMessage] = useState(null);
  const socket = useRef(null);
  const scrollRef = useRef();

  useEffect(() => {
    if (!user) return;

    socket.current = io(BACKEND_URL);

    socket.current.on("connect", () => {
      console.log("Connected to socket");
    });

    socket.current.on("messageReceived", (message) => {
      if (activeChat && message.chatId === activeChat._id) {
        setMessages((prev) => [...prev, message]);
        // Optionally mark as read immediately if window is focused
        markChatRead(activeChat._id);
      }
      fetchChats();
    });

    return () => {
      socket.current.disconnect();
    };
  }, [user, activeChat]);

  const fetchChats = async () => {
    try {
      const res = await api.get("/chat");
      setChats(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // Handle navigation from Connections page
  useEffect(() => {
    if (location.state?.targetUserId) {
      createOrGetChat(location.state.targetUserId);
      // Clear state to prevent reopening on refresh (optional, but good practice)
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const markChatRead = async (chatId) => {
    try {
      await api.put(`/chat/read/${chatId}`);
      fetchChats(); // Refresh to clear badge
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await api.get(`/chat/${chatId}`);
      setMessages(res.data.data || []);
      socket.current.emit("joinChat", { chatId });
    } catch (err) {
      console.error(err);
    }
  };

  const createOrGetChat = async (targetUserId) => {
    try {
      const res = await api.post(`/chat/${targetUserId}`);
      setActiveChat(res.data.data);
      fetchMessages(res.data.data._id);
      fetchChats();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Cannot start chat");
    }
  };

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    fetchMessages(chat._id);
    markChatRead(chat._id);
    setEditingMessage(null);
    setNewMessage("");
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;

    if (editingMessage) {
      // Update existing message
      try {
        const res = await api.put(`/chat/message/${editingMessage._id}`, {
          content: newMessage,
        });

        // Update local state
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === editingMessage._id ? res.data.data : msg
          )
        );
        setEditingMessage(null);
        setNewMessage("");
      } catch (err) {
        console.error(err);
        alert("Failed to update message");
      }
    } else {
      // Send new message
      const messageData = {
        chatId: activeChat._id,
        senderId: user._id,
        content: newMessage,
      };
      socket.current.emit("sendMessage", messageData);
      setNewMessage("");
    }
  };

  const startEditing = (msg) => {
    setEditingMessage(msg);
    setNewMessage(msg.content);
  };

  const cancelEditing = () => {
    setEditingMessage(null);
    setNewMessage("");
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getOtherParticipant = (chat) => {
    return chat.participants.find((p) => p._id !== user._id);
  };

  const filteredChats = chats.filter((chat) => {
    const otherUser = getOtherParticipant(chat);
    const name = `${otherUser?.firstName || ""} ${
      otherUser?.lastName || ""
    }`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#FF6B5A] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-500">Chat with your connections</p>
      </div>

      {/* Chat Container */}
      <div
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
        style={{ height: "calc(100vh - 240px)" }}
      >
        <div className="flex h-full">
          {/* Sidebar */}
          <div
            className={`w-full md:w-96 border-r border-gray-200 flex flex-col ${
              activeChat ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B5A] focus:ring-2 focus:ring-[#FF6B5A]/10 transition-all"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {/* Recent Chats */}
              {filteredChats.length > 0 ? (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Recent Chats
                  </div>
                  {filteredChats.map((chat) => {
                    const otherUser = getOtherParticipant(chat);
                    const isActive = activeChat?._id === chat._id;
                    return (
                      <div
                        key={chat._id}
                        onClick={() => handleChatSelect(chat)}
                        className={`p-4 flex items-center gap-3 cursor-pointer transition-colors border-l-4 ${
                          isActive
                            ? "bg-[#FFF5F3] border-[#FF6B5A]"
                            : "border-transparent hover:bg-gray-50"
                        }`}
                      >
                        <div className="shrink-0 relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
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
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-semibold text-gray-900 text-sm truncate">
                              {otherUser?.firstName || otherUser?.name}{" "}
                              {otherUser?.lastName}
                            </h3>
                            <span
                              className={`text-xs ml-2 shrink-0 ${
                                chat.unreadCount > 0
                                  ? "text-[#FF6B5A] font-medium"
                                  : "text-gray-500"
                              }`}
                            >
                              {chat.updatedAt
                                ? new Date(chat.updatedAt).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" }
                                  )
                                : ""}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p
                              className={`text-sm truncate flex-1 ${
                                chat.unreadCount > 0
                                  ? "font-semibold text-gray-900"
                                  : "text-gray-500"
                              }`}
                            >
                              {chat.latestMessage?.content || "No messages yet"}
                            </p>
                            {chat.unreadCount > 0 && (
                              <div className="ml-2 bg-[#FF6B5A] text-white text-xs font-bold h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center">
                                {chat.unreadCount}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Send className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    No conversations found. Start a chat from your Network page!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div
            className={`flex-1 flex flex-col ${
              !activeChat ? "hidden md:flex" : "flex"
            }`}
          >
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      className="md:hidden text-gray-600 hover:text-gray-900"
                      onClick={() => setActiveChat(null)}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                      <img
                        src={
                          getOtherParticipant(activeChat)?.photoUrl ||
                          getOtherParticipant(activeChat)?.profilePicture ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        }
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {getOtherParticipant(activeChat)?.firstName ||
                          getOtherParticipant(activeChat)?.name}{" "}
                        {getOtherParticipant(activeChat)?.lastName}
                      </h3>
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Online
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((msg, idx) => {
                    const isMe = msg.sender._id === user._id;
                    return (
                      <div
                        key={idx}
                        className={`flex ${
                          isMe ? "justify-end" : "justify-start"
                        } animate-slideUp group`}
                      >
                        <div
                          className={`flex gap-2 max-w-[70%] ${
                            isMe ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
                            <img
                              src={
                                msg.sender.photoUrl ||
                                msg.sender.profilePicture ||
                                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                              }
                              alt="User"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="relative">
                            <div
                              className={`px-4 py-2.5 rounded-2xl ${
                                isMe
                                  ? "bg-[#FF6B5A] text-white rounded-tr-sm"
                                  : "bg-white text-gray-900 rounded-tl-sm border border-gray-200"
                              }`}
                            >
                              <p className="text-sm leading-relaxed">
                                {msg.content}
                              </p>
                            </div>
                            <div
                              className={`flex items-center gap-2 mt-1 ${
                                isMe ? "justify-end" : "justify-start"
                              }`}
                            >
                              <p className="text-xs text-gray-500">
                                {new Date(msg.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                              {/* Edit Button for own messages */}
                              {isMe && (
                                <button
                                  onClick={() => startEditing(msg)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-[#FF6B5A]"
                                  title="Edit message"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={scrollRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  {editingMessage && (
                    <div className="mb-2 flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <Edit2 className="w-4 h-4 text-[#FF6B5A]" />
                        <span className="text-sm text-gray-600">
                          Editing message
                        </span>
                      </div>
                      <button
                        onClick={cancelEditing}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder={
                        editingMessage
                          ? "Update your message..."
                          : "Type your message..."
                      }
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B5A] focus:ring-2 focus:ring-[#FF6B5A]/10 transition-all"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                      onClick={sendMessage}
                      className="px-6 py-3 bg-[#FF6B5A] text-white rounded-xl font-medium hover:bg-[#E85545] transition-all flex items-center gap-2 shadow-lg shadow-[#FF6B5A]/30"
                    >
                      {editingMessage ? "Update" : <Send className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                  <Send className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your Messages
                </h3>
                <p className="text-sm">
                  Select a conversation to start messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
