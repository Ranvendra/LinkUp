import { useEffect, useState } from "react";
import api from "../../services/api";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Toast from "../Shared/Toast";

import SearchFilters from "./SearchFilters";
import UserCard from "./UserCard";
import SearchPagination from "./SearchPagination";

const Search = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    gender: "",
    ageRange: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [requestedUsers, setRequestedUsers] = useState(new Set());
  const [toast, setToast] = useState(null);

  const [abortController, setAbortController] = useState(null);

  const fetchUsers = async () => {
    if (abortController) {
      abortController.abort();
    }
    const newController = new AbortController();
    setAbortController(newController);

    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 8,
        search: searchQuery,
        sort: sortOrder,
        ...filters,
      }).toString();

      const res = await api.get(`/search?${queryParams}`, {
        signal: newController.signal,
      });

      setUsers(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
        console.log("Request canceled");
        return;
      }
      console.error(err);
    } finally {
      if (!newController.signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, sortOrder, filters]);

  const handleSearch = () => {
    setPage(1);
    fetchUsers();
  };

  const sendConnectionRequest = async (userId) => {
    try {
      await api.post(`/request/send/interested/${userId}`);
      setRequestedUsers((prev) => new Set(prev).add(userId));
    } catch (err) {
      console.error(err);
      setToast({
        message:
          err.response?.data?.message || "Failed to send connection request",
        type: "error",
      });
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#FF6B5A] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Searching...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-10">
          Search Users
        </h1>
        <p className="text-gray-500">Find and connect with people</p>
      </div>

      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        showSortDropdown={showSortDropdown}
        setShowSortDropdown={setShowSortDropdown}
        setPage={setPage}
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {/* User Cards Grid */}
      {users.length === 0 ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                sendConnectionRequest={sendConnectionRequest}
                requestedUsers={requestedUsers}
                navigate={navigate}
              />
            ))}
          </div>

          <SearchPagination
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </>
      )}

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

export default Search;
