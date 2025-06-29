"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Loader2, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Briefcase, 
  Star,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import useFetch from "@/hooks/use-fetch";
import { onboardingSchema } from "@/app/lib/schema";
import { updateUser } from "@/actions/user";

const OnboardingForm = ({ industries }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(() => {
    // Load saved progress from localStorage if available
    if (typeof window !== 'undefined') {
      const savedStep = localStorage.getItem('onboarding-step');
      return savedStep ? parseInt(savedStep, 10) : 1;
    }
    return 1;
  });
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [skillsInput, setSkillsInput] = useState("");
  const [skillsList, setSkillsList] = useState(() => {
    // Load saved skills from localStorage if available
    if (typeof window !== 'undefined') {
      const savedSkills = localStorage.getItem('onboarding-skills');
      return savedSkills ? JSON.parse(savedSkills) : [];
    }
    return [];
  });

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    getValues,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    {
      number: 1,
      title: "Industry & Role",
      description: "Tell us about your professional field",
      icon: Briefcase,
    },
    {
      number: 2,
      title: "Experience Level",
      description: "Your professional experience",
      icon: Star,
    },
    {
      number: 3,
      title: "Skills & Expertise",
      description: "What you're good at",
      icon: User,
    },
    {
      number: 4,
      title: "Professional Story",
      description: "Your background and goals",
      icon: CheckCircle,
    },
  ];

  const onSubmit = async (values) => {
    if (skillsList.length === 0) {
      toast.error("Please add at least one skill before completing setup");
      setCurrentStep(3); // Go back to skills step
      return;
    }

    try {
      const formattedIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;

      await updateUserFn({
        ...values,
        industry: formattedIndustry,
        skills: skillsList,
      });
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Failed to save profile. Please try again.");
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Welcome to CareerAI! Your profile is complete.");
      // Clear saved progress from localStorage
      localStorage.removeItem('onboarding-step');
      localStorage.removeItem('onboarding-skills');
      router.push("/dashboard");
      router.refresh();
    }
    if (updateError) {
      toast.error(updateError.message || "Failed to save profile. Please try again.");
    }
  }, [updateResult, updateLoading, updateError, router]);

  const watchIndustry = watch("industry");

  const handleNext = async () => {
    let fieldsToValidate = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["industry", "subIndustry"];
        break;
      case 2:
        fieldsToValidate = ["experience"];
        break;
      case 3:
        // For skills step, we validate manually since skills are managed in state
        if (skillsList.length === 0) {
          toast.error("Please add at least one skill");
          return;
        }
        // Set the skills value for form validation
        setValue("skills", skillsList);
        break;
      case 4:
        fieldsToValidate = ["bio"];
        break;
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }

    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Save progress to localStorage
      localStorage.setItem('onboarding-step', nextStep.toString());
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addSkill = () => {
    if (skillsInput.trim() && !skillsList.includes(skillsInput.trim())) {
      const newSkills = [...skillsList, skillsInput.trim()];
      setSkillsList(newSkills);
      setValue("skills", newSkills);
      setSkillsInput("");
      // Save skills to localStorage
      localStorage.setItem('onboarding-skills', JSON.stringify(newSkills));
    }
  };

  const removeSkill = (skillToRemove) => {
    const newSkills = skillsList.filter(skill => skill !== skillToRemove);
    setSkillsList(newSkills);
    setValue("skills", newSkills);
    // Save skills to localStorage
    localStorage.setItem('onboarding-skills', JSON.stringify(newSkills));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Briefcase className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">What's your professional field?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                This helps us provide relevant industry insights, salary data, and job market trends specific to your field.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">💡</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Pro Tip</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Choose the industry that best matches your current role or the field you want to transition into. This will help us provide more accurate career guidance.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="industry" className="text-base font-medium">Industry</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("industry", value);
                    setSelectedIndustry(industries.find((ind) => ind.id === value));
                    setValue("subIndustry", "");
                  }}
                >
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder="Choose your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Industries</SelectLabel>
                      {industries.map((ind) => (
                        <SelectItem key={ind.id} value={ind.id}>
                          {ind.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.industry && (
                  <p className="text-sm text-red-500 mt-1">{errors.industry.message}</p>
                )}
              </div>

              {watchIndustry && selectedIndustry && (
                <div>
                  <Label htmlFor="subIndustry" className="text-base font-medium">Specialization</Label>
                  <Select onValueChange={(value) => setValue("subIndustry", value)}>
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Choose your specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Specializations</SelectLabel>
                        {selectedIndustry.subIndustries.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.subIndustry && (
                    <p className="text-sm text-red-500 mt-1">{errors.subIndustry.message}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Star className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">How experienced are you?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                This helps us tailor job recommendations, salary insights, and learning paths to your career level.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">📈</span>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">Career Level Guide</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Include all relevant experience: full-time work, internships, freelance projects, and significant personal projects. This helps us match you with appropriate opportunities.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="experience" className="text-base font-medium">Years of Professional Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="e.g., 3"
                className="mt-2 h-12 text-center text-lg"
                {...register("experience")}
              />
              <p className="text-sm text-gray-500 mt-2">
                Include internships and relevant project experience
              </p>
              {errors.experience && (
                <p className="text-sm text-red-500 mt-1">{errors.experience.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { range: "0-1", label: "Entry Level" },
                { range: "2-5", label: "Mid Level" },
                { range: "6-10", label: "Senior" },
                { range: "10+", label: "Expert" },
              ].map((level) => (
                <div
                  key={level.range}
                  className="p-4 border rounded-lg text-center cursor-pointer hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                  onClick={() => {
                    const years = level.range === "10+" ? "12" : level.range.split("-")[1] || level.range.split("-")[0];
                    setValue("experience", years);
                  }}
                >
                  <div className="font-medium text-sm">{level.range} years</div>
                  <div className="text-xs text-gray-500">{level.label}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">What are your key skills?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Add your technical skills, soft skills, and areas of expertise. This helps us create better resumes and match you with relevant opportunities.
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">🎯</span>
                </div>
                <div>
                  <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-1">Skills That Matter</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Include both technical skills (programming languages, tools) and soft skills (leadership, communication). Add at least 5-7 skills for better recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Add Skills</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., Python, Project Management, Leadership"
                  className="h-12"
                />
                <Button 
                  type="button" 
                  onClick={addSkill}
                  variant="outline"
                  className="h-12 px-4"
                >
                  Add
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Press Enter or click Add to include each skill
              </p>
            </div>

            {skillsList.length > 0 && (
              <div>
                <Label className="text-base font-medium">Your Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skillsList.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill} ×
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Click on any skill to remove it
                </p>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2">💡 Popular Skills in Your Industry</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  // General skills that apply to most industries
                  "Communication", "Leadership", "Problem Solving", "Project Management", 
                  "Data Analysis", "Teamwork", "Critical Thinking", "Time Management",
                  // Add some tech-specific ones
                  ...(watchIndustry === "tech" ? ["JavaScript", "Python", "React", "SQL", "AWS"] : []),
                  // Add some finance-specific ones  
                  ...(watchIndustry === "finance" ? ["Financial Modeling", "Excel", "Risk Analysis", "Bloomberg Terminal"] : []),
                  // Add some healthcare-specific ones
                  ...(watchIndustry === "healthcare" ? ["Patient Care", "Medical Research", "Healthcare Technology", "Compliance"] : []),
                ].slice(0, 8).map((suggestion) => (
                  <Badge
                    key={suggestion}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                    onClick={() => {
                      if (!skillsList.includes(suggestion)) {
                        const newSkills = [...skillsList, suggestion];
                        setSkillsList(newSkills);
                        setValue("skills", newSkills);
                        // Save skills to localStorage
                        localStorage.setItem('onboarding-skills', JSON.stringify(newSkills));
                      }
                    }}
                  >
                    + {suggestion}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Click to add skills that match your experience</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tell us your story</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share your professional background, achievements, and career goals. This helps our AI provide more personalized advice and recommendations.
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✍️</span>
                </div>
                <div>
                  <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1">Writing Your Story</h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Include your key achievements, career transition goals, or what you're passionate about. This optional step helps us provide more personalized career guidance.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="bio" className="text-base font-medium">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional journey, achievements, and what you're looking for in your career..."
                className="mt-2 h-32 resize-none"
                {...register("bio")}
              />
              <p className="text-sm text-gray-500 mt-2">
                This helps us provide more personalized recommendations (optional)
              </p>
              {errors.bio && (
                <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>
              )}
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
              <h4 className="font-semibold mb-3 text-purple-800 dark:text-purple-200">🚀 Your CareerAI Journey Starts Now!</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Personalized industry insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">AI-optimized resume builder</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Smart cover letter generator</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Mock interview practice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Salary benchmarking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Learning path recommendations</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Next up:</strong> We'll take you to your personalized dashboard where you can start building your career profile and accessing AI-powered tools.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Step {currentStep} of {totalSteps}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {Math.round(progress)}% Complete
            </span>
            {currentStep > 1 && (
              <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>Auto-saved</span>
              </div>
            )}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps Indicator */}
      <div className="flex justify-between mb-8">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          
          return (
            <div key={step.number} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="text-center">
                <div className={`text-xs font-medium ${isActive ? "text-purple-600" : "text-gray-500"}`}>
                  {step.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Card */}
      <Card className="border-0 shadow-xl bg-white dark:bg-gray-800">
        <CardContent className="p-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep === totalSteps ? (
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={updateLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
              >
                {updateLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
