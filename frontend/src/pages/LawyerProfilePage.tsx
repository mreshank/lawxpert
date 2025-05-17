import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LawyerProfile from "@/components/LawyerProfile";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { endpoints } from "@/lib/api";

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

// SEO metadata component
const PageHead = ({ lawyer }: { lawyer: Lawyer | null }) => {
  if (!lawyer) return null;
  
  const title = `${lawyer.name} - Legal Professional | LawXpert`;
  const description = lawyer.description || 
    (lawyer.about && lawyer.about[0]) || 
    `${lawyer.name} is a legal professional with ${lawyer.experience} of experience${lawyer.practice_areas?.length ? ` specializing in ${lawyer.practice_areas.join(', ')}` : ''}.`;
  
  return (
    <head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={`lawyer, attorney, legal services, ${lawyer.practice_areas?.join(', ') || 'legal help'}, ${lawyer.location || ''}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="profile" />
      <meta property="og:url" content={`https://lawxpert.eshank.tech/lawyers/${lawyer.id || lawyer.name.replace(/\s+/g, "-").toLowerCase()}`} />
      <meta property="og:image" content={lawyer.img_url || lawyer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&size=200`} />
      <link rel="canonical" href={`https://lawxpert.eshank.tech/lawyers/${lawyer.id || lawyer.name.replace(/\s+/g, "-").toLowerCase()}`} />
    </head>
  );
};

const LawyerProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLawyerDetails = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // Attempt to parse as numeric ID
        const numericId = parseInt(id);
        
        // Try fetching by ID if it's a valid number
        if (!isNaN(numericId)) {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}${endpoints.lawyers.details}/${numericId}`
          );

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setLawyer(data.data);
              setLoading(false);
              return;
            }
          }
        }

        // If ID fetch failed or ID is not numeric (slug), try fetching by name slug
        const nameSlug = id.toLowerCase();
        const allLawyersResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}${endpoints.lawyers.data}`
        );

        if (!allLawyersResponse.ok) {
          throw new Error("Failed to fetch lawyers data");
        }

        const allLawyersData = await allLawyersResponse.json();
        
        if (allLawyersData.success) {
          // Find lawyer by matching the name slug
          const matchedLawyer = allLawyersData.data.find((l: Lawyer) => 
            l.name.toLowerCase().replace(/\s+/g, "-") === nameSlug
          );

          if (matchedLawyer) {
            setLawyer(matchedLawyer);
          } else {
            setError("Lawyer not found");
          }
        } else {
          throw new Error(allLawyersData.message || "Failed to fetch lawyers data");
        }
      } catch (error) {
        console.error("Error fetching lawyer details:", error);
        setError("Failed to load lawyer details");
        toast.error("Failed to load lawyer details");
      } finally {
        setLoading(false);
      }
    };

    fetchLawyerDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate("/lawyers");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4">
        <Button variant="ghost" onClick={handleGoBack} className="mb-2 sm:mb-4">
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
        </Button>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-5">
          <div className="animate-pulse">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto sm:mx-0" />
              <div className="flex-1">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4 mx-auto sm:mx-0" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2 mx-auto sm:mx-0" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4 mx-auto sm:mx-0" />
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lawyer) {
    return (
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4">
        <Button variant="ghost" onClick={handleGoBack} className="mb-2 sm:mb-4">
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
        </Button>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 text-center">
          <h2 className="text-xl font-bold mb-3">Lawyer Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error ||
              "The lawyer profile you're looking for could not be found."}
          </p>
          <Button onClick={handleGoBack}>Return to Lawyer Marketplace</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHead lawyer={lawyer} />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4">
        <LawyerProfile lawyer={lawyer} onClose={handleGoBack} />
      </div>
    </>
  );
};

export default LawyerProfilePage;
