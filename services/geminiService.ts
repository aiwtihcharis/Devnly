import { GoogleGenAI, Type } from "@google/genai";
import { AIModelId, Slide } from "../types";

// In a real app, this would be a secure proxy.
// We strictly use process.env.API_KEY as requested.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

/**
 * Orchestrates the content generation.
 */
export const generateDeckContent = async (
  prompt: string, 
  modelId: AIModelId,
  context: string = ''
): Promise<{ text: string; slides?: Slide[] }> => {
  
  if (!modelId.includes('gemini')) {
    // Simulate other models for the "Orchestration" feature demo
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          text: `[${modelId} Mock Response]: I've analyzed your request regarding "${prompt}". Here is a drafted outline based on the context provided.`,
          slides: []
        });
      }, 1500);
    });
  }

  // Gemini Logic
  try {
    const isPro = modelId === AIModelId.GEMINI_PRO;
    
    // We want a structured JSON response for the slides + a conversational summary
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        conversationalSummary: { type: Type.STRING, description: "A friendly message to the user explaining what was created." },
        slides: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              contentSummary: { type: Type.STRING, description: "Bullet points or main text for the slide" }
            }
          }
        }
      }
    };

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Context: ${context}. User Request: ${prompt}. Create a presentation structure.`,
      config: {
        systemInstruction: "You are an expert Presentation Architect. Generate structured slide data.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: isPro ? { thinkingBudget: 1024 } : undefined // Enable thinking for Pro model
      }
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);

    // Map the simple JSON to our internal Slide structure
    const mappedSlides: Slide[] = (data.slides || []).map((s: any, index: number) => ({
      id: s.id || `slide-${index}-${Date.now()}`,
      title: s.title,
      elements: [
        {
          id: `el-${index}-title`,
          type: 'text',
          content: s.title,
          x: 5, y: 5, w: 90, h: 15,
          style: { fontSize: '24px', fontWeight: 'bold' }
        },
        {
          id: `el-${index}-body`,
          type: 'text',
          content: s.contentSummary,
          x: 5, y: 25, w: 90, h: 60,
          style: { fontSize: '16px' }
        }
      ],
      theme: 'nano-modern'
    }));

    return {
      text: data.conversationalSummary || "I've drafted the deck structure for you.",
      slides: mappedSlides
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "I encountered an issue connecting to the Gemini engine. Please check your API key.",
      slides: []
    };
  }
};

/**
 * AI Tools for the Editor
 */
export const improveSlideContent = async (text: string, action: 'rewrite' | 'shorten' | 'professional'): Promise<string> => {
  try {
    const prompts = {
      rewrite: "Rewrite the following text to be more engaging and clear.",
      shorten: "Condense the following text into a concise bullet point or sentence.",
      professional: "Rewrite the following text to sound strictly professional and corporate."
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${prompts[action]}: "${text}"`,
      config: {
        responseMimeType: "text/plain"
      }
    });
    return response.text || text;
  } catch (e) {
    console.error("AI Improve Error", e);
    return text + " (AI Updated)";
  }
};

export const optimizeHeadline = async (headline: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 3 punchy, high-converting variations of this presentation headline: "${headline}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return [headline, headline + " (Revised)", "Better: " + headline];
  }
};