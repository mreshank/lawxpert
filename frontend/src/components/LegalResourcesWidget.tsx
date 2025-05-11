import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, ArrowRight, HelpCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";
import TranslatedText from "@/components/TranslatedText";
import { useTranslation } from "@/hooks/useTranslation";

// Sample popular FAQs
const POPULAR_FAQS = [
  {
    id: 1,
    question: "What is the procedure to file an FIR in India?",
    category: "Criminal Law",
    views: 8450
  },
  {
    id: 2,
    question: "How to apply for divorce by mutual consent in India?",
    category: "Family Law",
    views: 7230
  },
  {
    id: 3,
    question: "What documents are required for property registration in India?",
    category: "Property Law",
    views: 6120
  },
  {
    id: 4,
    question: "What is the limitation period for filing civil cases in India?",
    category: "Civil Law",
    views: 5840
  }
];

// Sample popular legal guides
const POPULAR_GUIDES = [
  {
    id: 1,
    title: "Understanding Criminal Procedure Code in India",
    category: "Criminal Law",
    level: "beginner"
  },
  {
    id: 5,
    title: "Fundamental Rights under the Indian Constitution",
    category: "Constitutional Law",
    level: "beginner"
  },
  {
    id: 3,
    title: "Property Ownership and Transfer under Indian Legal Framework",
    category: "Property Law",
    level: "intermediate"
  },
  {
    id: 4,
    title: "Divorce Procedures under Various Personal Laws in India",
    category: "Family Law",
    level: "intermediate"
  }
];

// Popular legal topics/categories
const POPULAR_CATEGORIES = [
  { id: 'criminal', name: 'Criminal Law', count: 24 },
  { id: 'family', name: 'Family Law', count: 15 },
  { id: 'property', name: 'Property Law', count: 12 },
  { id: 'civil', name: 'Civil Law', count: 18 },
  { id: 'constitutional', name: 'Constitutional Law', count: 10 },
  { id: 'corporate', name: 'Corporate Law', count: 14 }
];

const LegalResourcesWidget = () => {
  const { t } = useTranslation();
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            <TranslatedText textKey="legalResources" />
          </CardTitle>
          <CardDescription>
            <TranslatedText 
              textKey="search" 
              as="span" 
            /> <TranslatedText textKey="legalResources" as="span" className="lowercase" />
          </CardDescription>
        </div>
        <Link to="/legal-documentation" className="text-sm text-blue-600 hover:underline whitespace-nowrap">
          <TranslatedText textKey="viewAll" />
        </Link>
      </CardHeader>
      <CardContent className="pb-2">
        <Tabs defaultValue="faqs" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="guides">
              <TranslatedText textKey="search" as="span" />
            </TabsTrigger>
            <TabsTrigger value="categories">
              <TranslatedText textKey="categories" />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="faqs" className="m-0">
            <ul className="space-y-3">
              {POPULAR_FAQS.map(faq => (
                <li key={faq.id} className="border-l-4 border-blue-500 pl-3 py-1">
                  <Link to="/legal-documentation" className="block hover:text-blue-600">
                    <p className="font-medium text-sm line-clamp-2">{faq.question}</p>
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant="outline" className="text-xs">{faq.category}</Badge>
                      <span className="text-xs text-gray-500">
                        {faq.views.toLocaleString()} <TranslatedText textKey="views" as="span" />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="guides" className="m-0">
            <ul className="space-y-3">
              {POPULAR_GUIDES.map(guide => (
                <li key={guide.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <Link to="/legal-documentation" className="block hover:text-blue-600">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-600" />
                      <p className="font-medium text-sm line-clamp-2">{guide.title}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs">{guide.category}</Badge>
                      <Badge variant="secondary" className="text-xs capitalize">
                        <TranslatedText textKey={guide.level as any} />
                      </Badge>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="categories" className="m-0">
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_CATEGORIES.map(category => (
                <Link 
                  key={category.id}
                  to={`/legal-documentation?category=${category.id}`}
                  className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md flex flex-col items-center justify-center text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium text-sm">{category.name}</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {category.count} <TranslatedText textKey="views" as="span" />
                  </span>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2">
        <div className="flex items-center text-blue-600 text-sm">
          <HelpCircle className="h-4 w-4 mr-1" />
          <Link to="/chat" className="hover:underline">
            <TranslatedText textKey="askQuestion" />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LegalResourcesWidget; 