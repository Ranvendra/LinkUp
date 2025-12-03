import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Search as SearchIcon,
  SlidersHorizontal,
  ArrowDownAZ,
  ArrowUpZA,
  ChevronDown,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Check,
} from "lucide-react";

const Search = () => {
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

  const fetchUsers = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 12,
        search: searchQuery,
        sort: sortOrder,
        ...filters,
      }).toString();

      const res = await api.get(`/search?${queryParams}`);

      setUsers(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      alert(err.response?.data?.message || "Failed to send connection request");
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            page === i
              ? "bg-[#FF6B5A] text-white shadow-lg shadow-[#FF6B5A]/30"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
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

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar with Button */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B5A] focus:ring-2 focus:ring-[#FF6B5A]/10 transition-all"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-red-500 text-white rounded-xl font-medium hover:scale-[0.95] transition-all flex items-center gap-2 shadow-lg shadow-[#FF6B5A]/30"
          >
            <SearchIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* Sort and Filters Row */}
        <div className="flex gap-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className={`px-5 py-2.5 rounded-xl border transition-all flex items-center gap-2 ${
                sortOrder
                  ? "bg-[#FFF5F3] text-[#FF6B5A] border-[#FF6B5A]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
              }`}
            >
              {sortOrder === "asc" ? (
                <ArrowDownAZ className="w-4 h-4" />
              ) : sortOrder === "desc" ? (
                <ArrowUpZA className="w-4 h-4" />
              ) : (
                <ArrowDownAZ className="w-4 h-4" />
              )}
              <span className="font-medium text-sm">Sort</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showSortDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showSortDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg z-10 overflow-hidden animate-slideDown">
                <button
                  onClick={() => {
                    setSortOrder(sortOrder === "asc" ? "" : "asc");
                    setShowSortDropdown(false);
                    setPage(1);
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                    sortOrder === "asc"
                      ? "bg-[#FFF5F3] text-[#FF6B5A]"
                      : "text-gray-700"
                  }`}
                >
                  <ArrowDownAZ className="w-5 h-5" />
                  <span className="flex-1 text-left text-sm font-medium">
                    A-Z
                  </span>
                  {sortOrder === "asc" && (
                    <div className="w-2 h-2 bg-[#FF6B5A] rounded-full"></div>
                  )}
                </button>
                <button
                  onClick={() => {
                    setSortOrder(sortOrder === "desc" ? "" : "desc");
                    setShowSortDropdown(false);
                    setPage(1);
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                    sortOrder === "desc"
                      ? "bg-[#FFF5F3] text-[#FF6B5A]"
                      : "text-gray-700"
                  }`}
                >
                  <ArrowUpZA className="w-5 h-5" />
                  <span className="flex-1 text-left text-sm font-medium">
                    Z-A
                  </span>
                  {sortOrder === "desc" && (
                    <div className="w-2 h-2 bg-[#FF6B5A] rounded-full"></div>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-5 py-2.5 rounded-xl border transition-all flex items-center gap-2 ${
              showFilters
                ? "bg-[#FF6B5A] text-white border-[#FF6B5A]"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="font-medium text-sm">Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 animate-slideDown">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Gender
                </label>
                <select
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B5A] focus:ring-1 focus:ring-[#FF6B5A]/10"
                  value={filters.gender}
                  onChange={(e) => {
                    setFilters({ ...filters, gender: e.target.value });
                    setPage(1);
                  }}
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Age Range
                </label>
                <select
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B5A] focus:ring-1 focus:ring-[#FF6B5A]/10"
                  value={filters.ageRange}
                  onChange={(e) => {
                    setFilters({ ...filters, ageRange: e.target.value });
                    setPage(1);
                  }}
                >
                  <option value="">All Ages</option>
                  <option value="<20">Less than 20</option>
                  <option value="20-30">20 - 30</option>
                  <option value="30-40">30 - 40</option>
                  <option value="40-50">40 - 50</option>
                  <option value="50-60">50 - 60</option>
                  <option value=">60">More than 60</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

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
              <div
                key={user._id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative aspect-4/5 overflow-hidden bg-gray-100">
                  <img
                    src={
                      user.photoUrl ||
                      user.profilePicture ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    alt={user.firstName || user.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Connect Button - Visible on hover */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {user.connectionStatus === "connected" ? (
                      <div className="bg-green-500 text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg">
                        <Check className="w-4 h-4" />
                        Connected
                      </div>
                    ) : user.connectionStatus === "pending" ? (
                      <div className="bg-yellow-500 text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg">
                        <Check className="w-4 h-4" />
                        Pending
                      </div>
                    ) : requestedUsers.has(user._id) ? (
                      <div className="bg-blue-500 text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg">
                        <Check className="w-4 h-4" />
                        Request Sent
                      </div>
                    ) : (
                      <button
                        onClick={() => sendConnectionRequest(user._id)}
                        className="bg-white/95 backdrop-blur-sm text-[#FF6B5A] px-4 py-2 rounded-full font-medium text-sm hover:bg-white hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
                      >
                        <UserPlus className="w-4 h-4" />
                        Connect
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {user.firstName || user.name}{" "}
                      {user.lastName && user.lastName}
                      {user.age && `, ${user.age}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {user.gender || "Not specified"}
                    </p>
                  </div>

                  {user.about && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {user.about}
                    </p>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    {user.interests?.slice(0, 2).map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                    {user.interests?.length > 2 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        +{user.interests.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {renderPageNumbers()}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
