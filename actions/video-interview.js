"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import videoInterviewService from "@/lib/video-interview-service";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from 'uuid';

// Create a new video interview session
export async function createVideoInterviewSession(settings) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    console.log("Creating video interview session with settings:", settings);
    
    // Validate settings
    const validation = videoInterviewService.validateSettings(settings);
    if (!validation.isValid) {
      console.error("Settings validation failed:", validation.errors);
      throw new Error(`Invalid settings: ${validation.errors.join(', ')}`);
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    console.log("User found, generating questions...");

    // Generate interview questions
    const questions = await videoInterviewService.generateQuestions({
      industry: settings.industry,
      role: settings.role,
      difficulty: settings.difficulty,
      questionCount: settings.questionCount,
      categories: settings.includeCategories,
    });

    console.log("Questions generated:", questions.length);

    // Create session ID
    const sessionId = uuidv4();

    console.log("Creating database record...");

    // Create video interview record
    const videoInterview = await db.videoInterview.create({
      data: {
        userId: user.id,
        sessionId,
        industry: settings.industry,
        role: settings.role,
        difficulty: settings.difficulty,
        questions,
        responses: [],
        status: "in_progress",
      },
    });

    console.log("Video interview session created successfully");

    return {
      success: true,
      sessionId,
      questions,
      videoInterview,
    };
  } catch (error) {
    console.error("Error creating video interview session:", error);
    throw new Error(error.message || "Failed to create video interview session");
  }
}

// Save video response for a question
export async function saveVideoResponse(sessionId, questionId, responseData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Find the video interview session
    const videoInterview = await db.videoInterview.findUnique({
      where: { sessionId },
    });

    if (!videoInterview || videoInterview.userId !== user.id) {
      throw new Error("Video interview session not found or unauthorized");
    }

    // Find the question
    const question = videoInterview.questions.find(q => q.id === questionId);
    if (!question) {
      throw new Error("Question not found in session");
    }

    // Analyze the response using AI
    let analysis = null;
    if (responseData.transcript) {
      analysis = await videoInterviewService.analyzeResponse({
        question: question.question,
        transcript: responseData.transcript,
        duration: responseData.duration,
        questionCategory: question.category,
        industry: videoInterview.industry,
        role: videoInterview.role,
      });
    }

    // Create response object
    const response = {
      questionId,
      question: question.question,
      category: question.category,
      videoUrl: responseData.videoUrl,
      transcript: responseData.transcript,
      duration: responseData.duration,
      analysis,
      recordedAt: new Date().toISOString(),
    };

    // Update the video interview with the new response
    const updatedResponses = [...videoInterview.responses, response];
    
    await db.videoInterview.update({
      where: { id: videoInterview.id },
      data: {
        responses: updatedResponses,
      },
    });

    return {
      success: true,
      response,
      analysis,
    };
  } catch (error) {
    console.error("Error saving video response:", error);
    throw new Error(error.message || "Failed to save video response");
  }
}

// Complete video interview session
export async function completeVideoInterviewSession(sessionId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Find the video interview session
    const videoInterview = await db.videoInterview.findUnique({
      where: { sessionId },
    });

    if (!videoInterview || videoInterview.userId !== user.id) {
      throw new Error("Video interview session not found or unauthorized");
    }

    if (videoInterview.status === "completed") {
      throw new Error("Interview session already completed");
    }

    // Calculate total duration
    const totalDuration = videoInterview.responses.reduce((total, response) => {
      return total + (response.duration || 0);
    }, 0);

    // Generate overall feedback
    const overallFeedback = await videoInterviewService.generateOverallFeedback({
      responses: videoInterview.responses,
      industry: videoInterview.industry,
      role: videoInterview.role,
      totalDuration,
    });

    // Calculate average scores
    const scores = videoInterview.responses
      .filter(r => r.analysis?.scores)
      .map(r => r.analysis.scores);

    const averageScores = scores.length > 0 ? {
      clarity: scores.reduce((sum, s) => sum + s.clarity, 0) / scores.length,
      content: scores.reduce((sum, s) => sum + s.content, 0) / scores.length,
      confidence: scores.reduce((sum, s) => sum + s.confidence, 0) / scores.length,
      overall: scores.reduce((sum, s) => sum + s.overall, 0) / scores.length,
    } : null;

    // Update the video interview with completion data
    const completedInterview = await db.videoInterview.update({
      where: { id: videoInterview.id },
      data: {
        status: "completed",
        completedAt: new Date(),
        duration: totalDuration,
        overallScore: averageScores?.overall || null,
        confidenceScore: averageScores?.confidence || null,
        clarityScore: averageScores?.clarity || null,
        contentScore: averageScores?.content || null,
        strengths: overallFeedback.performanceSummary?.strengths || [],
        improvements: overallFeedback.performanceSummary?.weaknesses || [],
        feedback: JSON.stringify(overallFeedback),
      },
    });

    revalidatePath("/interview");

    return {
      success: true,
      completedInterview,
      overallFeedback,
      practiceRecommendations: videoInterviewService.getPracticeRecommendations(overallFeedback),
    };
  } catch (error) {
    console.error("Error completing video interview session:", error);
    throw new Error(error.message || "Failed to complete video interview session");
  }
}

// Get video interview session details
export async function getVideoInterviewSession(sessionId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const videoInterview = await db.videoInterview.findUnique({
      where: { sessionId },
    });

    if (!videoInterview || videoInterview.userId !== user.id) {
      throw new Error("Video interview session not found or unauthorized");
    }

    return {
      success: true,
      videoInterview,
    };
  } catch (error) {
    console.error("Error getting video interview session:", error);
    throw new Error(error.message || "Failed to get video interview session");
  }
}

// Get all video interview sessions for user
export async function getVideoInterviewSessions() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const videoInterviews = await db.videoInterview.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      videoInterviews,
    };
  } catch (error) {
    console.error("Error getting video interview sessions:", error);
    throw new Error("Failed to get video interview sessions");
  }
}

// Delete video interview session
export async function deleteVideoInterviewSession(sessionId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const videoInterview = await db.videoInterview.findUnique({
      where: { sessionId },
    });

    if (!videoInterview || videoInterview.userId !== user.id) {
      throw new Error("Video interview session not found or unauthorized");
    }

    await db.videoInterview.delete({
      where: { id: videoInterview.id },
    });

    revalidatePath("/interview");

    return {
      success: true,
      message: "Video interview session deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting video interview session:", error);
    throw new Error("Failed to delete video interview session");
  }
}

// Transcribe audio from video response
export async function transcribeVideoAudio(audioBlob) {
  try {
    // This would integrate with a real speech-to-text service
    const transcript = await videoInterviewService.transcribeAudio(audioBlob);
    
    return {
      success: true,
      transcript,
    };
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw new Error("Failed to transcribe audio");
  }
}
