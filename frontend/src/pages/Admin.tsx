
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardStats from "@/components/DashboardStats";
import { Download, Upload, Users, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }
    
    // In a real app, this would call an API to upload and process the file
    toast.success(`File ${selectedFile.name} uploaded successfully`);
    setSelectedFile(null);
    
    // Reset the file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleExport = (format: string) => {
    // In a real app, this would trigger an API call to generate the export
    toast.success(`Exporting data as ${format}...`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-lawxpert-navy dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-lawxpert-slate dark:text-gray-300 mt-2">
              View analytics, manage data, and monitor system performance
            </p>
          </div>
          
          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="grid w-full sm:w-[400px] grid-cols-3">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="data">Data Management</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analytics" className="mt-6">
              <DashboardStats />
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleExport('PDF')}
                >
                  <Download size={18} />
                  Export as PDF
                </Button>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleExport('CSV')}
                >
                  <Download size={18} />
                  Export as CSV
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="data" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Case Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-gray-400 mb-4" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          CSV, JSON or Excel files (Max 10MB)
                        </p>
                        <Input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept=".csv,.json,.xlsx,.xls"
                          onChange={handleFileChange}
                        />
                        <label htmlFor="file-upload" className="mt-4">
                          <Button variant="outline">Select File</Button>
                        </label>
                      </div>
                    </div>
                    
                    {selectedFile && (
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                        <p className="text-sm">
                          Selected file: <span className="font-medium">{selectedFile.name}</span> ({Math.round(selectedFile.size / 1024)} KB)
                        </p>
                        <Button 
                          className="mt-2 bg-lawxpert-navy hover:bg-lawxpert-navy/90"
                          onClick={handleUpload}
                        >
                          Upload and Process
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      Active Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-lawxpert-navy dark:text-lawxpert-gold">
                      3,528
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Chat Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-lawxpert-navy dark:text-lawxpert-gold">
                      12,486
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      +8.3% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* User list table would go here in a real application */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    User management features would be implemented here in the full application
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
