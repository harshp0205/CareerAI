"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BriefcaseIcon,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Star,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import LearningPathsModal from "@/components/learning-paths-modal";

const DashboardView = ({ insights }) => {
  // Transform salary data for the chart
  const salaryData = insights.salaryRanges.slice(0, 5).map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  // Skills distribution data for pie chart
  const skillsData = insights.topSkills.slice(0, 4).map((skill, index) => ({
    name: skill,
    value: Math.floor(Math.random() * 30) + 70, // Simulated percentage
    color: ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"][index],
  }));

  const getOutlookIcon = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return <ArrowUpRight className="h-5 w-5 text-green-500" />;
      case "negative":
        return <ArrowDownRight className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getOutlookColor = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return "text-green-600 bg-green-50 border-green-200";
      case "negative":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
    }
  };

  const getDemandColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const averageSalary = Math.round(
    salaryData.reduce((acc, item) => acc + item.median, 0) / salaryData.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Industry Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {insights.industry || "Technology"} Industry Insights
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Updated {format(new Date(insights.lastUpdated), "MMM dd, yyyy")}</span>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">
                  Market Outlook
                </CardTitle>
                {getOutlookIcon(insights.marketOutlook)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.marketOutlook}</div>
              <p className="text-sm opacity-80 mt-1">
                Industry sentiment analysis
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">
                  Growth Rate
                </CardTitle>
                <TrendingUp className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {insights.growthRate.toFixed(1)}%
              </div>
              <Progress value={insights.growthRate} className="mt-2 bg-white/20" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">
                  Avg. Salary
                </CardTitle>
                <DollarSign className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageSalary}K</div>
              <p className="text-sm opacity-80 mt-1">
                Median across roles
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">
                  Job Demand
                </CardTitle>
                <Users className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.demandLevel}</div>
              <p className="text-sm opacity-80 mt-1">
                Current market demand
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Salary Chart */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BriefcaseIcon className="h-5 w-5 text-violet-600" />
                Salary Ranges by Role
              </CardTitle>
              <CardDescription>
                Minimum, median, and maximum salaries (in thousands)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-gray-800 border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
                              {payload.map((item) => (
                                <p key={item.name} className="text-sm text-gray-600 dark:text-gray-300">
                                  {item.name}: ${item.value}K
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="min" fill="#e2e8f0" name="Min Salary" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="median" fill="#8b5cf6" name="Median Salary" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="max" fill="#4c1d95" name="Max Salary" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Skills Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-600" />
                Top Skills
              </CardTitle>
              <CardDescription>
                Most in-demand skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={skillsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {skillsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {skillsData.map((skill) => (
                  <div key={skill.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: skill.color }}
                      />
                      <span className="text-sm font-medium">{skill.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{skill.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trends and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Industry Trends
              </CardTitle>
              <CardDescription>
                Key developments shaping the industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.keyTrends.slice(0, 4).map((trend, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{trend}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-600" />
                Recommended Skills
              </CardTitle>
              <CardDescription>
                Skills to boost your career prospects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {insights.recommendedSkills.slice(0, 8).map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 hover:from-purple-200 hover:to-pink-200"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              <LearningPathsModal 
                recommendedSkills={insights.recommendedSkills} 
                industry={insights.industry || "Technology"}
              >
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Explore Learning Paths
                </Button>
              </LearningPathsModal>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
