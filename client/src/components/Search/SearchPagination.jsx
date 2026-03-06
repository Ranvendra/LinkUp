import { ChevronLeft, ChevronRight } from "lucide-react";

const SearchPagination = ({ page, setPage, totalPages }) => {
  const renderPageNumbers = () => {
    const pages = [];

    const renderButton = (i) => (
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

    const renderDots = (key) => (
      <span key={key} className="px-2 text-gray-400 self-center">
        ...
      </span>
    );

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(renderButton(i));
      }
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(renderButton(i));
        }
        pages.push(renderDots("dots-end"));
        pages.push(renderButton(totalPages));
      } else if (page >= totalPages - 3) {
        pages.push(renderButton(1));
        pages.push(renderDots("dots-start"));
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(renderButton(i));
        }
      } else {
        pages.push(renderButton(1));
        pages.push(renderDots("dots-start"));
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(renderButton(i));
        }
        pages.push(renderDots("dots-end"));
        pages.push(renderButton(totalPages));
      }
    }

    return pages;
  };

  return (
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
  );
};

export default SearchPagination;
