"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  Star,
  ExternalLink,
  PlayCircle,
  Award,
  TrendingUp,
  Users,
} from "lucide-react";

const LearningPathsModal = ({ children, recommendedSkills, industry }) => {
  const [selectedPath, setSelectedPath] = useState(null);

  // Generate learning paths based on recommended skills
  const learningPaths = recommendedSkills.slice(0, 6).map((skill, index) => {
    const difficulties = ["Beginner", "Intermediate", "Advanced"];
    const platforms = ["Coursera", "Udemy", "Pluralsight", "edX", "Codecademy"];
    const durations = ["4-6 weeks", "6-8 weeks", "8-12 weeks", "3-4 months"];
    
    return {
      id: index + 1,
      title: `Master ${skill}`,
      skill: skill,
      difficulty: difficulties[index % 3],
      duration: durations[index % 4],
      platform: platforms[index % 5],
      rating: (4.2 + (index * 0.1)).toFixed(1),
      students: `${Math.floor(Math.random() * 50 + 10)}k`,
      progress: Math.floor(Math.random() * 40),
      price: index % 2 === 0 ? "Free" : `$${Math.floor(Math.random() * 100 + 29)}`,
      modules: [
        `Introduction to ${skill}`,
        `${skill} Fundamentals`,
        `Advanced ${skill} Techniques`,
        `Real-world ${skill} Projects`,
        `${skill} Best Practices`
      ],
      description: `Comprehensive ${skill} course designed for ${industry} professionals. Learn from industry experts and build practical skills.`,
      features: [
        "Hands-on projects",
        "Industry case studies",
        "Certificate of completion",
        "Lifetime access"
      ]
    };
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-700 border-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Learning Paths for {industry}
          </DialogTitle>
          <DialogDescription>
            Curated learning paths to boost your career in {industry}. Choose from industry-relevant courses and certifications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{learningPaths.length}</div>
                <p className="text-sm text-purple-600">Available Paths</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">50k+</div>
                <p className="text-sm text-blue-600">Students Enrolled</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">95%</div>
                <p className="text-sm text-green-600">Completion Rate</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">40%</div>
                <p className="text-sm text-orange-600">Avg. Salary Increase</p>
              </CardContent>
            </Card>
          </div>

          {/* Learning Paths Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <Card key={path.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge 
                      variant="outline" 
                      className={getDifficultyColor(path.difficulty)}
                    >
                      {path.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {path.platform}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {path.title}
                  </CardTitle>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {path.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {path.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {path.students}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {path.description}
                  </p>

                  {path.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">What you'll learn:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {path.modules.slice(0, 3).map((module, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                          {module}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-purple-600">{path.price}</span>
                      {path.price !== "Free" && (
                        <span className="text-sm text-gray-500 line-through">$199</span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="rounded-lg"
                        onClick={() => setSelectedPath(path)}
                      >
                        Details
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg"
                      >
                        {path.progress > 0 ? "Continue" : "Start"}
                        <PlayCircle className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Ready to Advance Your Career?</h3>
              <p className="mb-4 text-purple-100">
                Join thousands of professionals who have accelerated their careers with our learning paths
              </p>
              <Button 
                variant="secondary" 
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Browse All Courses
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LearningPathsModal;
