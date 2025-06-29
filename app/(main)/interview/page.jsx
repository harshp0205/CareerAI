import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import QuizList from "./_components/quiz-list";
import { Target, Brain, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function InterviewPrepPage() {
  const assessments = await getAssessments();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 -mt-24 pt-24">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-6">
              <Target className="w-4 h-4 text-blue-500" />
              <span>AI Interview Preparation</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Master Your Interviews
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Practice with AI-powered mock interviews, get personalized feedback, and track your progress to land your dream job.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/interview/mock">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Brain className="h-5 w-5 mr-2" />
                  Start Mock Interview
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-4 rounded-xl border-2 hover:bg-white/10 transition-all duration-300">
                <TrendingUp className="h-5 w-5 mr-2" />
                View Progress
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <StatsCards assessments={assessments} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-1">
              <PerformanceChart assessments={assessments} />
            </div>
            <div className="lg:col-span-1">
              <QuizList assessments={assessments} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
