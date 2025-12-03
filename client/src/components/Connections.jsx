import { useEffect, useState } from "react";
import api from "../services/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Check,
  X,
  BellDot,
  MessageSquareText,
  MapPin,
  Briefcase,
  UserPlus,
} from "lucide-react";

const Connections = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

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
      fetchData(); // Revert on error
    }
  };

  const handleMessage = (targetUser) => {
    navigate("/chat", { state: { targetUserId: targetUser._id } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#FF6B5A] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Compact Profile Header */}
      <div className="bg-white rounded-2xl p-6 mb-8 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full border-2 border-gray-100 shadow-sm overflow-hidden bg-gray-50 shrink-0">
          <img
            src={
              user?.photoUrl ||
              user?.profilePicture ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt={user?.firstName}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-blue-500 mb-1 font-pacifico">
             {user?.name}
          </h1>
          <p className="text-gray-500 font-medium mb-3">{user?.headline}</p>
          <div className="flex gap-6 text-sm">
            <span className="font-medium text-gray-600">
              <strong className="text-gray-900">{connections.length}</strong>{" "}
              Connections
            </span>
            <span className="font-medium text-gray-600">
              <strong className="text-gray-900">{requests.length}</strong>{" "}
              Pending
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        {/* Left Column: My Connections */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-pacifico text-red-500 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-red-600" strokeWidth={3} />
              Connections
            </h2>
            <span className="px-3 py-1 bg-[#dafcff] text-gray-600 rounded-full text-sm font-medium">
              {connections.length}
            </span>
          </div>

          {connections.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-gray-400" strokeWidth={3} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No connections yet
              </h3>
              <p className="text-gray-500">
                Start connecting with people to build your network!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connections.map((connection) => (
                <div
                  key={connection._id}
                  className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all flex items-center gap-4 group"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={
                        
                        connection.profilePicture ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt={connection.firstName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">
                      {connection.firstName
                        ? `${connection.firstName} ${connection.lastName}`
                        : connection.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate mb-2">
                      {connection.about || "No bio available"}
                    </p>
                    <button
                      onClick={() => handleMessage(connection)}
                      className="w-1/2 py-2 bg-[#8eff5a]/30 text-[#019b18] hover:bg-[#00c917] hover:text-white hover:scale-[0.96] hover:shadow-amber-700 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <MessageSquareText className="w-4 h-4" />
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Invitations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-pacifico text-red-500 flex items-center gap-2">
              <BellDot className="w-6 h-6 text-red-600" strokeWidth={3}/>
              Invitations
            </h2>
            <span className="px-3 py-1 bg-[#FFF5F3] text-[#FF6B5A] rounded-full text-sm font-medium">
              {requests.length}
            </span>
          </div>

          {requests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-sm">No pending invitations</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => {
                const user = request.fromUserId;
                return (
                  <div
                    key={request._id}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={
                            user.photoUrl ||
                            user.profilePicture ||
                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                          }
                          alt={user.firstName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {user.about || "No bio available"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => reviewRequest("rejected", request._id)}
                        className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Ignore
                      </button>
                      <button
                        onClick={() => reviewRequest("accepted", request._id)}
                        className="flex-1 py-2 text-sm font-medium text-white bg-[#FF6B5A] hover:bg-[#E85545] rounded-lg transition-colors shadow-sm"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Connections;
