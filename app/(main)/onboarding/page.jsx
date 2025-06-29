import { redirect } from "next/navigation";
import { industries } from "@/data/industries";
import OnboardingForm from "./_components/onboarding-form";
import { checkUser } from "@/lib/checkUser";
import { Sparkles, Target, Brain } from "lucide-react";

export default async function OnboardingPage() {
  // Check if user exists and get their onboarding status
  const user = await checkUser();

  if (!user) {
    redirect("/sign-in");
  }

  // If user already has industry set, they're onboarded
  if (user.industry) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-900 -mt-24 pt-24">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Welcome to CareerAI</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Welcome to Your Career Journey
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Let's set up your profile in just 4 simple steps. This helps us provide personalized AI recommendations, industry insights, and career guidance tailored specifically for you.
          </p>
        </div>

        {/* Quick Guide */}
        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6 max-w-4xl mx-auto mb-12">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Quick Setup Guide (2-3 minutes)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mb-2 text-xs font-bold">1</div>
                <span className="text-gray-700 dark:text-gray-300">Choose Industry</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mb-2 text-xs font-bold">2</div>
                <span className="text-gray-700 dark:text-gray-300">Set Experience</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mb-2 text-xs font-bold">3</div>
                <span className="text-gray-700 dark:text-gray-300">Add Skills</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center mb-2 text-xs font-bold">4</div>
                <span className="text-gray-700 dark:text-gray-300">Share Story</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">AI Resume Builder</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Create ATS-optimized resumes with intelligent suggestions
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Interview Prep</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Practice with AI-powered mock interviews
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Industry Insights</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Get real-time market trends and salary data
            </p>
          </div>
        </div>

        {/* Onboarding Form */}
        <OnboardingForm industries={industries} />
      </div>
    </div>
  );
}
