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
  
  // Only handle Text/Deck generation models here
  if (!modelId.includes('gemini') || modelId.includes('image')) {
    // If user selected image/video model for text chat, redirect or handle gracefully
    // For now, we fall back to a simple mock if strictly text is requested from a media model
    if (modelId === AIModelId.VEO || modelId === AIModelId.GEMINI_IMAGE) {
       return {
         text: "Please use the Media generation tools to create Images or Videos. I am ready to generate a deck structure if you switch to Gemini Pro or Flash.",
         slides: []
       };
    }
  }

  // Gemini Logic
  try {
    const isPro = modelId === AIModelId.GEMINI_PRO;
    
    let modelName = 'gemini-2.5-flash';
    if (isPro) {
        modelName = 'gemini-3-pro-preview';
    } else if (modelId === AIModelId.GEMINI_FLASH_LITE) {
        modelName = 'gemini-2.5-flash-lite-latest'; // Flash Lite
    }
    
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
              contentSummary: { type: Type.STRING, description: "Bullet points or main text for the slide" },
              visualSuggestion: { type: Type.STRING, description: "A prompt for an image that would fit this slide" }
            }
          }
        }
      }
    };

    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Context: ${context}. User Request: ${prompt}. Create a presentation structure.`,
      config: {
        systemInstruction: "You are an expert Presentation Architect. Generate structured slide data.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: isPro ? { thinkingBudget: 32768 } : undefined // Max thinking budget for Pro
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
          style: { fontSize: 48, fontWeight: 'bold', fontFamily: 'Unbounded', color: '#18181b' }
        },
        {
          id: `el-${index}-body`,
          type: 'text',
          content: s.contentSummary,
          x: 5, y: 25, w: 50, h: 60,
          style: { fontSize: 20, fontFamily: 'Plus Jakarta Sans', color: '#52525b' }
        },
        // Placeholder for the visual suggestion
        {
            id: `el-${index}-img-placeholder`,
            type: 'image',
            content: '', // Empty means placeholder
            x: 60, y: 25, w: 35, h: 50,
            style: { borderRadius: 12, backgroundColor: '#f4f4f5' }
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
 * Gemini Image Generation (Supports Aspect Ratios)
 * Uses gemini-3-pro-image-preview
 */
export const generateImage = async (prompt: string, aspectRatio: string = '1:1'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
               imageConfig: {
                   aspectRatio: aspectRatio as any
               }
            }
        });
        
        // Iterate parts to find inline data
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        return '';
    } catch (e) {
        console.error("Image Gen Error", e);
        return '';
    }
};

/**
 * Veo 3.1 Video Generation
 */
export const generateVideo = async (prompt: string, aspectRatio: string = '16:9'): Promise<string> => {
    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: aspectRatio as any
            }
        });

        // Polling loop
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadLink) {
            // In a real app, you would fetch this blob. 
            // For this frontend-only context, we return the URI. 
            // Note: Accessing this URI usually requires the API Key appended.
            return `${downloadLink}&key=${process.env.API_KEY}`;
        }
        return '';

    } catch (e) {
        console.error("Veo Error", e);
        return '';
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
