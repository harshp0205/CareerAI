import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Brain,
  Target,
  FileText,
  TrendingUp,
  Users,
  Shield,
  Zap,
  CheckCircle2,
  Star,
  Video,
  Camera,
  PlayCircle,
} from "lucide-react";
import HeroSection from "@/components/hero";

export default function LandingPage() {
  const features = [
    {
      icon: <Video className="w-8 h-8 text-red-600" />,
      title: "AI Video Interview Practice",
      description: "Practice video interviews with AI-powered real-time feedback and analysis",
      featured: true,
      link: "/video-interview"
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: "AI Resume Builder",
      description: "Create ATS-optimized resumes with intelligent suggestions and formatting",
      link: "/resume"
    },
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Interview Preparation",
      description: "Practice with AI-powered mock interviews tailored to your industry",
      link: "/interview"
    },
    {
      icon: <FileText className="w-8 h-8 text-green-600" />,
      title: "Cover Letter Generator",
      description: "Generate personalized cover letters that stand out to employers",
      link: "/ai-cover-letter"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
      title: "Industry Insights",
      description: "Get real-time market trends and salary insights for your field",
      link: "/dashboard"
    }
  ];

  const benefits = [
    "AI-powered video interview practice with real-time feedback",
    "Personalized AI career guidance",
    "Industry-specific interview preparation",
    "ATS-optimized resume templates",
    "Real-time market insights",
    "24/7 AI assistant support",
    "Progress tracking and analytics",
    "Video interview confidence scoring"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and insights you need to advance your career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <Link key={index} href={feature.link || "#"} className={feature.featured ? "md:col-span-2 lg:col-span-2" : ""}>
                <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full cursor-pointer transform hover:scale-105 ${
                  feature.featured 
                    ? "bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 border-2 border-red-200 dark:border-red-800" 
                    : "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
                }`}>
                  <CardContent className={`p-8 text-center h-full flex flex-col justify-center ${feature.featured ? "relative" : ""}`}>
                    {feature.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">NEW</span>
                      </div>
                    )}
                    <div className="flex justify-center mb-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        feature.featured 
                          ? "bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900" 
                          : "bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900"
                      }`}>
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className={`text-xl font-semibold mb-3 ${
                      feature.featured 
                        ? "text-red-900 dark:text-red-100" 
                        : "text-gray-900 dark:text-white"
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`leading-relaxed ${
                      feature.featured 
                        ? "text-red-700 dark:text-red-300" 
                        : "text-gray-600 dark:text-gray-400"
                    }`}>
                      {feature.description}
                    </p>
                    {feature.featured && (
                      <div className="mt-4">
                        <Button className="bg-red-600 hover:bg-red-700 text-white">
                          Try Now <PlayCircle className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Join thousands of professionals who have accelerated their careers with our AI-powered tools and personalized guidance.
              </p>
              
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link href="/sign-up">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">10K+</h3>
                  <p className="text-gray-600 dark:text-gray-400">Users Helped</p>
                </CardContent>
              </Card>

              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">4.9/5</h3>
                  <p className="text-gray-600 dark:text-gray-400">User Rating</p>
                </CardContent>
              </Card>

              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">95%</h3>
                  <p className="text-gray-600 dark:text-gray-400">Success Rate</p>
                </CardContent>
              </Card>

              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Zap className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">24/7</h3>
                  <p className="text-gray-600 dark:text-gray-400">AI Support</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who are advancing their careers with AI-powered guidance and personalized coaching.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/video-interview">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl shadow-lg">
                  Try Video Interview AI
                  <Video className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-xl shadow-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl">
                  View Dashboard
                </Button>
              </Link>
            </div>

            <p className="text-white/70 text-sm mt-6">
              No credit card required • Get started in minutes
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
