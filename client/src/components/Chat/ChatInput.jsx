import { Edit2, X, Paperclip, Mic, Send } from "lucide-react";

const ChatInput = ({
  editingMessage,
  cancelEditing,
  newMessage,
  setNewMessage,
  sendMessage,
}) => {
  return (
    <div className="px-6 pb-6 pt-3 bg-white shrink-0 z-20">
      {editingMessage && (
        <div className="mb-3 mx-2 flex items-center justify-between bg-[#fff5f5] px-4 py-2.5 rounded-xl">
          <div className="flex items-center gap-2">
            <Edit2 className="w-4 h-4 text-[#ff1c1c]" />
            <span className="text-sm font-medium pr-1 text-[#ff1c1c]">
              Editing:
            </span>
            <span className="text-sm text-gray-500 truncate max-w-[200px]">
              {editingMessage.content}
            </span>
          </div>
          <button
            onClick={cancelEditing}
            className="text-gray-400 hover:text-gray-600 p-1 bg-white rounded-[10px] shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-3 w-full">
        <div className="flex-1 bg-[#fff5f5] rounded-[2rem] flex items-end px-3 py-1.5 border border-transparent focus-within:bg-[#fff0f0] focus-within:shadow-[inset_0_0_0_1px_rgba(255,28,28,0.1)] transition-all">
          {/* Attachment */}
          <button className="p-3 text-gray-400 hover:text-[#ff1c1c] transition-colors shrink-0 outline-none">
            <Paperclip className="w-[22px] h-[22px] -rotate-45 stroke-[2]" />
          </button>

          <textarea
            placeholder={
              editingMessage ? "Update your message..." : "Your message"
            }
            className="flex-1 bg-transparent border-none px-2 py-3 text-[16px] text-gray-800 placeholder:text-gray-400 focus:outline-none resize-none min-h-[48px] max-h-[150px] leading-relaxed shrink"
            value={newMessage}
            rows={1}
            onChange={(e) => {
              setNewMessage(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 150) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          {/* Mic */}
          {!newMessage.trim() && (
            <button className="p-3 pr-1 text-gray-400 hover:text-[#ff1c1c] transition-colors shrink-0 outline-none">
              <Mic className="w-[22px] h-[22px] stroke-[2]" />
            </button>
          )}

          {/* Send Icon */}
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className={`p-3 shrink-0 outline-none transition-colors ${
              newMessage.trim()
                ? "text-[#ff1c1c] hover:text-[#5d46cc]"
                : "text-gray-400"
            }`}
          >
            <Send className="w-[22px] h-[22px] stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
