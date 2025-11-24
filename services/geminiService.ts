import { GoogleGenAI, Modality } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (ai) return ai;
  
  // Safe access guard for process.env
  const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
  
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const generateStoryImage = async (prompt: string): Promise<string | null> => {
  const client = getAiClient();
  if (!client) {
    console.warn("Gemini API Key is missing or client failed to initialize. Using placeholder.");
    return null;
  }

  try {
    // Modified prompt to match the requested style: Oil painting, Victorian storybook, highly detailed.
    const enhancedPrompt = `Classic Victorian storybook illustration, oil painting on canvas style, masterpiece, highly detailed, realistic proportions, warm golden lighting, 19th century atmosphere. Scene: ${prompt}`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: enhancedPrompt,
          },
        ],
      },
    });

    // Extract image from response
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image')) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Failed to generate image:", error);
    return null;
  }
};

export const generateStorySpeech = async (text: string): Promise<string | null> => {
  const client = getAiClient();
  if (!client) return null;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: {
        parts: [{ text: text }],
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.[0];
    
    if (audioPart?.inlineData?.data) {
      return audioPart.inlineData.data;
    }
    return null;
  } catch (error) {
    console.error("Speech generation failed:", error);
    return null;
  }
};