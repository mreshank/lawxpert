import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, FileText, BarChart2, Shield, Users, Building, GraduationCap, FileCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-800 to-red-900 py-20 px-4 text-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                AI-Powered Legal Assistance for Everyone
              </h1>
              <p className="text-xl mb-8">
                Get instant answers to legal questions, generate documents, and understand your rights - all in simple language.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 h-auto">
                  <Link to="/chat">
                    Start Chatting
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-lg px-8 py-6 h-auto">
                  <Link to="/about">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-blue-600 p-4 flex items-center gap-2">
                <div className="bg-white w-8 h-8 rounded flex items-center justify-center">
                  <span className="text-blue-600 font-bold">LX</span>
                </div>
                <h3 className="text-white font-medium">LawXpert AI Assistant</h3>
              </div>
              <div className="p-4">
                <div className="bg-gray-100 rounded-xl p-4 mb-4">
                  <p className="text-gray-800">How can I file an RTI application?</p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-4">
                  <p className="text-gray-800 font-medium">To file an RTI application, you need to:</p>
                  <ol className="list-decimal pl-5 space-y-2 mt-2 text-gray-700">
                    <li>Identify the public authority that holds the information</li>
                    <li>Write your application with specific questions</li>
                    <li>Pay the application fee (₹10 for central government)</li>
                    <li>Submit it to the Public Information Officer</li>
                  </ol>
                  <p className="mt-4 text-gray-800">I can help you generate an RTI application if you'd like?</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How LawXpert Works */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How LawXpert Works</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Simplifying legal processes through AI technology
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
                  <MessageSquare size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Legal Assistant</h3>
                <p className="text-gray-600">
                  Get instant answers to your legal questions in plain language
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                  <FileText size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Document Generation</h3>
                <p className="text-gray-600">
                  Create legal documents like FIRs, RTI applications, and notices
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-6">
                  <BarChart2 size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Case Analytics</h3>
                <p className="text-gray-600">
                  Track case backlogs and court performance across India
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mx-auto mb-6">
                  <Shield size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
                <p className="text-gray-600">
                  Your data is encrypted and never shared with third parties
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Key Features */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Key Features</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto text-center">
              Everything you need to navigate the legal system
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                  <MessageSquare size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4">AI Legal Assistant</h3>
                <p className="text-gray-600">
                  Get instant answers to legal questions about tenant rights, RTI applications, harassment cases, and more.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-6">
                  <FileText size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4">Document Generation</h3>
                <p className="text-gray-600">
                  Generate legal documents like FIRs, RTI applications, legal notices, and affidavits in minutes.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-6">
                  <BarChart2 size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4">Legal Analytics</h3>
                <p className="text-gray-600">
                  Access comprehensive analytics on case backlogs, filing trends, and court performance metrics.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How LawXpert Helps */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">How LawXpert Helps</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto text-center">
              Our AI-powered platform provides accessible legal assistance for various scenarios
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* For Citizens */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4">
                    <Users size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">For Citizens</h3>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex">
                    <div className="mr-4 text-green-500 flex-shrink-0">
                      <FileCheck size={20} />
                    </div>
                    <p className="text-gray-700">Get quick answers to common legal questions</p>
                  </li>
                  <li className="flex">
                    <div className="mr-4 text-green-500 flex-shrink-0">
                      <FileCheck size={20} />
                    </div>
                    <p className="text-gray-700">Generate properly formatted legal documents</p>
                  </li>
                  <li className="flex">
                    <div className="mr-4 text-green-500 flex-shrink-0">
                      <FileCheck size={20} />
                    </div>
                    <p className="text-gray-700">Understand your rights and legal procedures</p>
                  </li>
                  <li className="flex">
                    <div className="mr-4 text-green-500 flex-shrink-0">
                      <FileCheck size={20} />
                    </div>
                    <p className="text-gray-700">Access information in English or Hindi</p>
                  </li>
                </ul>
              </div>
              
              {/* For Legal Professionals */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4">
                    <Building size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">For Legal Professionals</h3>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex">
                    <div className="mr-4 text-green-500 flex-shrink-0">
                      <FileCheck size={20} />
                    </div>
                    <p className="text-gray-700">Access case backlog and filing trend analytics</p>
                  </li>
                  <li className="flex">
                    <div className="mr-4 text-green-500 flex-shrink-0">
                      <FileCheck size={20} />
                    </div>
                    <p className="text-gray-700">Generate reports and visualizations of court data</p>
                  </li>
                  <li className="flex">
                    <div className="mr-4 text-green-500 flex-shrink-0">
                      <FileCheck size={20} />
                    </div>
                    <p className="text-gray-700">Identify patterns and insights from legal data</p>
                  </li>
                  <li className="flex">
                    <div className="mr-4 text-green-500 flex-shrink-0">
                      <FileCheck size={20} />
                    </div>
                    <p className="text-gray-700">Export data for further analysis and reports</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Citizens Across India</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Helping people navigate the complex legal system
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-8">
                <div className="text-5xl font-bold text-blue-600 mb-2">10k+</div>
                <p className="text-gray-600">Legal Questions Answered</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-8">
                <div className="text-5xl font-bold text-blue-600 mb-2">5k+</div>
                <p className="text-gray-600">Documents Generated</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-8">
                <div className="text-5xl font-bold text-blue-600 mb-2">28</div>
                <p className="text-gray-600">States & UTs Covered</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-8">
                <div className="text-5xl font-bold text-blue-600 mb-2">92%</div>
                <p className="text-gray-600">User Satisfaction</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl mb-8">
              Join thousands of citizens who use LawXpert to understand their legal rights and navigate the justice system.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto">
                <Link to="/register">
                  Create Free Account
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/20 text-lg px-8 py-6 h-auto">
                <Link to="/chat">
                  Try the AI Assistant
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
