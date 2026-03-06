import { useEffect, useState } from "react";
import api from "../../services/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Toast from "../Shared/Toast";
import ProfileHeader from "./ProfileHeader";
import ConnectionList from "./ConnectionList";
import InvitationList from "./InvitationList";

const Connections = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConnections = connections.filter((connection) => {
    if (!connection) return false;
    const name = connection.name || "Unknown User";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const fetchData = async () => {
    try {
      const [requestsRes, connectionsRes] = await Promise.all([
        api.get("/user/requests/received"),
        api.get("/user/connections"),
      ]);

      setRequests(requestsRes.data.data || []);
      setConnections(connectionsRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const reviewRequest = async (status, requestId) => {
    try {
      await api.post(`/request/review/${status}/${requestId}`);
      // Optimistic update
      if (status === "accepted") {
        const acceptedRequest = requests.find((r) => r._id === requestId);
        if (acceptedRequest) {
          setConnections((prev) => [...prev, acceptedRequest.fromUserId]);
        }
      }
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error(err);
      setToast({
        message: err.response?.data?.message || "Failed to update request",
        type: "error",
      });
      fetchData(); // Revert on error
    }
  };

  const handleMessage = (targetUser) => {
    navigate("/chat", { state: { targetUserId: targetUser._id } });
  };

  const removeConnection = async (userId) => {
    try {
      await api.delete(`/request/remove/${userId}`);
      setConnections((prev) => prev.filter((c) => c._id !== userId));
      setToast({ message: "Connection removed successfully", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({
        message: err.response?.data?.message || "Failed to remove connection",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#ff1c1c] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50/50 min-h-[calc(100vh-80px)]">
      <ProfileHeader
        user={user}
        connectionsCount={connections.length}
        requestsCount={requests.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <ConnectionList
          connectionsCount={connections.length}
          filteredConnections={filteredConnections}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleMessage={handleMessage}
          removeConnection={removeConnection}
        />
        <InvitationList requests={requests} reviewRequest={reviewRequest} />
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Connections;
