import {
  Search as SearchIcon,
  SlidersHorizontal,
  ArrowDownAZ,
  ArrowUpZA,
  ChevronDown,
} from "lucide-react";

const SearchFilters = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  sortOrder,
  setSortOrder,
  showSortDropdown,
  setShowSortDropdown,
  setPage,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
}) => {
  return (
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
  );
};

export default SearchFilters;
