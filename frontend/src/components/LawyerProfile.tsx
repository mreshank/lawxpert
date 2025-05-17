import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

// SVG Icons
const StarIcon = () => (
  <svg
    className="h-5 w-5 fill-yellow-400 text-yellow-400"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const CalendarIcon = () => (
  <svg
    className="h-10 w-10 mx-auto text-gray-400"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ClockIcon = () => (
  <svg
    className="mr-2 h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const MapPinIcon = () => (
  <svg
    className="h-4 w-4 mr-2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const MailIcon = () => (
  <svg
    className="h-4 w-4 mr-2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const PhoneIcon = () => (
  <svg
    className="h-4 w-4 mr-2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const AwardIcon = () => (
  <svg
    className="h-4 w-4 mr-2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

const BriefcaseIcon = () => (
  <svg
    className="h-4 w-4 mr-2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const CheckIcon = () => (
  <svg
    className="h-4 w-4 text-green-500 mb-1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// Lawyer interface
interface Lawyer {
  id?: number;
  name: string;
  avatar?: string;
  img_url?: string;
  specialization?: string[];
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
  location?: string;
  courts?: string[];
  education?: string[];
  certifications?: string[];
  address?: string;
  email?: string;
  phone?: string;
  bio?: string;
  popular_reviews?: {
    id: number;
    name: string;
    avatar?: string;
    rating?: number;
    date?: string;
    age?: string;
    verified_client?: boolean;
    review?: string;
    content?: string;
  }[];
  questions_answered?: {
    question: string;
    answer: string;
  }[];
  faq?: {
    question: string;
    answer: string;
  }[];
}

interface LawyerProfileProps {
  lawyer: Lawyer;
  onClose: () => void;
}

// Structured data for better SEO
const LawyerStructuredData = ({ lawyer }: { lawyer: Lawyer }) => {
  // Extract years of experience as a number for structured data
  const extractYearsOfExperience = (expString: string): number => {
    const match = expString.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Attorney",
    "name": lawyer.name,
    "image": lawyer.img_url || lawyer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}`,
    "description": lawyer.description || (lawyer.about && lawyer.about[0]) || `${lawyer.name} is a legal professional with ${lawyer.experience} of experience.`,
    "knowsLanguage": lawyer.languages,
    "yearsOfExperience": extractYearsOfExperience(lawyer.experience),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": lawyer.rating,
      "reviewCount": lawyer.reviews || lawyer.rating_count || "0"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": lawyer.location
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
};

const LawyerProfile = ({ lawyer, onClose }: LawyerProfileProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [showAllPracticeAreas, setShowAllPracticeAreas] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock time slots
  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];
  
  // Generate random background color for avatar
  const getRandomColor = (name: string) => {
    // Use a hash of the name to get a consistent color for the same name
    const colors = [
      "#4f46e5", "#0891b2", "#0284c7", "#7c3aed", "#7e22ce", 
      "#c026d3", "#be185d", "#db2777", "#e11d48", "#f97316", 
      "#16a34a", "#84cc16", "#ca8a04"
    ];
    
    // Simple hash function
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  // Generate random star rating with specified distribution
  const getRandomRating = (name: string) => {
    // Use hash of name for consistent rating for same name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rand = (hash % 100) + 1;
    
    if (rand <= 2) return 1;       // 2% chance - super rare
    else if (rand <= 7) return 2;  // 5% chance - rare
    else if (rand <= 20) return 3; // 13% chance - uncommon
    else if (rand <= 75) return 4; // 55% chance - common
    else return 5;                 // 25% chance - less common
  };

  // Process practice areas
  const practiceAreas = lawyer.practice_areas || lawyer.specialization || ["General Practice"];
  const hasMorePracticeAreas = Array.isArray(practiceAreas) && practiceAreas.length > (isMobile ? 2 : 3);
  const displayedPracticeAreas = showAllPracticeAreas 
    ? practiceAreas 
    : (Array.isArray(practiceAreas) ? practiceAreas.slice(0, isMobile ? 2 : 3) : [practiceAreas]);

  // Determine which reviews to show
  const reviews = lawyer.popular_reviews || [];
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  const hasMoreReviews = reviews.length > 3;

  return (
    <>
      <LawyerStructuredData lawyer={lawyer} />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Back button */}
        <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex items-center text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to results
          </button>
        </div>

        {/* Lawyer header */}
        <div className="p-3 sm:p-5 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 rounded-full overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
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

            <div className="flex-1">
              <div className="flex flex-col gap-3">
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold">{lawyer.name}</h1>
                    {lawyer.is_verified && (
                      <Badge
                        variant="secondary"
                        className="h-5 bg-blue-600 text-white text-xs"
                      >
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1">
                    <div className="flex flex-wrap gap-x-1.5 gap-y-1 items-center justify-center sm:justify-start">
                      {displayedPracticeAreas.map((v) => {
                        return (
                          <Badge
                            key={v}
                            variant="outline"
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-950 dark:text-blue-300 text-xs py-0 h-5"
                          >
                            {v}
                          </Badge>
                        );
                      })}
                      
                      {hasMorePracticeAreas && (
                        <button 
                          onClick={() => setShowAllPracticeAreas(!showAllPracticeAreas)}
                          className="text-xs text-blue-600 dark:text-blue-400 ml-1"
                        >
                          {showAllPracticeAreas ? "Show less" : `+${practiceAreas.length - (isMobile ? 2 : 3)} more`}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start mt-1.5">
                    <StarIcon />
                    <span className="ml-1 font-medium text-sm">{lawyer.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({lawyer.reviews || lawyer.rating_count || "N/A"} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-start mt-1 sm:mt-0">
                  <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                    <Badge variant="outline" className="text-xs py-0 h-5">{lawyer.experience}</Badge>
                    {lawyer.languages.slice(0, isMobile ? 2 : 3).map((lang) => (
                      <Badge key={lang} variant="secondary" className="text-white text-xs py-0 h-5">
                        {lang}
                      </Badge>
                    ))}
                    {lawyer.languages.length > (isMobile ? 2 : 3) && (
                      <Badge variant="secondary" className="text-white text-xs py-0 h-5">
                        +{lawyer.languages.length - (isMobile ? 2 : 3)} more
                      </Badge>
                    )}
                    {lawyer.courts && lawyer.courts.length > 0 && !isMobile && (
                      <Badge variant="outline" className="text-xs py-0 h-5">
                        {lawyer.courts[0]}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-2 mt-3 w-full sm:w-auto">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 text-xs">
                            <Badge
                              variant="outline"
                              className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs"
                            >
                              Contact for pricing
                            </Badge>
                            <Info className="h-3.5 w-3.5 text-blue-500" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-64 text-xs">
                            Contact the lawyer directly first to verify their rates
                            and availability. The rate shown would be updated as an
                            estimate based on your deal, their experience and
                            expertise.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Button className="mt-2 sm:mt-0 text-sm h-8 px-3 w-full sm:w-auto">Book Consultation</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content tabs */}
        <Tabs defaultValue="about" className="p-3 sm:p-5">
          <TabsList className="grid w-full grid-cols-4 mb-3 sm:mb-4">
            <TabsTrigger
              value="about"
              className="text-xs sm:text-sm py-1.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-medium"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="experience"
              className="text-xs sm:text-sm py-1.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-medium"
            >
              Experience
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="text-xs sm:text-sm py-1.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-medium"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="booking"
              className="text-xs sm:text-sm py-1.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-medium"
            >
              Book
            </TabsTrigger>
          </TabsList>

          {/* About tab */}
          <TabsContent value="about" className="mt-3">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">About {lawyer.name}</h2>
            <div className="space-y-3">
              {lawyer.about && lawyer.about.map((paragraph, index) => (
                <p key={index} className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  {paragraph}
                </p>
              ))}
              {(!lawyer.about || lawyer.about.length === 0) && (
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  Experienced legal professional serving clients with dedication and expertise.
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="font-medium mb-1.5 flex items-center text-sm sm:text-base">
                  <MapPinIcon />
                  Office Location
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {lawyer.location || "Contact for address details"}
                </p>
                
                <h3 className="font-medium mb-1.5 mt-3 flex items-center text-sm sm:text-base">
                  <MailIcon />
                  Contact Information
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Contact through LawXpert platform to connect with this lawyer
                </p>
                
                {lawyer.courts && lawyer.courts.length > 0 && (
                  <>
                    <h3 className="font-medium mb-1.5 mt-3 flex items-center text-sm sm:text-base">
                      <BriefcaseIcon />
                      Courts
                    </h3>
                    <ul className="space-y-0.5">
                      {lawyer.courts.map((court, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                          {court}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-1.5 flex items-center text-sm sm:text-base">
                  <AwardIcon />
                  Experience & Education
                </h3>
                <ul className="space-y-1">
                  <li className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Experience:</span> {lawyer.experience}
                  </li>
                  {lawyer.education && lawyer.education.map((edu, index) => (
                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{edu}</li>
                  ))}
                </ul>
                
                {lawyer.questions_answered && lawyer.questions_answered.length > 0 && (
                  <>
                    <h3 className="font-medium mb-1.5 mt-3 flex items-center text-sm sm:text-base">
                      <BriefcaseIcon />
                      Sample Case Questions
                    </h3>
                    <div className="space-y-3">
                      {lawyer.questions_answered.slice(0, 2).map((qa, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                          <p className="font-medium text-sm">{qa.question}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {qa.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                {lawyer.certifications && lawyer.certifications.length > 0 && (
                  <>
                    <h3 className="font-medium mb-1.5 mt-3 flex items-center text-sm sm:text-base">
                      <BriefcaseIcon />
                      Certifications
                    </h3>
                    <ul className="space-y-1">
                      {lawyer.certifications.map((cert, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{cert}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
            
            {lawyer.faq && lawyer.faq.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {lawyer.faq.slice(0, 3).map((item, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                      <h4 className="font-medium">{item.question}</h4>
                      <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Experience tab */}
          <TabsContent value="experience" className="mt-4">
            <h2 className="text-xl font-semibold mb-3">
              Professional Experience
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-2 border-blue-500 pl-4">
                <h3 className="font-medium">{lawyer.name}</h3>
                <p className="text-sm text-gray-500">
                  {lawyer.experience} of Legal Experience
                </p>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {lawyer.about ? lawyer.about[0] : 
                    "Experienced legal professional providing dedicated counsel and representation to clients."}
                </p>
              </div>
              
              {lawyer.courts && lawyer.courts.length > 0 && (
                <div className="border-l-2 border-blue-500 pl-4">
                  <h3 className="font-medium">Court Practice</h3>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    Represents clients in: {lawyer.courts.join(', ')}
                  </p>
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">
              Areas of Expertise
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {lawyer.practice_areas && lawyer.practice_areas.length > 0 ? (
                lawyer.practice_areas.map((area) => (
                  <div key={area} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <CheckIcon />
                    <span>{area}</span>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <CheckIcon />
                  <span>General Legal Practice</span>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Reviews tab */}
          <TabsContent value="reviews" className="mt-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Client Reviews</h2>
              <div className="flex items-center">
                <StarIcon />
                <span className="ml-1 font-medium">{lawyer.rating}</span>
                <span className="text-sm text-gray-500 ml-1">
                  ({lawyer.reviews || lawyer.rating_count || "N/A"} reviews)
                </span>
              </div>
            </div>
            
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {displayedReviews.map((review) => {
                  // Use actual review rating or generate one if not present
                  const rating = review.rating || getRandomRating(review.name);
                  
                  return (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                      <div className="flex items-start gap-4">
                        {review.avatar ? (
                          <Avatar className="h-10 w-10">
                            <img src={review.avatar} alt={review.name} />
                          </Avatar>
                        ) : (
                          <div 
                            className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium"
                            style={{ backgroundColor: getRandomColor(review.name) }}
                          >
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{review.name}</h3>
                              <p className="text-sm text-gray-500">{review.age || review.date || "Recent"}</p>
                            </div>
                            
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                              ))}
                            </div>
                          </div>
                          
                          <p className="mt-2 text-gray-700 dark:text-gray-300">
                            {review.content || review.review || "Excellent service and professional advice. Would recommend."}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {hasMoreReviews && (
                  <div className="text-center mt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="mx-auto"
                    >
                      {showAllReviews ? "Show less" : `View ${reviews.length - 3} more reviews`}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500">No reviews available yet.</p>
              </div>
            )}
          </TabsContent>

          {/* Booking tab */}
          <TabsContent value="booking" className="mt-4">
            <h2 className="text-xl font-semibold mb-3">Book a Consultation</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Select a date</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>

              <div>
                <h3 className="font-medium mb-3">Select a time</h3>
                {selectedDate ? (
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={
                          selectedTimeSlot === time ? "default" : "outline"
                        }
                        className="justify-start"
                        onClick={() => setSelectedTimeSlot(time)}
                      >
                        <ClockIcon />
                        {time}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded text-center">
                    <CalendarIcon />
                    <p className="mt-2">Please select a date first</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Button
                size="lg"
                className="w-full md:w-auto"
                disabled={!selectedDate || !selectedTimeSlot}
              >
                Book Consultation
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                You won't be charged yet. The lawyer will confirm the appointment.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default LawyerProfile;
