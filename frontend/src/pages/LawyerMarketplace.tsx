import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Search, Filter, AlertCircle, ChevronLeft, ChevronRight, List, Grid } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
    ratingRange: { min: 0, max: 5 }
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
  
  // Fetch available filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/lawyers/filter-options`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch filter options');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setFilterOptions(data.data);
          
          // Initialize ranges based on available data
          setRatingRange([data.data.ratingRange.min, data.data.ratingRange.max]);
          setExperienceRange([data.data.experienceRange.min, data.data.experienceRange.max]);
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
        toast.error('Failed to load filter options');
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
          limit: '10',
          search: searchTerm,
          location: locationFilter === "all" ? "" : locationFilter,
          rating_min: ratingRange[0].toString(),
          rating_max: ratingRange[1].toString(),
          experience_min: experienceRange[0].toString(),
          experience_max: experienceRange[1].toString(),
          sort_by: sortBy,
          sort_order: sortOrder
        });
        
        // Add optional filters only if they're selected
        if (verifiedFilter !== "all") {
          params.append('is_verified', verifiedFilter);
        }
        
        if (languageFilter !== "all") {
          params.append('languages', languageFilter);
        }
        
        if (practiceAreaFilter !== "all") {
          params.append('practice_areas', practiceAreaFilter);
        }
        
        if (courtFilter !== "all") {
          params.append('courts', courtFilter);
        }
        
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/lawyers?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch lawyers data');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setLawyers(data.data);
          setTotalPages(data.pagination.totalPages);
          setTotalResults(data.pagination.totalResults);
        } else {
          throw new Error(data.message || 'Failed to fetch lawyers data');
        }
      } catch (error) {
        console.error('Error fetching lawyers:', error);
        setError('Failed to load lawyers data. Please try again.');
        toast.error('Failed to load lawyers data');
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
    sortOrder
  ]);
  
  // Handle reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setLocationFilter("all");
    setPracticeAreaFilter("all");
    setLanguageFilter("all");
    setCourtFilter("all");
    setVerifiedFilter("all");
    setRatingRange([filterOptions.ratingRange.min, filterOptions.ratingRange.max]);
    setExperienceRange([filterOptions.experienceRange.min, filterOptions.experienceRange.max]);
    setSortBy("rating");
    setSortOrder("desc");
    setCurrentPage(1);
  };
  
  // Extract experience years as a number
  const getExperienceYears = (experienceStr: string) => {
    const years = parseInt(experienceStr.split(' ')[0]);
    return isNaN(years) ? 0 : years;
  };
  
  // Format a lawyer's practice areas for display
  const formatPracticeAreas = (areas?: string[]) => {
    if (!areas || areas.length === 0) return "General Practice";
    if (areas.length === 1) return areas[0];
    return `${areas[0]} & ${areas.length - 1} more`;
  };
  
  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(5).fill(0).map((_, index) => (
      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden p-4">
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
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Find a Lawyer</h1>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Filter sidebar */}
            <div className={`md:col-span-1 ${showFilters ? 'block' : 'hidden md:block'}`}>
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

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
                <h3 className="font-medium">Filters</h3>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Location</label>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
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
                  <label className="text-sm font-medium mb-1 block">Practice Areas</label>
                  <Select value={practiceAreaFilter} onValueChange={setPracticeAreaFilter}>
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
                  <label className="text-sm font-medium mb-1 block">Languages</label>
                  <Select value={languageFilter} onValueChange={setLanguageFilter}>
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
                  <label className="text-sm font-medium mb-1 block">Courts</label>
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
                  <label className="text-sm font-medium mb-1 block">Verified</label>
                  <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All lawyers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All lawyers</SelectItem>
                      <SelectItem value="true">Verified only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Rating</label>
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
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Experience (years)</label>
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
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Sort By</label>
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
                  
                  <div className="flex justify-end mt-2">
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
                
                <Button variant="outline" onClick={handleResetFilters} className="w-full">
                  Reset Filters
                </Button>
              </div>
            </div>
            
            {/* Results section */}
            <div className="md:col-span-3">
              <div className="space-y-4">
                {loading ? (
                  renderSkeletons()
                ) : error ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <h3 className="text-lg font-medium">Error loading lawyers</h3>
                    <p className="text-gray-500 mt-2">{error}</p>
                    <Button onClick={() => window.location.reload()} className="mt-4">
                      Try Again
                    </Button>
                  </div>
                ) : lawyers.length > 0 ? (
                  <>
                    <div className="mb-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Showing {lawyers.length} of {totalResults} lawyers
                        {locationFilter !== "all" && (
                          <> in <span className="font-medium">{locationFilter}</span></>
                        )}
                        {practiceAreaFilter !== "all" && (
                          <> specializing in <span className="font-medium">{practiceAreaFilter}</span></>
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
                    
                    <div className={viewMode === "list" ? "grid grid-cols-1 gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
                      {lawyers.map((lawyer) => (
                        <div 
                          key={lawyer.name} 
                          className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                        >
                          <div className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="relative h-20 w-20 rounded-full overflow-hidden flex-shrink-0">
                                {/* Blurred background layer */}
                                <div 
                                  className="absolute inset-0" 
                                  style={{
                                    backgroundImage: `url(${lawyer.img_url || lawyer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=random`})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    filter: 'blur(10px) brightness(0.8)',
                                    transform: 'scale(1.2)'
                                  }}
                                />
                                {/* Main image centered */}
                                <img 
                                  src={lawyer.img_url || lawyer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=random`} 
                                  alt={lawyer.name}
                                  className="relative h-full w-full object-cover object-center z-10"
                                />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center gap-1">
                                      <h3 className="font-semibold text-lg">{lawyer.name}</h3>
                                      {lawyer.is_verified && (
                                        <Badge variant="secondary" className="ml-1 h-5 bg-blue-600 text-white">Verified</Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-500">
                                      {formatPracticeAreas(lawyer.practice_areas)}
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-center">
                                    <svg className="h-4 w-4 fill-yellow-400 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                    <span className="ml-1 text-sm font-medium">{lawyer.rating}</span>
                                    <span className="text-xs text-gray-500 ml-1">({lawyer.rating_count || lawyer.reviews || "N/A"})</span>
                                  </div>
                                </div>
                                
                                <div className="mt-2 flex flex-wrap gap-1">
                                  <Badge variant="outline" className="mr-1">{lawyer.experience}</Badge>
                                  {lawyer.languages.slice(0, 3).map(lang => (
                                    <Badge key={lang} variant="secondary" className="mr-1 text-white">{lang}</Badge>
                                  ))}
                                  {lawyer.languages.length > 3 && (
                                    <Badge variant="secondary">+{lawyer.languages.length - 3} more</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {(viewMode === "list" || window.innerWidth < 768) && (
                              <p className="mt-3 text-sm">
                                {lawyer.description || (lawyer.about && lawyer.about[0]) || "Experienced legal professional serving clients with dedication and expertise."}
                              </p>
                            )}
                            
                            <div className="mt-4 flex items-center justify-between">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-baseline cursor-pointer">
                                      <span className="font-semibold text-lg blur-sm">${lawyer.hourlyRate}</span>
                                      <span className="text-gray-500 text-sm ml-1 blur-sm">/hour</span>
                                      <Info className="h-4 w-4 ml-1 text-gray-400" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-64 text-xs">
                                      Contact the lawyer directly first to verify their rates and availability. 
                                      The rate shown would be updated as an estimate based on your deal, their experience and expertise.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline"
                                  onClick={() => navigate(`/lawyers/${lawyer.id || lawyer.name.replace(/\s+/g, '-').toLowerCase()}`)}
                                >
                                  View Profile
                                </Button>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          toast.info("Booking functionality will be implemented soon. Please view the lawyer's profile for contact information.", {
                                            duration: 3000
                                          });
                                        }}
                                      >
                                        Book Consultation
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="w-64 text-xs">
                                        Contact the lawyer first to check availability and discuss your legal matter before booking a consultation.
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
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-6 flex justify-center">
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="outline" 
                            size="icon"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          
                          <div className="text-sm px-4">
                            Page {currentPage} of {totalPages}
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="icon"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <h3 className="text-lg font-medium">No lawyers found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                    <Button onClick={handleResetFilters} className="mt-4">
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LawyerMarketplace; 