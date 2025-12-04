import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-50 animate-slideIn">
      <div
        className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
          type === "success"
            ? "bg-white/90 border-green-200/50 text-green-900 shadow-green-500/10"
            : "bg-white/90 border-red-200/50 text-red-900 shadow-red-500/10"
        }`}
        style={{
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
        }}
      >
        <div
          className={`p-2 rounded-full ${
            type === "success"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {type === "success" ? (
            <CheckCircle className="w-5 h-5" strokeWidth={2.5} />
          ) : (
            <XCircle className="w-5 h-5" strokeWidth={2.5} />
          )}
        </div>

        <div className="flex flex-col">
          <p
            className={`text-sm font-bold ${
              type === "success" ? "text-green-800" : "text-red-800"
            }`}
          >
            {type === "success" ? "Success" : "Error"}
          </p>
          <p className="text-sm font-medium text-gray-600">{message}</p>
        </div>

        <button
          onClick={onClose}
          className="ml-2 p-1.5 rounded-full hover:bg-gray-100/80 transition-colors text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
