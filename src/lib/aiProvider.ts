/**
 * AI Provider - Abstraction layer for WebLLM and API-based models
 */

import * as webllm from "@mlc-ai/web-llm";

export type AIProviderType = "webllm" | "groq" | "openai";

export interface AISettings {
  provider: AIProviderType;
  apiKey?: string;
  model?: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Store settings in localStorage
const SETTINGS_KEY = "mizzie-ai-settings";

export const getAISettings = (): AISettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load AI settings:", e);
  }
  return { provider: "webllm" };
};

export const saveAISettings = (settings: AISettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// WebLLM Engine singleton
let webllmEngine: webllm.MLCEngine | null = null;
let webllmLoading = false;
let webllmProgress = 0;

export const getWebLLMProgress = () => webllmProgress;
export const isWebLLMLoading = () => webllmLoading;

// Initialize WebLLM
export const initWebLLM = async (
  onProgress?: (progress: number, text: string) => void
): Promise<webllm.MLCEngine> => {
  if (webllmEngine) return webllmEngine;
  if (webllmLoading) {
    // Wait for existing load
    while (webllmLoading) {
      await new Promise((r) => setTimeout(r, 100));
    }
    if (webllmEngine) return webllmEngine;
  }

  webllmLoading = true;
  webllmProgress = 0;

  try {
    // Use a small, fast model
    const selectedModel = "Llama-3.2-1B-Instruct-q4f32_1-MLC";
    
    webllmEngine = await webllm.CreateMLCEngine(selectedModel, {
      initProgressCallback: (report) => {
        webllmProgress = report.progress * 100;
        onProgress?.(webllmProgress, report.text);
      },
    });

    webllmLoading = false;
    return webllmEngine;
  } catch (error) {
    webllmLoading = false;
    throw error;
  }
};

// Canvas data interface for context
export interface CanvasContext {
  keyPartners?: string;
  keyActivities?: string;
  keyResources?: string;
  valuePropositions?: string;
  customerRelationships?: string;
  channels?: string;
  customerSegments?: string;
  costStructure?: string;
  revenueStreams?: string;
}

// Build system prompt with canvas context
const buildSystemPrompt = (canvas?: CanvasContext): string => {
  const basePrompt = `You are Mizzie, a friendly business planning assistant. You help entrepreneurs with their Business Model Canvas.

The Business Model Canvas has 9 building blocks:
- Value Propositions: What unique value do you deliver?
- Customer Segments: Who are your customers?
- Channels: How do you reach customers?
- Customer Relationships: How do you interact with customers?
- Revenue Streams: How do you make money?
- Key Resources: What do you need to operate?
- Key Activities: What do you do?
- Key Partners: Who helps you?
- Cost Structure: What are your main costs?

Be conversational, encouraging, and helpful. Ask follow-up questions to get more details.
Keep responses concise (2-3 sentences max).`;

  // Add current canvas state if available
  if (canvas) {
    const filledSections: string[] = [];
    const emptySections: string[] = [];

    const checkSection = (name: string, value?: string) => {
      if (value && value.trim()) {
        filledSections.push(`${name}: ${value.trim()}`);
      } else {
        emptySections.push(name);
      }
    };

    checkSection("Value Propositions", canvas.valuePropositions);
    checkSection("Customer Segments", canvas.customerSegments);
    checkSection("Channels", canvas.channels);
    checkSection("Customer Relationships", canvas.customerRelationships);
    checkSection("Revenue Streams", canvas.revenueStreams);
    checkSection("Key Resources", canvas.keyResources);
    checkSection("Key Activities", canvas.keyActivities);
    checkSection("Key Partners", canvas.keyPartners);
    checkSection("Cost Structure", canvas.costStructure);

    let contextInfo = "\n\n--- CURRENT CANVAS STATE ---\n";

    if (filledSections.length > 0) {
      contextInfo += "\nFilled sections:\n" + filledSections.join("\n");
    }

    if (emptySections.length > 0) {
      contextInfo += "\n\nEmpty sections (need to be filled): " + emptySections.join(", ");
    }

    if (filledSections.length === 0) {
      contextInfo += "\nThe canvas is currently empty. Help the user get started!";
    }

    return basePrompt + contextInfo;
  }

  return basePrompt;
};

// Chat with WebLLM
const chatWithWebLLM = async (
  messages: ChatMessage[],
  canvas?: CanvasContext,
  onProgress?: (progress: number, text: string) => void
): Promise<string> => {
  const engine = await initWebLLM(onProgress);
  const systemPrompt = buildSystemPrompt(canvas);

  const response = await engine.chat.completions.create({
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    temperature: 0.7,
    max_tokens: 256,
  });

  return response.choices[0]?.message?.content || "I didn't understand that. Could you try again?";
};

// Chat with Groq/OpenAI API
const chatWithAPI = async (
  messages: ChatMessage[],
  settings: AISettings,
  canvas?: CanvasContext
): Promise<string> => {
  const baseUrl = settings.provider === "groq"
    ? "https://api.groq.com/openai/v1"
    : "https://api.openai.com/v1";

  const model = settings.model || (settings.provider === "groq" ? "llama-3.1-8b-instant" : "gpt-3.5-turbo");
  const systemPrompt = buildSystemPrompt(canvas);

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.7,
      max_tokens: 256,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "I didn't understand that. Could you try again?";
};

// Main chat function
export const chat = async (
  messages: ChatMessage[],
  canvas?: CanvasContext,
  onProgress?: (progress: number, text: string) => void
): Promise<string> => {
  const settings = getAISettings();

  if (settings.provider === "webllm") {
    return chatWithWebLLM(messages, canvas, onProgress);
  } else if (settings.apiKey) {
    return chatWithAPI(messages, settings, canvas);
  } else {
    throw new Error("API key required for " + settings.provider);
  }
};

// Check if WebLLM is supported
export const isWebLLMSupported = (): boolean => {
  return "gpu" in navigator;
};

