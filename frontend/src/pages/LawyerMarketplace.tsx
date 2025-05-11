import { useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import LawyerProfile from "@/components/LawyerProfile";

// Mock data for lawyers
const LAWYERS = [
  {
    id: 1,
    name: "Jennifer Martinez",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    specialization: "Family Law",
    rating: 4.8,
    hourlyRate: 150,
    reviews: 127,
    experience: "8 years",
    description: "Experienced family law attorney specializing in divorce and child custody cases.",
    languages: ["English", "Spanish"],
    available: true,
    bio: "With 8 years of dedicated experience in family law, I focus on helping clients navigate complex family matters with empathy and legal expertise. My approach combines strong advocacy with practical solutions to achieve the best possible outcomes for families in transition.",
    education: ["J.D., UCLA School of Law", "B.A., Psychology, Stanford University"],
    certifications: ["Certified Family Law Specialist", "Certified Mediator"]
  },
  {
    id: 2,
    name: "Michael Thompson",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    specialization: "Corporate Law",
    rating: 4.9,
    hourlyRate: 220,
    reviews: 84,
    experience: "12 years",
    description: "Specializing in business formation, contracts, and corporate compliance.",
    languages: ["English"],
    available: true,
    bio: "As a corporate attorney with over 12 years of experience, I help businesses of all sizes navigate legal complexities, from formation to growth and beyond. My expertise includes contract negotiation, compliance, mergers & acquisitions, and corporate governance matters."
  },
  {
    id: 3,
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    specialization: "Criminal Defense",
    rating: 4.7,
    hourlyRate: 180,
    reviews: 93,
    experience: "10 years",
    description: "Former prosecutor now defending clients in criminal cases with high success rate.",
    languages: ["English", "French"],
    available: false,
    bio: "Drawing on my decade of experience including years as a prosecutor, I now defend individuals facing criminal charges with strategic and passionate advocacy. I handle cases ranging from misdemeanors to serious felonies, always fighting to protect my clients' rights and freedom."
  },
  {
    id: 4,
    name: "Robert Chen",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    specialization: "Intellectual Property",
    rating: 4.6,
    hourlyRate: 200,
    reviews: 61,
    experience: "7 years",
    description: "Patent attorney with background in software engineering.",
    languages: ["English", "Mandarin"],
    available: true,
    bio: "Combining my technical background in software engineering with legal expertise, I specialize in helping innovators protect their intellectual property. From patent applications to copyright issues and trademark registration, I work with creators and companies to secure and defend their creative assets."
  },
  {
    id: 5,
    name: "Emily Wilson",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    specialization: "Real Estate Law",
    rating: 4.9,
    hourlyRate: 175,
    reviews: 108,
    experience: "9 years",
    description: "Helping clients navigate property transactions and landlord-tenant disputes.",
    languages: ["English"],
    available: true,
    bio: "For the past 9 years, I've guided clients through all aspects of real estate law, from residential and commercial transactions to landlord-tenant matters and property disputes. My goal is to ensure smooth, legally sound real estate dealings while protecting my clients' investments and interests."
  },
  {
    id: 6,
    name: "David Rodriguez",
    avatar: "https://randomuser.me/api/portraits/men/57.jpg",
    specialization: "Immigration Law",
    rating: 4.8,
    hourlyRate: 160,
    reviews: 142,
    experience: "11 years",
    description: "Passionate about helping families navigate the immigration process.",
    languages: ["English", "Spanish"],
    available: true,
    bio: "With over 11 years dedicated to immigration law, I help individuals and families achieve their dreams of living legally in the United States. From family-based petitions to employment visas, asylum cases, and naturalization, I provide compassionate guidance through complex immigration processes."
  }
];

const LawyerMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<typeof LAWYERS[0] | null>(null);
  
  // Filter lawyers based on search and filters
  const filteredLawyers = LAWYERS.filter(lawyer => {
    const matchesSearch = 
      lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesSpecialization = 
      specializationFilter === "" || lawyer.specialization === specializationFilter;
      
    const matchesPriceRange = 
      lawyer.hourlyRate >= priceRange[0] && lawyer.hourlyRate <= priceRange[1];
      
    return matchesSearch && matchesSpecialization && matchesPriceRange;
  });
  
  const specializations = [...new Set(LAWYERS.map(lawyer => lawyer.specialization))];
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto">
          {!selectedLawyer ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-lawxpert-navy dark:text-white">
                  Find & Hire Legal Experts
                </h1>
                <p className="text-lawxpert-slate dark:text-gray-300 mt-2">
                  Connect with experienced attorneys for personalized legal assistance
                </p>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-6 mb-8">
                {/* Search and filters */}
                <div className="w-full lg:w-1/4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
                    <div className="relative">
                      <svg className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      <Input
                        placeholder="Search lawyers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div 
                      className="p-4 flex justify-between items-center cursor-pointer"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <h3 className="font-medium">Filters</h3>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                    </div>
                    
                    {showFilters && (
                      <div className="p-4 border-t">
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">Specialization</label>
                          <Select 
                            value={specializationFilter} 
                            onValueChange={setSpecializationFilter}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="All specializations" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All specializations</SelectItem>
                              {specializations.map((spec) => (
                                <SelectItem key={spec} value={spec}>
                                  {spec}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">
                            Price Range: ${priceRange[0]} - ${priceRange[1]}
                          </label>
                          <Slider
                            defaultValue={[0, 300]}
                            max={300}
                            min={0}
                            step={10}
                            value={priceRange}
                            onValueChange={setPriceRange}
                            className="mt-2"
                          />
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full mt-2"
                          onClick={() => {
                            setSearchTerm("");
                            setSpecializationFilter("");
                            setPriceRange([0, 300]);
                          }}
                        >
                          Reset Filters
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Lawyer listings */}
                <div className="w-full lg:w-3/4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredLawyers.length > 0 ? (
                      filteredLawyers.map((lawyer) => (
                        <div 
                          key={lawyer.id} 
                          className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                        >
                          <div className="p-4">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-20 w-20">
                                <img src={lawyer.avatar} alt={lawyer.name} />
                              </Avatar>
                              
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold text-lg">{lawyer.name}</h3>
                                    <p className="text-sm text-gray-500">{lawyer.specialization}</p>
                                  </div>
                                  
                                  <div className="flex items-center">
                                    <svg className="h-4 w-4 fill-yellow-400 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                    <span className="ml-1 text-sm font-medium">{lawyer.rating}</span>
                                    <span className="text-xs text-gray-500 ml-1">({lawyer.reviews})</span>
                                  </div>
                                </div>
                                
                                <div className="mt-2">
                                  <Badge variant="outline" className="mr-1">{lawyer.experience}</Badge>
                                  {lawyer.languages.map(lang => (
                                    <Badge key={lang} variant="secondary" className="mr-1">{lang}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <p className="mt-3 text-sm">{lawyer.description}</p>
                            
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-baseline">
                                <span className="font-semibold text-lg">${lawyer.hourlyRate}</span>
                                <span className="text-gray-500 text-sm ml-1">/hour</span>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline"
                                  onClick={() => setSelectedLawyer(lawyer)}
                                >
                                  View Profile
                                </Button>
                                <Button disabled={!lawyer.available}>
                                  {lawyer.available ? "Book Consultation" : "Unavailable"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                        <h3 className="text-lg font-medium">No lawyers found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <LawyerProfile 
              lawyer={selectedLawyer} 
              onClose={() => setSelectedLawyer(null)} 
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LawyerMarketplace; 