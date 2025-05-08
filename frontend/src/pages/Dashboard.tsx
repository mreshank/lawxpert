import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardStats from "@/components/DashboardStats";
import ChatInterface from "@/components/ChatInterface";
import { Link } from "react-router-dom";
import { FileText, MessageSquare, Users, Calendar, Briefcase, FileBarChart } from "lucide-react";

const Dashboard = () => {
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  
  // Mock data for recent documents
  const recentDocuments = [
    { id: 1, name: "FIR Application.pdf", date: "Today, 14:23", type: "FIR" },
    { id: 2, name: "Legal Notice - Tenant.pdf", date: "Yesterday, 09:15", type: "Legal Notice" },
    { id: 3, name: "Affidavit.pdf", date: "Mar 15, 2023", type: "Affidavit" }
  ];
  
  // Mock data for upcoming consultations
  const upcomingConsultations = [
    { id: 1, lawyer: "Jennifer Martinez", date: "Tomorrow, 10:00 AM", topic: "Divorce Proceedings" },
    { id: 2, lawyer: "Michael Thompson", date: "Apr 22, 2023, 2:30 PM", topic: "Business Contract Review" }
  ];
  
  // Mock data for recommended lawyers
  const recommendedLawyers = [
    {
      id: 1,
      name: "Emily Wilson",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      specialization: "Real Estate Law",
      rating: 4.9
    },
    {
      id: 2,
      name: "David Rodriguez",
      avatar: "https://randomuser.me/api/portraits/men/57.jpg",
      specialization: "Immigration Law",
      rating: 4.8
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-lawxpert-navy dark:text-white">
              Dashboard
            </h1>
            <p className="text-lawxpert-slate dark:text-gray-300 mt-2">
              Welcome to your legal hub - all your resources in one place
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Analytics and Stats */}
            <div className="col-span-3 lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Legal Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <DashboardStats />
                </CardContent>
              </Card>
              
              {/* AI Assistant Widget */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>AI Legal Assistant</CardTitle>
                  <Link to="/chat" className="text-sm text-blue-600 hover:underline">View full chat</Link>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[350px] overflow-hidden">
                    <ChatInterface compact={true} />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right column - Quick access widgets */}
            <div className="col-span-3 lg:col-span-1 space-y-6">
              {/* Recent Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Recent Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {recentDocuments.map(doc => (
                      <li key={doc.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md flex justify-between items-center">
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{doc.date}</span>
                        </div>
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                          {doc.type}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    to="/documents" 
                    className="block text-center mt-4 text-sm text-blue-600 hover:underline"
                  >
                    View all documents
                  </Link>
                </CardContent>
              </Card>
              
              {/* Upcoming Consultations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Upcoming Consultations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingConsultations.length > 0 ? (
                    <ul className="space-y-3">
                      {upcomingConsultations.map(consultation => (
                        <li key={consultation.id} className="border-l-4 border-green-500 pl-3 py-2">
                          <p className="font-medium">{consultation.lawyer}</p>
                          <p className="text-sm">{consultation.topic}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{consultation.date}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                      No upcoming consultations
                    </p>
                  )}
                  <div className="mt-4 flex justify-center">
                    <Link
                      to="/lawyers"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Schedule Consultation
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recommended Lawyers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Recommended Lawyers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {recommendedLawyers.map(lawyer => (
                      <li key={lawyer.id} className="flex items-center">
                        <img
                          src={lawyer.avatar}
                          alt={lawyer.name}
                          className="h-12 w-12 rounded-full mr-4"
                        />
                        <div>
                          <p className="font-medium">{lawyer.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{lawyer.specialization}</p>
                          <div className="flex items-center mt-1">
                            <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs ml-1">{lawyer.rating}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    to="/lawyers" 
                    className="block text-center mt-4 text-sm text-blue-600 hover:underline"
                  >
                    View all lawyers
                  </Link>
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/documents" className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md flex flex-col items-center justify-center text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <FileText className="h-6 w-6 mb-2" />
                      <span className="text-sm">Generate Document</span>
                    </Link>
                    <Link to="/chat" className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md flex flex-col items-center justify-center text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <MessageSquare className="h-6 w-6 mb-2" />
                      <span className="text-sm">Ask Legal Question</span>
                    </Link>
                    <Link to="/lawyers" className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md flex flex-col items-center justify-center text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <Briefcase className="h-6 w-6 mb-2" />
                      <span className="text-sm">Find Lawyer</span>
                    </Link>
                    <Link to="#" className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md flex flex-col items-center justify-center text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <FileBarChart className="h-6 w-6 mb-2" />
                      <span className="text-sm">Case Analysis</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard; 