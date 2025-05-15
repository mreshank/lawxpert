import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LawyerProfile from "@/components/LawyerProfile";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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

const LawyerProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLawyerData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check if we're dealing with a numeric ID or a name-based ID
        const isNumericId = /^\d+$/.test(id || '');
        
        // Fetch lawyer data based on ID type
        const endpoint = isNumericId 
          ? `${import.meta.env.VITE_API_BASE_URL}/api/lawyers/${id}`
          : `${import.meta.env.VITE_API_BASE_URL}/api/lawyers?name=${id?.replace(/-/g, ' ')}`;
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error('Failed to fetch lawyer data');
        }
        
        const data = await response.json();
        
        if (data.success) {
          // If we used the name-based endpoint, we'll get an array of lawyers
          // We need to find the one that matches our ID
          if (!isNumericId && Array.isArray(data.data)) {
            const matchedLawyer = data.data.find(lawyer => 
              lawyer.name.replace(/\s+/g, '-').toLowerCase() === id
            );
            if (matchedLawyer) {
              setLawyer(matchedLawyer);
            } else {
              throw new Error('Lawyer not found');
            }
          } else {
            setLawyer(data.data);
          }
        } else {
          throw new Error(data.message || 'Failed to fetch lawyer data');
        }
      } catch (error) {
        console.error('Error fetching lawyer:', error);
        setError('Failed to load lawyer data. Please try again.');
        toast.error('Failed to load lawyer data');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchLawyerData();
    }
  }, [id]);
  
  const handleGoBack = () => {
    navigate('/lawyers');
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="mb-4"
        >
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to results
        </Button>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex gap-6 mb-8">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-8 w-1/3 mb-2" />
              <Skeleton className="h-5 w-1/4 mb-4" />
              <Skeleton className="h-4 w-1/5 mb-2" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
          <Skeleton className="h-8 w-full mb-6" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }
  
  if (error || !lawyer) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="mb-4"
        >
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to results
        </Button>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Lawyer Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error || "The lawyer profile you're looking for could not be found."}
          </p>
          <Button onClick={handleGoBack}>
            Return to Lawyer Marketplace
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <LawyerProfile lawyer={lawyer} onClose={handleGoBack} />
    </div>
  );
};

export default LawyerProfilePage; 