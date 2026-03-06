import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import api, { BACKEND_URL } from "../../services/api";
import { useLocation } from "react-router-dom";
import { Send } from "lucide-react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

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
        setMessages((prev) => {
          // Replace optimistic temp message if it matches
          const tempIndex = prev.findIndex(
            (m) =>
              m._id &&
              m._id.toString().startsWith("temp-") &&
              m.content === message.content,
          );
          if (tempIndex !== -1) {
            const next = [...prev];
            next[tempIndex] = message;
            return next;
          }
          // Avoid exact DB duplicate
          if (!prev.some((m) => m._id === message._id)) {
            return [...prev, message];
          }
          return prev;
        });
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

  useEffect(() => {
    if (location.state?.targetUserId) {
      createOrGetChat(location.state.targetUserId);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const markChatRead = async (chatId) => {
    try {
      await api.put(`/chat/read/${chatId}`);
      fetchChats();
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
      setLoading(true);
      const res = await api.post(`/chat/${targetUserId}`);
      const newChat = res.data.data;

      setActiveChat(newChat);
      await fetchMessages(newChat._id);
      await fetchChats(); // Ensure the sidebar list receives the chat
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Cannot start chat");
    } finally {
      setLoading(false);
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
      try {
        const res = await api.put(`/chat/message/${editingMessage._id}`, {
          content: newMessage,
        });

        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === editingMessage._id ? res.data.data : msg,
          ),
        );
        setEditingMessage(null);
        setNewMessage("");
      } catch (err) {
        console.error(err);
        alert("Failed to update message");
      }
    } else {
      const messageData = {
        chatId: activeChat._id,
        senderId: user._id,
        content: newMessage,
      };
      socket.current.emit("sendMessage", messageData);

      // Optimistic Update
      const optimisticMsg = {
        _id: `temp-${Date.now()}`,
        chatId: activeChat._id,
        sender: {
          _id: user._id,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          photoUrl: user.photoUrl || user.profilePicture,
          profilePicture: user.profilePicture || user.photoUrl,
        },
        content: newMessage,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => {
        // Prevent duplicate rendering locally
        if (
          prev.some(
            (m) =>
              m.content === optimisticMsg.content &&
              m.sender._id === user._id &&
              Date.now() - new Date(m.createdAt).getTime() < 2000,
          )
        ) {
          return prev;
        }
        return [...prev, optimisticMsg];
      });

      setNewMessage("");

      // Sync real data from server slightly after
      setTimeout(() => {
        fetchMessages(activeChat._id);
        fetchChats();
      }, 500);
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

  const formatShortTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "20m";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#ff1c1c] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] max-h-[850px] w-full max-w-7xl mx-auto flex animate-fadeIn p-4 md:p-4 lg:p-6 items-center justify-center">
      <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex w-full h-[90vh] max-h-[900px] overflow-hidden">
        <ChatSidebar
          chats={chats}
          activeChat={activeChat}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleChatSelect={handleChatSelect}
          getOtherParticipant={getOtherParticipant}
          formatShortTime={formatShortTime}
          user={user}
        />

        {activeChat ? (
          <div className="flex-1 flex flex-col bg-white">
            <ChatWindow
              activeChat={activeChat}
              getOtherParticipant={getOtherParticipant}
              messages={messages}
              user={user}
              startEditing={startEditing}
              scrollRef={scrollRef}
              setActiveChat={setActiveChat}
            />
            <ChatInput
              editingMessage={editingMessage}
              cancelEditing={cancelEditing}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              sendMessage={sendMessage}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 bg-white relative">
            <div className="w-24 h-24 mb-6 rounded-[2rem] bg-[#fff5f5] flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <Send className="w-8 h-8 text-[#ff1c1c] ml-1" />
              </div>
            </div>
            <h3 className="text-[26px] font-bold text-gray-900 tracking-tight mb-2">
              Your Messages
            </h3>
            <p className="text-[16px] text-gray-400 max-w-[320px]">
              Select a conversation from the sidebar to view chat history and
              start messaging.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
