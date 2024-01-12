import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import { fetchAllJobs } from "./api";
import JobList from "./components/JobList";
import CategoryDropdown from "./components/CategoryDropdown";
import SearchBar from "./components/SearchBar";
import SortDropdown from "./components/SortDropdown";
import Pagination from "./components/Pagination";
import { Helmet } from "react-helmet";

import "./styles.css";

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("dateDesc");
  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(0);

  const categories = [
    "All",
    "AI / Research & Development",
    "Artificial Intelligence",
    "Financial Services",
    "Human Resources",
    "Software Engineering",
  ];

  const [displayedJobs, setDisplayedJobs] = useState([]);

  const [originalJobs, setOriginalJobs] = useState([]);

  const [dragAndDropUsed, setDragAndDropUsed] = useState(false);

  // State to track if drag and drop should be disabled
  const [isDragAndDropDisabled, setIsDragAndDropDisabled] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(""); // Reset error state
    try {
      //const data = await fetchAllJobs(currentPage);
      const data = await fetchAllJobs(currentPage, 10, 5000);
      if (data === null) {
        // Request was canceled, handle accordingly
        console.log("Data fetching was canceled.");
      } else if (data && data.data && Array.isArray(data.data.jobs)) {
        let jobsData = data.data.jobs;

        const orderedJobsKey = `orderedJobs-page${currentPage}`;
        // Check if 'orderedJobs' exists in local storage
        const orderedJobs = JSON.parse(localStorage.getItem(orderedJobsKey));

        if (selectedCategory === "All" && orderedJobs) {
          applyOrderFromLocalStorage(jobsData, orderedJobs);
        } else {
          const jobsAfterFiltering = filteredJobs(
            jobsData,
            searchTerm,
            selectedCategory
          );
          const jobsAfterSorting = getSortedJobs(
            jobsAfterFiltering,
            sortOption
          );
          setDisplayedJobs(jobsAfterSorting);
        }
        setTotalPages(data.meta.maxPage || 0);
      } else {
        setError("Failed to fetch jobs. No data returned.");
      }
    } catch (error) {
      if (error.message === "Request canceled due to timeout") {
        setError("Request timed out. Please try again.");
      } else {
        setError("Failed to fetch jobs. Please try again later.");
      }
    }
    setIsLoading(false);
  };

  // Debounce function to delay execution
  const debounce = (func, delay) => {
    let timerId;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  // Apply saved order from local storage
  const applyOrderFromLocalStorage = (fetchedJobs) => {
    const orderedJobsKey = `orderedJobs-page${currentPage}`;
    const orderedJobs = JSON.parse(localStorage.getItem(orderedJobsKey));

    if (orderedJobs) {
      // Reorder fetchedJobs based on the order in 'orderedJobs' for the current page
      const jobMap = new Map(fetchedJobs.map((job) => [job.id, job]));
      const reorderedJobs = orderedJobs
        .map((order) => jobMap.get(order.id))
        .filter((job) => job);
      setDisplayedJobs(reorderedJobs.length > 0 ? reorderedJobs : fetchedJobs);
    } else {
      setDisplayedJobs(fetchedJobs);
    }
  };

  // Utility to check if job has a specific category
  const jobHasCategory = (job, category) => {
    const categoryTag = job.tags.find(
      (tag) => tag.name.toLowerCase() === "category"
    );
    const match =
      categoryTag && categoryTag.value.toLowerCase() === category.toLowerCase();
    return match;
  };

  // Filter jobs based on searchTerm and selectedCategory
  const filteredJobs = (jobs, searchTerm, selectedCategory) => {
    if (!Array.isArray(jobs)) return [];
    return jobs.filter((job) => {
      const nameMatch = job.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const categoryMatch =
        selectedCategory === "All" || jobHasCategory(job, selectedCategory);
      return nameMatch && categoryMatch;
    });
  };

  // Sort jobs based on sortOption
  const getSortedJobs = (jobs, sortOption) => {
    if (!Array.isArray(jobs)) return [];
    switch (sortOption) {
      case "dateDesc":
        return [...jobs].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      case "dateAsc":
        return [...jobs].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
      case "nameAsc":
        return [...jobs].sort((a, b) => a.name.localeCompare(b.name));
      case "nameDesc":
        return [...jobs].sort((a, b) => b.name.localeCompare(a.name));
      case "categoryAsc":
        return [...jobs].sort((a, b) =>
          getCategory(a).localeCompare(getCategory(b))
        );
      case "categoryDesc":
        return [...jobs].sort((a, b) =>
          getCategory(b).localeCompare(getCategory(a))
        );

      default:
        return jobs;
    }
  };

  // Get the category of a job
  const getCategory = (job) => {
    const categoryTag = job.tags?.find(
      (tag) => tag.name.toLowerCase() === "category"
    );
    return categoryTag ? categoryTag.value : "Unknown";
  };

  // Handle drag-and-drop reordering
  const onDragEnd = useCallback(
    (result) => {
      if (isDragAndDropDisabled) {
        return;
      }

      const { source, destination } = result;
      if (!destination || source.index === destination.index) {
        return;
      }

      const newDisplayedJobs = Array.from(displayedJobs);
      const [reorderedItem] = newDisplayedJobs.splice(source.index, 1);
      newDisplayedJobs.splice(destination.index, 0, reorderedItem);
      setDisplayedJobs(newDisplayedJobs);

      localStorage.setItem("orderedJobs", JSON.stringify(newDisplayedJobs));
      localStorage.setItem(
        `orderedJobs-page${currentPage}`,
        JSON.stringify(newDisplayedJobs)
      );
      setDragAndDropUsed(true);
    },
    [displayedJobs, setDisplayedJobs, currentPage]
  );

  // Save filters to localStorage
  const saveFiltersToLocalStorage = () => {
    const filters = {
      searchTerm,
      selectedCategory,
      sortOption,
    };
    localStorage.setItem("userFilters", JSON.stringify(filters));
  };

  // useMemo for memoizing the filtered and sorted jobs
  const memoizedDisplayedJobs = useMemo(() => {
    const filteredJobs = jobs.filter((job) => {
      const nameMatch = job.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const categoryMatch =
        selectedCategory === "All" || jobHasCategory(job, selectedCategory);
      return nameMatch && categoryMatch;
    });

    const sortedJobs = getSortedJobs(filteredJobs, sortOption);
    return sortedJobs;
  }, [jobs, searchTerm, selectedCategory, sortOption]);

  // Handlers for changing filters
  // using useCallback to prevent unnecessary re-renders of those child components
  const handleSearchTermChange = useCallback(
    (newSearchTerm) => {
      setSearchTerm(newSearchTerm);
      saveFiltersToLocalStorage();
    },
    [setSearchTerm, saveFiltersToLocalStorage]
  );

  const handleCategoryChange = useCallback(
    (newCategory) => {
      setSelectedCategory(newCategory);
      saveFiltersToLocalStorage();
    },
    [setSelectedCategory, saveFiltersToLocalStorage]
  );

  const handleSortOptionChange = useCallback(
    (newSortOption) => {
      setSortOption(newSortOption);
      saveFiltersToLocalStorage();
    },
    [setSortOption, saveFiltersToLocalStorage]
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSortOption("dateDesc");
    setCurrentPage(1);

    fetchData();

    saveFiltersToLocalStorage();

    setOriginalJobs([]);

    localStorage.removeItem("userFilters");
    localStorage.removeItem("orderedJobs");
    localStorage.removeItem("orderedJobs-page1");
    localStorage.removeItem("orderedJobs-page2");
    setDragAndDropUsed(false);
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentPage, selectedCategory, sortOption]);

  useEffect(() => {
    // Set displayed jobs from memoized value
    setDisplayedJobs(memoizedDisplayedJobs);
  }, [memoizedDisplayedJobs]);

  useEffect(() => {
    // This effect restores filters from local storage when the component mounts
    const savedFilters = JSON.parse(localStorage.getItem("userFilters"));
    if (savedFilters) {
      setSearchTerm(savedFilters.searchTerm || "");
      setSelectedCategory(savedFilters.selectedCategory || "All");
      setSortOption(savedFilters.sortOption || "dateDesc");
    }
  }, []);

  useEffect(() => {
    // Disable drag and drop if a specific category is selected (not 'All')
    setIsDragAndDropDisabled(selectedCategory !== "All");
  }, [selectedCategory]);

  useEffect(() => {
    const orderedJobs = JSON.parse(localStorage.getItem("orderedJobs"));
    if (orderedJobs) {
      setDisplayedJobs(orderedJobs);
    } else {
      fetchData();
    }
  }, [currentPage, searchTerm, selectedCategory, sortOption]);

  useEffect(() => {
    console.log("Jobs updated:", jobs);
  }, [jobs]);

  return (
    <div className="app">
      <Helmet>
        <title>Job Listings - Find Your Job</title>
        <meta
          name="description"
          content="Browse through our extensive list of job opportunities in various categories. Find your dream job with us."
        />
        <meta
          name="keywords"
          content="jobs, employment, career, job listings, work, hiring"
        />
      </Helmet>
      <div className="flex flex-col sm:flex-row justify-between p-2.5 bg-gray-100 space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="flex-grow">
          <SearchBar value={searchTerm} onChange={handleSearchTermChange} />
        </div>
        <div className="flex-grow sm:mr-4">
          <CategoryDropdown
            categories={categories}
            value={selectedCategory}
            onChange={handleCategoryChange}
          />
        </div>
        <div className="flex-grow sm:mr-4">
          <SortDropdown
            sortOption={sortOption}
            setSortOption={handleSortOptionChange}
            disabled={dragAndDropUsed}
          />
        </div>
        <button
          onClick={resetFilters}
          className="w-full sm:w-auto px-4 py-2 text-white bg-red-500 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-500 transition duration-150 ease-in-out mt-2 sm:mt-0"
        >
          Reset Filters
        </button>
      </div>

      {isLoading && <p>Loading jobs...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && jobs.length > 1 && (
        <p>No jobs available. Please adjust your search and filter criteria.</p>
      )}
      {!isLoading &&
        !error &&
        jobs.length > 0 &&
        displayedJobs.length === 0 &&
        !searchTerm && (
          <p>No jobs found for the selected filters. Try resetting filters.</p>
        )}
      {!isLoading && !error && displayedJobs.length === 0 && searchTerm && (
        <p>No jobs found for "{searchTerm}". Please try a different search.</p>
      )}
      {!isLoading && !error && displayedJobs.length > 0 && (
        <JobList
          jobs={displayedJobs}
          onDragEnd={onDragEnd}
          isDragAndDropDisabled={isDragAndDropDisabled}
        />
      )}
      {!isLoading && !error && displayedJobs.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default App;
