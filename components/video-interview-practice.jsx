"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  SkipForward,
  Clock,
  CheckCircle,
  AlertCircle,
  Camera,
  Settings,
  Trophy,
  Target,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import Webcam from "react-webcam";
import useFetch from "@/hooks/use-fetch";
import {
  createVideoInterviewSession,
  saveVideoResponse,
  completeVideoInterviewSession,
  getVideoInterviewSessions,
  transcribeVideoAudio,
} from "@/actions/video-interview";
import { industries } from "@/data/industries";

const INTERVIEW_DIFFICULTIES = [
  { value: "beginner", label: "Beginner", description: "Entry-level questions" },
  { value: "intermediate", label: "Intermediate", description: "Mid-level professional questions" },
  { value: "advanced", label: "Advanced", description: "Senior-level and leadership questions" },
];

const QUESTION_CATEGORIES = [
  { value: "behavioral", label: "Behavioral", description: "Past experience and soft skills" },
  { value: "technical", label: "Technical", description: "Industry-specific knowledge" },
  { value: "situational", label: "Situational", description: "Hypothetical scenarios" },
];

export default function VideoInterviewPractice() {
  // State for interview setup
  const [step, setStep] = useState("setup"); // setup, interview, results
  const [settings, setSettings] = useState({
    industry: "",
    role: "",
    difficulty: "intermediate",
    questionCount: 5,
    timePerQuestion: 120,
    includeCategories: ["behavioral", "technical"],
  });

  // State for interview session
  const [currentSession, setCurrentSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Media state
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [mediaStream, setMediaStream] = useState(null);

  // Refs
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const recordedChunks = useRef([]);

  // Fetch hooks
  const { loading: createLoading, fn: createSession, data } = useFetch(createVideoInterviewSession);
  const { loading: saveLoading, fn: saveResponse } = useFetch(saveVideoResponse);
  const { loading: completeLoading, fn: completeSession } = useFetch(completeVideoInterviewSession);
  const { loading: transcribeLoading, fn: transcribeAudio } = useFetch(transcribeVideoAudio);

  // Timer effect
  useEffect(() => {
    if (isRecording && !isPaused && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleStopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording, isPaused, timeRemaining]);

  // Setup handlers
  const handleStartInterview = async () => {
    try {
      await createSession(settings);
      // The response is now in the data property after the useFetch hook processes it
      // We need to check the data from the hook, not the return value of createSession
    } catch (error) {
      toast.error(error.message || "Failed to create interview session");
    }
  };

  // Check if session was created successfully by watching the data from useFetch
  useEffect(() => {
    if (createLoading === false && data && data.success) {
      setCurrentSession(data.videoInterview);
      setCurrentQuestionIndex(0);
      setResponses([]);
      setStep("interview");
      toast.success("Interview session created successfully!");
    }
  }, [createLoading, data]);

  // Recording handlers
  const handleStartRecording = useCallback(() => {
    if (!webcamRef.current?.stream) {
      toast.error("Camera not available");
      return;
    }

    try {
      recordedChunks.current = [];
      const stream = webcamRef.current.stream;
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setTimeRemaining(currentSession?.questions[currentQuestionIndex]?.timeLimit || 120);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording");
    }
  }, [currentSession, currentQuestionIndex]);

  const handlePauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const handleStopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    return new Promise((resolve) => {
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        const audioBlob = new Blob(recordedChunks.current, { type: "audio/webm" });
        
        setIsRecording(false);
        setIsPaused(false);
        clearInterval(timerRef.current);

        // Transcribe audio
        let transcript = "";
        try {
          const transcribeResult = await transcribeAudio(audioBlob);
          transcript = transcribeResult.transcript;
        } catch (error) {
          console.error("Transcription failed:", error);
        }

        // Save response
        const currentQuestion = currentSession.questions[currentQuestionIndex];
        const duration = currentQuestion.timeLimit - timeRemaining;
        
        try {
          const result = await saveResponse(currentSession.sessionId, currentQuestion.id, {
            videoUrl: URL.createObjectURL(blob),
            transcript,
            duration,
          });

          if (result.success) {
            const newResponse = {
              ...result.response,
              questionIndex: currentQuestionIndex,
            };
            setResponses(prev => [...prev, newResponse]);
            toast.success("Response saved successfully!");
          }
        } catch (error) {
          toast.error("Failed to save response");
        }

        resolve();
      };

      mediaRecorderRef.current.stop();
    });
  }, [isRecording, timeRemaining, currentSession, currentQuestionIndex, saveResponse, transcribeAudio]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentSession.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeRemaining(currentSession.questions[currentQuestionIndex + 1]?.timeLimit || 120);
    } else {
      handleCompleteInterview();
    }
  };

  const handleCompleteInterview = async () => {
    try {
      const result = await completeSession(currentSession.sessionId);
      if (result.success) {
        setStep("results");
        toast.success("Interview completed successfully!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to complete interview");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Setup Step
  if (step === "setup") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-title mb-4">AI Video Interview Practice</h1>
          <p className="text-muted-foreground text-lg">
            Practice interviews with AI-powered feedback and analysis
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Interview Settings
            </CardTitle>
            <CardDescription>
              Customize your interview practice session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Industry Selection */}
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select 
                value={settings.industry} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, industry: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.id} value={industry.id}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Role Input */}
            <div className="space-y-2">
              <Label>Role/Position</Label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Software Engineer, Product Manager"
                value={settings.role}
                onChange={(e) => setSettings(prev => ({ ...prev, role: e.target.value }))}
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select 
                value={settings.difficulty} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INTERVIEW_DIFFICULTIES.map((difficulty) => (
                    <SelectItem key={difficulty.value} value={difficulty.value}>
                      <div>
                        <div className="font-medium">{difficulty.label}</div>
                        <div className="text-sm text-muted-foreground">{difficulty.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Question Categories */}
            <div className="space-y-2">
              <Label>Question Categories</Label>
              <div className="space-y-2">
                {QUESTION_CATEGORIES.map((category) => (
                  <label key={category.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.includeCategories.includes(category.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSettings(prev => ({
                            ...prev,
                            includeCategories: [...prev.includeCategories, category.value]
                          }));
                        } else {
                          setSettings(prev => ({
                            ...prev,
                            includeCategories: prev.includeCategories.filter(c => c !== category.value)
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium">{category.label}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {category.description}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div className="space-y-2">
              <Label>Number of Questions: {settings.questionCount}</Label>
              <input
                type="range"
                min="3"
                max="10"
                value={settings.questionCount}
                onChange={(e) => setSettings(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>

            {/* Time per Question */}
            <div className="space-y-2">
              <Label>Time per Question: {formatTime(settings.timePerQuestion)}</Label>
              <input
                type="range"
                min="60"
                max="300"
                step="30"
                value={settings.timePerQuestion}
                onChange={(e) => setSettings(prev => ({ ...prev, timePerQuestion: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>

            <Button 
              onClick={handleStartInterview}
              disabled={createLoading || !settings.industry || !settings.role || settings.includeCategories.length === 0}
              className="w-full"
              size="lg"
            >
              {createLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating Session...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  Start Interview Practice
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Interview Step
  if (step === "interview" && currentSession) {
    const currentQuestion = currentSession.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentSession.questions.length) * 100;

    return (
      <div className="space-y-6">
        {/* Progress Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                Question {currentQuestionIndex + 1} of {currentSession.questions.length}
              </h2>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {currentQuestion.category}
              </Badge>
            </div>
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </p>
          </CardContent>
        </Card>

        {/* Video Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  {isVideoEnabled ? (
                    <Webcam
                      ref={webcamRef}
                      audio={isAudioEnabled}
                      video={isVideoEnabled}
                      className="w-full h-full object-cover"
                      videoConstraints={{
                        width: 1280,
                        height: 720,
                        facingMode: "user"
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <VideoOff className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Recording Indicator */}
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-white text-sm font-medium">
                        {isPaused ? "PAUSED" : "RECORDING"}
                      </span>
                    </div>
                  )}
                  
                  {/* Timer */}
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono text-lg">
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  >
                    {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  >
                    {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </Button>
                  
                  {!isRecording ? (
                    <Button onClick={handleStartRecording} size="lg" className="bg-red-600 hover:bg-red-700">
                      <Play className="w-4 h-4 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <>
                      <Button 
                        onClick={handlePauseRecording} 
                        variant="outline"
                        size="lg"
                      >
                        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      </Button>
                      
                      <Button 
                        onClick={handleStopRecording}
                        variant="outline"
                        size="lg"
                        disabled={saveLoading}
                      >
                        <Square className="w-4 h-4 mr-2" />
                        Stop & Save
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Current Question
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-lg font-medium leading-relaxed">
                    {currentQuestion.question}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Key Points to Cover:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {currentQuestion.keyPoints?.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    Take your time to think before recording. You have {formatTime(currentQuestion.timeLimit)} for this question.
                  </AlertDescription>
                </Alert>
                
                {responses.find(r => r.questionIndex === currentQuestionIndex) && (
                  <Button 
                    onClick={handleNextQuestion}
                    className="w-full"
                    size="lg"
                  >
                    {currentQuestionIndex === currentSession.questions.length - 1 ? (
                      <>
                        <Trophy className="w-4 h-4 mr-2" />
                        Complete Interview
                      </>
                    ) : (
                      <>
                        <SkipForward className="w-4 h-4 mr-2" />
                        Next Question
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Results step would go here
  return (
    <div className="text-center py-12">
      <Trophy className="w-16 h-16 mx-auto mb-4 text-green-600" />
      <h2 className="text-2xl font-bold mb-2">Interview Completed!</h2>
      <p className="text-muted-foreground mb-6">
        Your responses are being analyzed. Results will be available shortly.
      </p>
      <Button onClick={() => setStep("setup")}>
        Start New Interview
      </Button>
    </div>
  );
}
