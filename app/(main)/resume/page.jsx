import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/resume-builder";
import { FileText, Sparkles } from "lucide-react";

export default async function ResumePage() {
  const resume = await getResume();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 -mt-24 pt-24">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4 text-purple-500" />
              <span>AI Resume Builder</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Build Your Perfect Resume
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Create ATS-optimized resumes with AI assistance. Get personalized suggestions and professional formatting that helps you stand out.
            </p>
          </div>
        </div>
      </div>

      {/* Resume Builder Section */}
      <div className="container mx-auto px-4 py-8">
        <ResumeBuilder initialContent={resume?.content} />
      </div>
    </div>
  );
}
