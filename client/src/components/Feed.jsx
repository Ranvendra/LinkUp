import { useEffect, useState } from "react";
import api from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../store/feedSlice";
import { HeartPlus, TicketX, Sparkles } from "lucide-react";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [loading, setLoading] = useState(false);

  const fetchFeed = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.get(`/feed?limit=3`);

      const users = res.data.data || [];
      dispatch(addFeed(users));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const sendRequest = async (status, toUserId) => {
    try {
      await api.post(`/request/send/${status}/${toUserId}`);
      // Remove this user from feed
      dispatch(addFeed(feed.filter((user) => user._id !== toUserId)));

      // If less than 3 users remain, fetch more
      if (feed.length <= 1) {
        fetchFeed();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && (!feed || feed.length === 0)) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#FF6B5A] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Finding amazing people...</p>
        </div>
      </div>
    );
  }

  if (!loading && (!feed || feed.length === 0)) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No more users
          </h3>
          <p className="text-gray-500">Check back later for new connections!</p>
        </div>
      </div>
    );
  }

  const currentUser = feed[0];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1 mt-5">Discover</h1>
        <p className="text-gray-500">Swipe to connect with amazing people</p>
      </div>

      {/* Tinder-style Card Stack */}
      <div className="flex justify-center items-center]">
        <div className="relative w-full max-w-md">
          {/* Card Stack - Show up to 3 cards with offset */}
          {feed.slice(0, 3).map((user, index) => (
            <div
              key={user._id}
              className={`absolute inset-0 transition-all duration-300 ${
                index === 0
                  ? "z-30 scale-100 opacity-100"
                  : index === 1
                  ? "z-20 scale-95 opacity-70 translate-y-2"
                  : "z-10 scale-90 opacity-40 translate-y-4"
              }`}
              style={{
                transform: `scale(${1 - index * 0.05}) translateY(${
                  index * 8
                }px)`,
              }}
            >
              <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-2xl">
                {/* Image */}
                <div className="relative aspect-49/50 overflow-hidden bg-gray-100">
                  <img
                    src={
                      user.photoUrl ||
                      user.profilePicture ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    alt={user.firstName || user.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* User Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-3xl font-bold mb-1">
                      {user.firstName || user.name}{" "}
                      {user.lastName && user.lastName}
                      {user.age && `, ${user.age}`}
                    </h2>
                    <p className="text-white/90 text-lg mb-3">
                      {user.gender || "Not specified"}
                    </p>
                    {user.about && (
                      <p className="text-white/80 text-sm line-clamp-2 mb-3">
                        {user.about}
                      </p>
                    )}
                    {user.interests && user.interests.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {user.interests.slice(0, 3).map((interest, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full"
                          >
                            {interest}
                          </span>
                        ))}
                        {user.interests.length > 3 && (
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                            +{user.interests.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons - Only on front card */}
                {index === 0 && (
                  <div className="p-6 flex gap-10 justify-center bg-white">
                    <button
                      onClick={() => sendRequest("ignored", user._id)}
                      className="w-18 h-18 bg-white border-2 border-gray-300 text-gray-600 rounded-full hover:bg-gray-50 transition-all flex items-center justify-center shadow-lg hover:scale-[0.96]"
                    >
                      <TicketX className="w-10 h-10" />
                    </button>
                    <button
                      onClick={() => sendRequest("interested", user._id)}
                      className="w-18 h-18 border-3 bg-[#fd1c6f] text-white rounded-full hover:bg-[#ff2264] hover:shadow-[#FF6B5A]/80 transition-all flex items-center justify-center shadow-2xl shadow-[#FF6B5A]/40 hover:scale-[0.96]"
                    >
                      <HeartPlus className="w-12 h-12" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Placeholder for card height */}
          <div className="opacity-0 pointer-events-none">
            <div className="bg-white rounded-3xl overflow-hidden">
              <div className="aspect-3/4"></div>
              <div className="p-6 flex gap-4 justify-center">
                <div className="w-16 h-16"></div>
                <div className="w-20 h-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Remaining Indicator */}
      <div className="fixed bottom-5 w-20/25 flex justify-center items-center">
        <p className="text-2xl text-[#fe103f] font-pacifico">
          <span className="text-5xl text-[#216fff]">{feed.length}</span> <span className="px-1"></span> {feed.length === 1 ? "Person" : "People"} To Discover
        </p>
      </div>
    </div>
  );
};

export default Feed;
