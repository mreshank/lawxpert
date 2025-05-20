import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, FileText, MessageCircle, ListChecks } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import TranslatedText from "@/components/TranslatedText";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';

interface AnalysisResult {
  summary: string;
  clauses: string;
  answer?: string;
}

const AnalyzeDocument: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [question, setQuestion] = useState("");
  const [questionLoading, setQuestionLoading] = useState(false);
  const { t } = useTranslation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setAnalysis(null); // Reset analysis when new file is selected
    }
  };

  const analyzeDocument = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${import.meta.env.VITE_PYTHON_API_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || 'Failed to analyze document';
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing document:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    if (!file || !question.trim()) return;

    setQuestionLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('question', question);

      const response = await fetch(`${import.meta.env.VITE_PYTHON_API_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || 'Failed to get answer';
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setAnalysis(prev => prev ? { ...prev, answer: result.answer } : result);
      setQuestion(""); // Clear the question input after successful answer
    } catch (error) {
      console.error('Error getting answer:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get answer. Please try again.');
    } finally {
      setQuestionLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-lawxpert-navy dark:text-white mb-8 flex items-center gap-3">
            {/* <FileText className="h-7 w-7 text-blue-600" /> */}
            <TranslatedText textKey="analyzeDocument" />
          </h1>

          {/* Upload Card */}
          <Card className="p-6 mb-8 shadow-md">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Button
                  onClick={analyzeDocument}
                  disabled={!file || loading}
                  className="min-w-[120px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <TranslatedText textKey="analyzing" />
                    </>
                  ) : (
                    <TranslatedText textKey="analyze" />
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {analysis && (
            <div className="space-y-8">
              {/* Summary Section */}
              <Card className="p-6 shadow-md border-l-4 border-blue-500 bg-white">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <TranslatedText textKey="documentSummary" />
                </h2>
                <div className="prose max-w-none">
                  <ReactMarkdown>{analysis.summary}</ReactMarkdown>
                </div>
              </Card>

              {/* Clauses Section */}
              <Card className="p-6 shadow-md border-l-4 border-green-500 bg-white">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-green-500" />
                  <TranslatedText textKey="keyClauses" />
                </h2>
                <div className="prose max-w-none">
                  <ReactMarkdown>{analysis.clauses}</ReactMarkdown>
                </div>
              </Card>

              {/* Q&A Section */}
              <Card className="p-6 shadow-md border-l-4 border-purple-500 bg-white">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-purple-500" />
                  Ask a Question
                </h2>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Type your question about the document..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="min-h-[100px]"
                    disabled={questionLoading}
                  />
                  <Button
                    onClick={askQuestion}
                    disabled={!file || !question.trim() || questionLoading}
                    className="w-full"
                  >
                    {questionLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Getting Answer...
                      </>
                    ) : (
                      'Get Answer'
                    )}
                  </Button>
                  {analysis.answer && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-purple-200">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-purple-500" /> Answer:
                      </h3>
                      <div className="prose max-w-none">
                        <ReactMarkdown>{analysis.answer}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AnalyzeDocument; 