import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 -mt-24 pt-24">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4 text-green-500" />
              <span>AI Cover Letter Generator</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-6">
              Craft Compelling Cover Letters
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Generate personalized cover letters that capture attention and showcase your unique value proposition to employers.
            </p>

            <Link href="/ai-cover-letter/new">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-5 w-5 mr-2" />
                Create New Cover Letter
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Cover Letters List Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              My Cover Letters
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track all your cover letters in one place
            </p>
          </div>
          
          <CoverLetterList coverLetters={coverLetters} />
        </div>
      </div>
    </div>
  );
}
