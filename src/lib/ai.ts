// AI functionality for MMA Balkan platform
import { openai } from '@ai-sdk/openai';
import { generateText, generateObject } from 'ai';
import { z } from 'zod';

// AI Models
const AI_MODEL = 'gpt-4o-mini';

// Type definitions for AI inputs
export interface FighterData {
  name: string;
  record: string;
  weightClass: string;
  recentFights: Array<{
    opponent: string;
    result: 'win' | 'loss' | 'draw';
    method?: string;
    date: string;
  }>;
  stats: {
    wins: number;
    losses: number;
    draws: number;
    koWins?: number;
    submissionWins?: number;
  };
}

export interface EventData {
  name: string;
  date: string;
  location: string;
  mainEvent: {
    fighter1: string;
    fighter2: string;
    weightClass: string;
  };
  coMainEvent?: {
    fighter1: string;
    fighter2: string;
    weightClass: string;
  };
}

export interface EventResults {
  mainEventWinner: string;
  fights: Array<{
    winner: string;
    loser: string;
    method: string;
  }>;
}

export interface UserPreferences {
  favoriteFighters?: string[];
  favoriteWeightClasses?: string[];
  preferredFightingStyles?: string[];
}

// Schemas for AI responses
const FighterAnalysisSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  fightingStyle: z.string(),
  prediction: z.string(),
  confidence: z.number().min(0).max(1),
  recommendations: z.array(z.string()),
});

const EventPredictionSchema = z.object({
  mainEventWinner: z.string(),
  mainEventConfidence: z.number().min(0).max(1),
  coMainEventWinner: z.string().optional(),
  coMainEventConfidence: z.number().min(0).max(1).optional(),
  overallPrediction: z.string(),
  keyFactors: z.array(z.string()),
  upsetPotential: z.number().min(0).max(1),
});

const NewsAnalysisSchema = z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  keyPoints: z.array(z.string()),
  summary: z.string(),
  relatedTopics: z.array(z.string()),
  importance: z.number().min(0).max(1),
});

const ContentGenerationSchema = z.object({
  title: z.string(),
  content: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  category: z.string(),
});

