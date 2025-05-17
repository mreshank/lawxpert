import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Info,
  Search,
  Filter,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  List,
  Grid,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { endpoints } from "@/lib/api";

// Interfaces
interface Lawyer {
  id?: number;
  name: string;
  avatar?: string;
  img_url?: string;
  specialization?: string;
  practice_areas?: string[];
  rating: number;
  rating_count?: string;
  hourlyRate?: number;
  reviews?: number;
  experience: string;
  description?: string;
  about?: string[];
  languages: string[];
  available?: boolean;
  is_verified?: boolean;
  location: string;
  courts?: string[];
  bio?: string;
  education?: string[];
  certifications?: string[];
}

interface FilterOptions {
  locations: string[];
  languages: string[];
  practiceAreas: string[];
  courts: string[];
  experienceRange: { min: number; max: number };
  ratingRange: { min: number; max: number };
}

const LawyerMarketplace = () => {
  const navigate = useNavigate();
  // State for lawyers data and loading status
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // State for filter options (available choices)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    locations: [],
    languages: [],
    practiceAreas: [],
    courts: [],
    experienceRange: { min: 0, max: 50 },
    ratingRange: { min: 0, max: 5 },
  });

  // State for active filters
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [practiceAreaFilter, setPracticeAreaFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [courtFilter, setCourtFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [ratingRange, setRatingRange] = useState([0, 5]);
  const [experienceRange, setExperienceRange] = useState([0, 50]);
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch available filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}${
            endpoints.lawyers.data
          }/filter-options`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch filter options");
        }

        const data = await response.json();

        if (data.success) {
          setFilterOptions(data.data);

          // Initialize ranges based on available data
          setRatingRange([
            data.data.ratingRange.min,
            data.data.ratingRange.max,
          ]);
          setExperienceRange([
            data.data.experienceRange.min,
            data.data.experienceRange.max,
          ]);
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
        toast.error("Failed to load filter options");
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch lawyers data with current filters
  useEffect(() => {
    const fetchLawyers = async () => {
      setLoading(true);
      setError(null);

      try {
        // Construct query parameters
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "10",
          search: searchTerm,
          location: locationFilter === "all" ? "" : locationFilter,
          rating_min: ratingRange[0].toString(),
          rating_max: ratingRange[1].toString(),
          experience_min: experienceRange[0].toString(),
          experience_max: experienceRange[1].toString(),
          sort_by: sortBy,
          sort_order: sortOrder,
        });

        // Add optional filters only if they're selected
        if (verifiedFilter !== "all") {
          params.append("is_verified", verifiedFilter);
        }

        if (languageFilter !== "all") {
          params.append("languages", languageFilter);
        }

        if (practiceAreaFilter !== "all") {
          params.append("practice_areas", practiceAreaFilter);
        }

        if (courtFilter !== "all") {
          params.append("courts", courtFilter);
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}${
            endpoints.lawyers.data
          }?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch lawyers data");
        }

        const data = await response.json();

        if (data.success) {
          setLawyers(data.data);
          setTotalPages(data.pagination.totalPages);
          setTotalResults(data.pagination.totalResults);
        } else {
          throw new Error(data.message || "Failed to fetch lawyers data");
        }
      } catch (error) {
        console.error("Error fetching lawyers:", error);
        setError("Failed to load lawyers data. Please try again.");
        toast.error("Failed to load lawyers data");
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, [
    currentPage,
    searchTerm,
    locationFilter,
    ratingRange,
    experienceRange,
    verifiedFilter,
    languageFilter,
    practiceAreaFilter,
    courtFilter,
    sortBy,
    sortOrder,
  ]);

  // Handle reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setLocationFilter("all");
    setPracticeAreaFilter("all");
    setLanguageFilter("all");
    setCourtFilter("all");
    setVerifiedFilter("all");
    setRatingRange([
      filterOptions.ratingRange.min,
      filterOptions.ratingRange.max,
    ]);
    setExperienceRange([
      filterOptions.experienceRange.min,
      filterOptions.experienceRange.max,
    ]);
    setSortBy("rating");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  // Extract experience years as a number
  const getExperienceYears = (experienceStr: string) => {
    const years = parseInt(experienceStr.split(" ")[0]);
    return isNaN(years) ? 0 : years;
  };

  // Format practice areas to show max 2 areas on mobile
  const formatPracticeAreas = (areas?: string[]) => {
    if (!areas || areas.length === 0) return "General Practice";
    
    if (isMobile && areas.length > 2) {
      return `${areas.slice(0, 2).join(", ")} +${areas.length - 2}`;
    }
    
    return areas.join(", ");
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden p-4"
        >
          <div className="flex items-start gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/3 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
          <Skeleton className="h-4 w-full mt-4" />
          <div className="mt-4 flex justify-between">
            <Skeleton className="h-8 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
      ));
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 pb-4">
        <div className="mt-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Find a Lawyer
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            Showing {loading ? "..." : totalResults} lawyers matching your criteria
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:gap-6">
          {/* Filters sidebar - collapsed on mobile */}
          <div
            className={`md:w-64 md:flex-shrink-0 ${
              showFilters
                ? "bg-white/20 backdrop-blur-sm dark:bg-gray-800 md:bg-transparent md:dark:bg-transparent fixed inset-0 z-40 overflow-y-auto md:static md:overflow-visible"
                : "hidden md:block"
            }`}
          >
            {/* Mobile overlay background */}
            {showFilters && (
              <div 
                className="md:hidden fixed inset-0 bg-gray-800/20 z-40"
                onClick={() => setShowFilters(false)}
              />
            )}
            
            {/* Filter content */}
            <div className={`relative ${showFilters ? "z-50 h-fit md:h-auto mx-4 my-16 pt-4 md:m-0" : ""}`}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search lawyers..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Filters</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="md:hidden h-8 w-8 p-0"
                    onClick={() => setShowFilters(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Location
                    </label>
                    <Select
                      value={locationFilter}
                      onValueChange={setLocationFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All lawyers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All lawyers</SelectItem>
                        {filterOptions.locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Practice Areas
                    </label>
                    <Select
                      value={practiceAreaFilter}
                      onValueChange={setPracticeAreaFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All practice areas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All practice areas</SelectItem>
                        {filterOptions.practiceAreas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Languages
                    </label>
                    <Select 
                      value={languageFilter}
                      onValueChange={setLanguageFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All languages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All languages</SelectItem>
                        {filterOptions.languages.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Courts
                    </label>
                    <Select value={courtFilter} onValueChange={setCourtFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All courts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All courts</SelectItem>
                        {filterOptions.courts.map((court) => (
                          <SelectItem key={court} value={court}>
                            {court}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Verified
                    </label>
                    <Select
                      value={verifiedFilter}
                      onValueChange={setVerifiedFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All lawyers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All lawyers</SelectItem>
                        <SelectItem value="true">Verified only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* <div className="sm:col-span-2 md:col-span-1"> */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Sort By
                    </label>
                    <div className="flex justify-end mt-2--x gap-4">
                      <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="experience">Experience</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                      </SelectContent>
                    </Select>

                    {/*  */}
                      <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Order" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asc">Ascending</SelectItem>
                          <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="sm:col-span-2 md:col-span-1">
                    <label className="text-sm font-medium mb-1 block">
                      Rating
                    </label>
                    <div className="px-2">
                      <Slider
                        defaultValue={ratingRange}
                        min={filterOptions.ratingRange.min}
                        max={filterOptions.ratingRange.max}
                        step={0.5}
                        onValueChange={setRatingRange}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{ratingRange[0]}</span>
                        <span>{ratingRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2 md:col-span-1">
                    <label className="text-sm font-medium mb-1 block">
                      Experience (years)
                    </label>
                    <div className="px-2">
                      <Slider
                        defaultValue={experienceRange}
                        min={filterOptions.experienceRange.min}
                        max={filterOptions.experienceRange.max}
                        step={1}
                        onValueChange={setExperienceRange}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{experienceRange[0]} years</span>
                        <span>{experienceRange[1]} years</span>
                      </div>
                    </div>
                  </div>

                </div>
                
                <div className="mt-4 sm:col-span-2 md:col-span-1">
                  <Button 
                    variant="outline" 
                    onClick={handleResetFilters}
                    className="w-full"
                  >
                    Reset Filters
                  </Button>
                  
                  {/* Apply filters button - mobile only */}
                  <Button 
                    className="w-full mt-2 md:hidden"
                    onClick={() => setShowFilters(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Search and filter bar */}
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search lawyers..."
                  className="pl-8 pr-4 py-1.5 h-10 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden py-1.5 h-10 px-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Filters
                </Button>

                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value)}
                >
                  <SelectTrigger className="w-[120px] h-10 text-sm py-1.5">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="sm"
                  className="px-1 h-10"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  {sortOrder === "asc" ? (
                    <ChevronLeft className="h-4 w-4 rotate-90" />
                  ) : (
                    <ChevronRight className="h-4 w-4 rotate-90" />
                  )}
                </Button>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {/* Results count and view mode toggle */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {loading ? (
                    <span>Loading...</span>
                  ) : error ? (
                    <span className="flex items-center text-red-500">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {error}
                    </span>
                  ) : (
                    <>
                      <span>
                        Showing{" "}
                        <span className="font-medium">
                          {(currentPage - 1) * 10 + 1}-
                          {Math.min(currentPage * 10, totalResults)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">{totalResults}</span>{" "}
                        lawyers
                      </span>
                    </>
                  )}
                </div>

                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm text-gray-500">View:</span>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Loading skeletons or lawyers list */}
              {loading ? (
                renderSkeletons()
              ) : (
                <div
                  className={
                    viewMode === "list"
                      ? "grid grid-cols-1 gap-3"
                      : "grid grid-cols-1 md:grid-cols-2 gap-3"
                  }
                >
                  {lawyers.map((lawyer) => (
                    <div
                      key={lawyer.name}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                    >
                      <div className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden flex-shrink-0">
                            {/* Blurred background layer */}
                            <div
                              className="absolute inset-0"
                              style={{
                                backgroundImage: `url(${
                                  lawyer.img_url ||
                                  lawyer.avatar ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    lawyer.name
                                  )}&background=random`
                                })`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                filter: "blur(10px) brightness(0.8)",
                                transform: "scale(1.2)",
                              }}
                            />
                            {/* Main image centered */}
                            <img
                              src={
                                lawyer.img_url ||
                                lawyer.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  lawyer.name
                                )}&background=random`
                              }
                              alt={lawyer.name}
                              className="relative h-full w-full object-cover object-center z-10"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div className="min-w-0">
                                <div className="flex items-center gap-1 flex-wrap">
                                  <h3 className="font-semibold text-base sm:text-lg truncate">
                                    {lawyer.name}
                                  </h3>
                                  {lawyer.is_verified && (
                                    <Badge
                                      variant="secondary"
                                      className="ml-1 h-4 sm:h-5 text-xs bg-blue-600 text-white"
                                    >
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs sm:text-sm text-gray-500 truncate">
                                  {formatPracticeAreas(
                                    lawyer.practice_areas
                                  )}
                                </p>
                              </div>
                              
                              <div className="flex items-center shrink-0 ml-1">
                                <svg
                                  className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                                <span className="ml-0.5 text-xs sm:text-sm font-medium">
                                  {lawyer.rating}
                                </span>
                                <span className="text-[10px] sm:text-xs text-gray-500 ml-0.5">
                                  ({lawyer.rating_count || lawyer.reviews || "N/A"})
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-1 sm:mt-2 flex flex-wrap gap-1">
                              <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0 h-5">
                                {lawyer.experience}
                              </Badge>
                              {lawyer.languages.slice(0, isMobile ? 2 : 3).map((lang) => (
                                <Badge
                                  key={lang}
                                  variant="secondary"
                                  className="text-[10px] sm:text-xs px-1.5 py-0 h-5 text-white"
                                >
                                  {lang}
                                </Badge>
                              ))}
                              {lawyer.languages.length > (isMobile ? 2 : 3) && (
                                <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0 h-5">
                                  +{lawyer.languages.length - (isMobile ? 2 : 3)} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {(viewMode === "list" || isMobile) && (
                          <p className="mt-2 text-xs sm:text-sm line-clamp-2">
                            {lawyer.description ||
                              (lawyer.about && lawyer.about[0]) ||
                              "Experienced legal professional serving clients with dedication and expertise."}
                          </p>
                        )}
                        
                        <div className="mt-3 flex items-center justify-between">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-baseline cursor-pointer">
                                  <span className="font-semibold text-sm sm:text-base blur-sm">
                                    ${lawyer.hourlyRate}
                                  </span>
                                  <span className="text-gray-500 text-[10px] sm:text-xs ml-0.5 blur-sm">
                                    /hour
                                  </span>
                                  <Info className="h-3 w-3 sm:h-4 sm:w-4 ml-0.5 text-gray-400" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-64 text-xs">
                                  Contact the lawyer directly first to
                                  verify their rates and availability. The
                                  rate shown would be updated as an estimate
                                  based on your deal, their experience and
                                  expertise.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <div className="flex gap-1 sm:gap-2">
                            <Button 
                              variant="outline"
                              size={isMobile ? "sm" : "default"}
                              className="text-xs sm:text-sm h-7 sm:h-auto px-2 sm:px-3"
                              onClick={() =>
                                navigate(
                                  `/lawyers/${
                                    lawyer.id ||
                                    lawyer.name
                                      .replace(/\s+/g, "-")
                                      .toLowerCase()
                                  }`
                                )
                              }
                            >
                              View Profile
                            </Button>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size={isMobile ? "sm" : "default"}
                                    className="text-xs sm:text-sm h-7 sm:h-auto px-2 sm:px-3"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      toast.info(
                                        "Booking functionality will be implemented soon. Please view the lawyer's profile for contact information.",
                                        {
                                          duration: 3000,
                                        }
                                      );
                                    }}
                                  >
                                    Book Consultation
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-64 text-xs">
                                    Booking functionality will be available soon
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <Pagination className="mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="text-xs"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                      )
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 &&
                            array[index - 1] !== page - 1 && (
                              <span className="text-gray-500 px-2">...</span>
                            )}
                          <Button
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="h-8 w-8 p-0 text-xs"
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="text-xs"
                  >
                    Next
                  </Button>
                </Pagination>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LawyerMarketplace; 
