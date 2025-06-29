// AI-Powered Video Interview Practice Service
import { GoogleGenerativeAI } from '@google/generative-ai';

class VideoInterviewService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  // Generate interview questions based on industry and role
  async generateQuestions({ industry, role, difficulty = 'intermediate', questionCount = 5, categories = ['behavioral', 'technical', 'situational'] }) {
    const prompt = `
      Generate ${questionCount} interview questions for a ${role} position in the ${industry} industry.
      
      Difficulty level: ${difficulty}
      Include categories: ${categories.join(', ')}
      
      For each question, provide:
      1. The question text
      2. Category (behavioral, technical, or situational)
      3. Expected answer key points
      4. Time limit recommendation (60-300 seconds)
      5. Evaluation criteria
      
      Return as JSON in this format:
      {
        "questions": [
          {
            "id": "unique_id",
            "question": "Question text",
            "category": "behavioral|technical|situational",
            "timeLimit": 120,
            "keyPoints": ["point1", "point2", "point3"],
            "evaluationCriteria": {
              "clarity": "What to look for in clarity",
              "content": "What content points to evaluate",
              "confidence": "Confidence indicators to assess"
            }
          }
        ]
      }
      
      Make questions relevant to ${industry} and appropriate for ${difficulty} level candidates.
      Ensure a good mix of the requested categories.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const cleanedResponse = response.replace(/```(?:json)?\n?/g, '').trim();
      const data = JSON.parse(cleanedResponse);
      
      // Add unique IDs if not present
      data.questions = data.questions.map((q, index) => ({
        ...q,
        id: q.id || `q_${Date.now()}_${index}`,
      }));
      
      return data.questions;
    } catch (error) {
      console.error('Error generating interview questions:', error);
      throw new Error('Failed to generate interview questions');
    }
  }

  // Analyze video interview response using AI
  async analyzeResponse({ 
    question, 
    transcript, 
    duration, 
    questionCategory, 
    industry,
    role 
  }) {
    const prompt = `
      Analyze this video interview response for a ${role} position in ${industry}.
      
      Question: "${question}"
      Category: ${questionCategory}
      Response transcript: "${transcript}"
      Response duration: ${duration} seconds
      
      Provide detailed analysis in JSON format:
      {
        "scores": {
          "clarity": 0-100,
          "content": 0-100,
          "confidence": 0-100,
          "relevance": 0-100,
          "overall": 0-100
        },
        "strengths": ["strength1", "strength2"],
        "improvements": ["improvement1", "improvement2"],
        "feedback": "Detailed constructive feedback",
        "keywordMatches": ["relevant keywords mentioned"],
        "suggestedImprovements": [
          {
            "area": "area to improve",
            "suggestion": "specific suggestion",
            "priority": "high|medium|low"
          }
        ]
      }
      
      Be constructive and specific. Focus on:
      1. Communication clarity and structure
      2. Content relevance and depth
      3. Confidence and professionalism
      4. Industry-specific knowledge demonstration
      5. Answer completeness
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const cleanedResponse = response.replace(/```(?:json)?\n?/g, '').trim();
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Error analyzing interview response:', error);
      throw new Error('Failed to analyze interview response');
    }
  }

  // Generate overall interview feedback
  async generateOverallFeedback({ responses, industry, role, totalDuration }) {
    const responseSummary = responses.map(r => ({
      question: r.question,
      category: r.category,
      scores: r.analysis?.scores,
      duration: r.duration,
    }));

    const prompt = `
      Generate comprehensive feedback for a complete video interview session:
      
      Position: ${role} in ${industry}
      Total Duration: ${totalDuration} seconds
      
      Individual Response Analysis:
      ${JSON.stringify(responseSummary, null, 2)}
      
      Provide overall assessment in JSON format:
      {
        "overallScores": {
          "clarity": 0-100,
          "content": 0-100,
          "confidence": 0-100,
          "consistency": 0-100,
          "overall": 0-100
        },
        "performanceSummary": {
          "strengths": ["key strengths"],
          "weaknesses": ["areas needing improvement"],
          "standoutMoments": ["memorable positive moments"],
          "concerningAreas": ["areas of concern"]
        },
        "categoryBreakdown": {
          "behavioral": { "score": 0-100, "feedback": "feedback" },
          "technical": { "score": 0-100, "feedback": "feedback" },
          "situational": { "score": 0-100, "feedback": "feedback" }
        },
        "improvementPlan": [
          {
            "priority": "high|medium|low",
            "area": "area to improve",
            "actionSteps": ["step1", "step2"],
            "resources": ["resource1", "resource2"]
          }
        ],
        "readinessAssessment": {
          "level": "ready|needs_practice|significant_improvement_needed",
          "reasoning": "explanation of assessment",
          "nextSteps": ["recommended next steps"]
        }
      }
      
      Be honest but constructive. Provide actionable feedback.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const cleanedResponse = response.replace(/```(?:json)?\n?/g, '').trim();
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Error generating overall feedback:', error);
      throw new Error('Failed to generate overall feedback');
    }
  }

  // Convert speech to text (placeholder for actual implementation)
  async transcribeAudio(audioBlob) {
    // This would integrate with a speech-to-text service like:
    // - Google Speech-to-Text API
    // - Azure Speech Services
    // - OpenAI Whisper API
    // - Browser's SpeechRecognition API
    
    // For now, return a placeholder
    return new Promise((resolve) => {
      // Simulate processing time
      setTimeout(() => {
        resolve("This is a placeholder transcript. In a real implementation, this would use a speech-to-text service.");
      }, 1000);
    });
  }

  // Analyze facial expressions and body language (placeholder)
  async analyzeVisualCues(videoBlob) {
    // This would integrate with computer vision services for:
    // - Facial expression analysis
    // - Eye contact detection
    // - Posture analysis
    // - Hand gesture recognition
    
    return {
      eyeContact: 85, // percentage
      facialExpressions: {
        confidence: 80,
        engagement: 90,
        nervousness: 20,
      },
      posture: {
        score: 85,
        notes: "Good upright posture throughout most of the response"
      },
      gestures: {
        appropriateness: 90,
        frequency: "moderate",
        notes: "Natural hand gestures that support communication"
      }
    };
  }

  // Get practice recommendations based on performance
  getPracticeRecommendations(analysisResults) {
    const recommendations = [];
    
    if (analysisResults.overallScores.clarity < 70) {
      recommendations.push({
        area: "Communication Clarity",
        exercises: [
          "Practice speaking slowly and clearly",
          "Record yourself answering common questions",
          "Work on eliminating filler words",
        ],
        priority: "high"
      });
    }
    
    if (analysisResults.overallScores.confidence < 70) {
      recommendations.push({
        area: "Confidence Building",
        exercises: [
          "Practice power poses before interviews",
          "Prepare and memorize key talking points",
          "Mock interview practice with friends or family",
        ],
        priority: "high"
      });
    }
    
    if (analysisResults.overallScores.content < 70) {
      recommendations.push({
        area: "Content Preparation",
        exercises: [
          "Research common interview questions for your field",
          "Prepare STAR method examples",
          "Study the company and role requirements",
        ],
        priority: "medium"
      });
    }
    
    return recommendations;
  }

  // Validate video interview settings
  validateSettings(settings) {
    const errors = [];
    
    if (!settings.industry) {
      errors.push('Industry is required');
    }
    
    if (!settings.role) {
      errors.push('Role is required');
    }
    
    if (settings.questionCount < 3 || settings.questionCount > 10) {
      errors.push('Question count must be between 3 and 10');
    }
    
    if (settings.timePerQuestion < 60 || settings.timePerQuestion > 300) {
      errors.push('Time per question must be between 60 and 300 seconds');
    }
    
    if (!settings.includeCategories || settings.includeCategories.length === 0) {
      errors.push('At least one question category must be selected');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default new VideoInterviewService();