// AI Service Class
export class AIService {
  private static instance: AIService;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env['OPENAI_API_KEY'] || '';
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. AI features will be disabled.');
    }
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private isEnabled(): boolean {
    return !!this.apiKey;
  }

  // Fighter Analysis
  async analyzeFighter(fighterData: FighterData): Promise<z.infer<typeof FighterAnalysisSchema> | null> {
    if (!this.isEnabled()) return null;

    try {
      const result = await generateObject({
        model: openai(AI_MODEL),
        schema: FighterAnalysisSchema,
        prompt: `
          Analyze this MMA fighter and provide insights:
          
          Fighter: ${fighterData.name}
          Record: ${fighterData.record}
          Weight Class: ${fighterData.weightClass}
          Recent Fights: ${JSON.stringify(fighterData.recentFights)}
          Stats: ${JSON.stringify(fighterData.stats)}
          
          Provide a detailed analysis including:
          - Key strengths and weaknesses
          - Fighting style assessment
          - Performance prediction
          - Training recommendations
          
          Be specific and technical in your analysis.
        `,
      });

      return result.object;
    } catch (error) {
      console.error('Error analyzing fighter:', error);
      return null;
    }
  }

  // Event Prediction
  async predictEvent(eventData: EventData): Promise<z.infer<typeof EventPredictionSchema> | null> {
    if (!this.isEnabled()) return null;

    try {
      const result = await generateObject({
        model: openai(AI_MODEL),
        schema: EventPredictionSchema,
        prompt: `
          Predict the outcomes of this MMA event:
          
          Event: ${eventData.name}
          Date: ${eventData.date}
          Location: ${eventData.location}
          Main Event: ${JSON.stringify(eventData.mainEvent)}
          Co-Main Event: ${eventData.coMainEvent ? JSON.stringify(eventData.coMainEvent) : 'N/A'}
          
          Provide predictions for:
          - Main event winner and confidence level
          - Co-main event winner (if applicable)
          - Overall event analysis
          - Key factors that could influence outcomes
          - Upset potential assessment
          
          Base predictions on fighter records, recent performance, and fighting styles.
        `,
      });

      return result.object;
    } catch (error) {
      console.error('Error predicting event:', error);
      return null;
    }
  }

  // News Analysis
  async analyzeNews(newsData: {
    title: string;
    content: string;
    category: string;
  }): Promise<z.infer<typeof NewsAnalysisSchema> | null> {
    if (!this.isEnabled()) return null;

    try {
      const result = await generateObject({
        model: openai(AI_MODEL),
        schema: NewsAnalysisSchema,
        prompt: `
          Analyze this MMA news article:
          
          Title: ${newsData.title}
          Category: ${newsData.category}
          Content: ${newsData.content}
          
          Provide analysis including:
          - Sentiment analysis (positive/negative/neutral)
          - Key points and takeaways
          - Summary of the article
          - Related topics and themes
          - Importance level for MMA fans
          
          Focus on MMA-specific insights and context.
        `,
      });

      return result.object;
    } catch (error) {
      console.error('Error analyzing news:', error);
      return null;
    }
  }

  // Content Generation
  async generateContent(prompt: string, type: 'news' | 'analysis' | 'preview'): Promise<z.infer<typeof ContentGenerationSchema> | null> {
    if (!this.isEnabled()) return null;

    try {
      const result = await generateObject({
        model: openai(AI_MODEL),
        schema: ContentGenerationSchema,
        prompt: `
          Generate ${type} content for MMA Balkan platform based on this prompt:
          
          ${prompt}
          
          Create engaging, informative content that would appeal to MMA fans.
          Include appropriate tags and categorize the content properly.
          Make it SEO-friendly and engaging for social media.
        `,
      });

      return result.object;
    } catch (error) {
      console.error('Error generating content:', error);
      return null;
    }
  }

  // Chat Bot for MMA Questions
  async chatWithBot(message: string, context?: Record<string, unknown>): Promise<string | null> {
    if (!this.isEnabled()) return null;

    try {
      const result = await generateText({
        model: openai(AI_MODEL),
        prompt: `
          You are an expert MMA assistant for the MMA Balkan platform. 
          Answer questions about MMA fighters, events, techniques, and news.
          
          Context: ${context ? JSON.stringify(context) : 'No specific context'}
          User Question: ${message}
          
          Provide helpful, accurate, and engaging responses about MMA.
          If you don't know something, say so rather than guessing.
          Keep responses concise but informative.
        `,
      });

      return result.text;
    } catch (error) {
      console.error('Error with chat bot:', error);
      return null;
    }
  }

  // Generate Fight Preview
  async generateFightPreview(fighter1: FighterData, fighter2: FighterData): Promise<string | null> {
    if (!this.isEnabled()) return null;

    try {
      const result = await generateText({
        model: openai(AI_MODEL),
        prompt: `
          Write an engaging fight preview for this MMA bout:
          
          Fighter 1: ${JSON.stringify(fighter1)}
          Fighter 2: ${JSON.stringify(fighter2)}
          
          Create a compelling preview that:
          - Highlights each fighter's strengths
          - Analyzes the matchup
          - Predicts potential outcomes
          - Explains why fans should watch
          
          Make it exciting and informative for MMA fans.
        `,
      });

      return result.text;
    } catch (error) {
      console.error('Error generating fight preview:', error);
      return null;
    }
  }

  // Generate Event Summary
  async generateEventSummary(eventData: EventData, results: EventResults): Promise<string | null> {
    if (!this.isEnabled()) return null;

    try {
      const result = await generateText({
        model: openai(AI_MODEL),
        prompt: `
          Write a comprehensive event summary for this MMA event:
          
          Event: ${JSON.stringify(eventData)}
          Results: ${JSON.stringify(results)}
          
          Create a summary that:
          - Recaps the main highlights
          - Analyzes key performances
          - Discusses implications for rankings
          - Highlights memorable moments
          
          Make it engaging and informative for MMA fans.
        `,
      });

      return result.text;
    } catch (error) {
      console.error('Error generating event summary:', error);
      return null;
    }
  }

  // Generate Social Media Content
  async generateSocialContent(content: string, platform: 'twitter' | 'instagram' | 'facebook'): Promise<string | null> {
    if (!this.isEnabled()) return null;

    try {
      const result = await generateText({
        model: openai(AI_MODEL),
        prompt: `
          Create engaging social media content for ${platform} based on this MMA content:
          
          ${content}
          
          Adapt the content for ${platform}:
          - Use appropriate length and format
          - Include relevant hashtags
          - Make it engaging and shareable
          - Include call-to-action if appropriate
        `,
      });

      return result.text;
    } catch (error) {
      console.error('Error generating social content:', error);
      return null;
    }
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();

// Utility functions
export const aiUtils = {
  // Check if AI is available
  isAvailable: () => !!process.env['OPENAI_API_KEY'],

  // Format confidence as percentage
  formatConfidence: (confidence: number) => `${Math.round(confidence * 100)}%`,

  // Get sentiment emoji
  getSentimentEmoji: (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      case 'neutral': return '😐';
      default: return '🤔';
    }
  },

  // Generate AI-powered recommendations
  generateRecommendations: async (userPreferences: UserPreferences) => {
    const ai = AIService.getInstance();
    return await ai.chatWithBot(
      `Based on my preferences: ${JSON.stringify(userPreferences)}, what MMA content would you recommend?`
    );
  },
};
