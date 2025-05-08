import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// SVG Icons
const StarIcon = () => (
  <svg className="h-5 w-5 fill-yellow-400 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const CalendarIcon = () => (
  <svg className="h-10 w-10 mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ClockIcon = () => (
  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const MapPinIcon = () => (
  <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const MailIcon = () => (
  <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const PhoneIcon = () => (
  <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const AwardIcon = () => (
  <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

const BriefcaseIcon = () => (
  <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const CheckIcon = () => (
  <svg className="h-4 w-4 text-green-500 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// Mock type for a lawyer
interface Lawyer {
  id: number;
  name: string;
  avatar: string;
  specialization: string;
  rating: number;
  hourlyRate: number;
  reviews: number;
  experience: string;
  description: string;
  languages: string[];
  available: boolean;
  education?: string[];
  certifications?: string[];
  address?: string;
  email?: string;
  phone?: string;
  bio?: string;
  reviewList?: {
    id: number;
    name: string;
    avatar: string;
    rating: number;
    date: string;
    content: string;
  }[];
}

interface LawyerProfileProps {
  lawyer: Lawyer;
  onClose: () => void;
}

const LawyerProfile = ({ lawyer, onClose }: LawyerProfileProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  
  // Mock time slots
  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", 
    "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Back button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button 
          onClick={onClose}
          className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center"
        >
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to results
        </button>
      </div>
      
      {/* Lawyer header */}
      <div className="p-6 bg-blue-50 dark:bg-blue-900/20">
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="h-24 w-24 md:h-32 md:w-32">
            <img src={lawyer.avatar} alt={lawyer.name} />
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{lawyer.name}</h1>
                <p className="text-gray-600 dark:text-gray-300">{lawyer.specialization}</p>
                
                <div className="flex items-center mt-2">
                  <StarIcon />
                  <span className="ml-1 font-medium">{lawyer.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({lawyer.reviews} reviews)</span>
                </div>
              </div>
              
              <div className="flex flex-col items-start md:items-end">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">${lawyer.hourlyRate}</span>
                  <span className="text-gray-500 ml-1">/hour</span>
                </div>
                
                <Button className="mt-2">Book Consultation</Button>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline">{lawyer.experience}</Badge>
              {lawyer.languages.map(lang => (
                <Badge key={lang} variant="secondary">{lang}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content tabs */}
      <Tabs defaultValue="about" className="p-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="booking">Book</TabsTrigger>
        </TabsList>
        
        {/* About tab */}
        <TabsContent value="about" className="mt-4">
          <h2 className="text-xl font-semibold mb-3">About {lawyer.name}</h2>
          <p className="text-gray-700 dark:text-gray-300">{lawyer.bio || lawyer.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <MapPinIcon />
                Office Location
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{lawyer.address || "123 Legal Avenue, Suite 500, New York, NY 10001"}</p>
              
              <h3 className="font-medium mb-2 mt-4 flex items-center">
                <MailIcon />
                Email
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{lawyer.email || `${lawyer.name.toLowerCase().replace(' ', '.')}@legalconnect.com`}</p>
              
              <h3 className="font-medium mb-2 mt-4 flex items-center">
                <PhoneIcon />
                Phone
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{lawyer.phone || "(555) 123-4567"}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <AwardIcon />
                Education
              </h3>
              <ul className="space-y-2">
                {(lawyer.education || ["J.D., Harvard Law School", "B.A., Political Science, Yale University"]).map((edu, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">{edu}</li>
                ))}
              </ul>
              
              <h3 className="font-medium mb-2 mt-4 flex items-center">
                <BriefcaseIcon />
                Certifications
              </h3>
              <ul className="space-y-2">
                {(lawyer.certifications || ["Board Certified in Civil Trial Law", "Certified Mediator"]).map((cert, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">{cert}</li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>
        
        {/* Experience tab */}
        <TabsContent value="experience" className="mt-4">
          <h2 className="text-xl font-semibold mb-3">Professional Experience</h2>
          
          <div className="space-y-6">
            <div className="border-l-2 border-blue-500 pl-4">
              <h3 className="font-medium">Senior Partner</h3>
              <p className="text-sm text-gray-500">Smith & Associates Law Firm • 2018 - Present</p>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                Lead attorney handling complex litigation cases with a focus on corporate disputes and intellectual property.
              </p>
            </div>
            
            <div className="border-l-2 border-blue-500 pl-4">
              <h3 className="font-medium">Associate Attorney</h3>
              <p className="text-sm text-gray-500">Johnson Legal Group • 2015 - 2018</p>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                Managed case preparation, legal research, and client communication for civil litigation matters.
              </p>
            </div>
            
            <div className="border-l-2 border-blue-500 pl-4">
              <h3 className="font-medium">Law Clerk</h3>
              <p className="text-sm text-gray-500">District Court of Appeals • 2013 - 2015</p>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                Assisted judges with legal research and drafting opinions on various legal matters.
              </p>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mt-8 mb-3">Areas of Expertise</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <CheckIcon />
              <span>Corporate Law</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <CheckIcon />
              <span>Contract Disputes</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <CheckIcon />
              <span>Intellectual Property</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <CheckIcon />
              <span>Business Formation</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <CheckIcon />
              <span>Negotiations</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <CheckIcon />
              <span>Mergers & Acquisitions</span>
            </div>
          </div>
        </TabsContent>
        
        {/* Reviews tab */}
        <TabsContent value="reviews" className="mt-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Client Reviews</h2>
            <div className="flex items-center">
              <StarIcon />
              <span className="ml-1 font-medium">{lawyer.rating}</span>
              <span className="text-sm text-gray-500 ml-1">({lawyer.reviews} reviews)</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {(lawyer.reviewList || [
              {
                id: 1,
                name: "John D.",
                avatar: "https://randomuser.me/api/portraits/men/85.jpg",
                rating: 5,
                date: "September 15, 2023",
                content: "Excellent representation in my corporate matter. Knowledgeable and professional throughout the entire process."
              },
              {
                id: 2,
                name: "Sarah M.",
                avatar: "https://randomuser.me/api/portraits/women/72.jpg",
                rating: 4,
                date: "July 22, 2023",
                content: "Very responsive and helpful with my legal questions. Would definitely recommend."
              },
              {
                id: 3,
                name: "Robert P.",
                avatar: "https://randomuser.me/api/portraits/men/62.jpg",
                rating: 5,
                date: "May 10, 2023",
                content: "Handled my case with expert knowledge and attention to detail. The outcome exceeded my expectations."
              }
            ]).map(review => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <img src={review.avatar} alt={review.name} />
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{review.name}</h3>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                      
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
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
                    
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{review.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                  {timeSlots.map(time => (
                    <Button
                      key={time}
                      variant={selectedTimeSlot === time ? "default" : "outline"}
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
              Book ${lawyer.hourlyRate} Consultation
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              You won't be charged yet. The lawyer will confirm the appointment.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LawyerProfile; 