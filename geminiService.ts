
import { GoogleGenAI, Type } from "@google/genai";
import { ProductInput, AnalysisResult } from "../types";

export const analyzeProduct = async (input: ProductInput): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const isModeA = input.productLink && input.productLink.trim() !== '';
  const modeSelection = isModeA ? "MODE A — LINK-BASED ANALYSIS" : "MODE B — MANUAL DATA ANALYSIS";

  const prompt = `
    You are InsightCart, a ruthless product market intelligence engine.
    
    CRITICAL INSTRUCTION:
    We are operating in ${modeSelection}.
    
    INPUT DATA FOR AUDIT:
    - Product Link: ${input.productLink || 'N/A'}
    - Reference Name: ${input.name}
    - Manual Description: ${input.description || 'N/A'}
    - Manual Price: ${input.price || 'N/A'}
    - Manual Audience: ${input.targetAudience || 'N/A'}
    - Region: ${input.country || 'Global'}
    - Platform: ${input.platform || 'General Web'}

    ${isModeA ? `
    MODE A PROTOCOL (AUTO-EXTRACT):
    1. Scan the "Product Link" provided. 
    2. Extract/Infer Name, Category, Pricing, Trust Signals (reviews, badges), and Target Audience persona from the URL structure and common knowledge of this store/platform.
    3. Label all inferred data clearly in the summary as "Extracted from source".
    4. Ignore empty manual fields; the link is the primary source.
    ` : `
    MODE B PROTOCOL (STRICT DATA):
    1. Use ONLY the provided manual text. 
    2. Do NOT assume the product has reviews or traction unless explicitly stated in the description.
    3. If critical data (price/audience) is vague, flag it as a HIGH RISK in the audit.
    `}

    REQUIRED OUTPUT MODULES:
    1. Select Mode: Must state "${isModeA ? 'LINK-BASED ANALYSIS' : 'MANUAL DATA ANALYSIS'}".
    2. Data Confidence Level (High/Medium/Low).
    3. Normalization: Normalize input into Core Problem, Buyer Persona, Value Prop, Price Positioning, and Risk Flags.
    4. Risk Audit: 3-5 failure points.
    5. Optimization: 4 growth strategies.
    6. Channels: 3 distribution platforms.
    7. Roadmap: 30-day GTM.
    8. Competitors: 3 market rivals.

    STRICT FORMATTING:
    - JSON response only.
    - No fluff. Punchy, professional tone.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      productName: { type: Type.STRING },
      selectedMode: { type: Type.STRING },
      dataConfidence: { type: Type.STRING },
      summary: { type: Type.STRING },
      normalization: {
        type: Type.OBJECT,
        properties: {
          coreProblem: { type: Type.STRING },
          buyerPersona: { type: Type.STRING },
          valueProp: { type: Type.STRING },
          pricePositioning: { type: Type.STRING },
          initialRiskFlags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["coreProblem", "buyerPersona", "valueProp", "pricePositioning", "initialRiskFlags"]
      },
      failureRiskScore: { type: Type.NUMBER },
      topMistakes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            rank: { type: Type.NUMBER },
            title: { type: Type.STRING },
            whyItMatters: { type: Type.STRING },
            conversionImpact: { type: Type.STRING },
            severity: { type: Type.STRING }
          },
          required: ["rank", "title", "whyItMatters", "conversionImpact", "severity"]
        }
      },
      optimizationStrategies: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            whatToChange: { type: Type.STRING },
            whyItWorks: { type: Type.STRING },
            impact: { type: Type.STRING }
          },
          required: ["category", "whatToChange", "whyItWorks", "impact"]
        }
      },
      salesStrategy: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            rank: { type: Type.NUMBER },
            platform: { type: Type.STRING },
            contentFormat: { type: Type.STRING },
            creatorType: { type: Type.STRING },
            conversionLogic: { type: Type.STRING }
          },
          required: ["rank", "platform", "contentFormat", "creatorType", "conversionLogic"]
        }
      },
      gtmPlan: {
        type: Type.OBJECT,
        properties: {
          launchAngle: { type: Type.STRING },
          timeline: {
            type: Type.OBJECT,
            properties: {
              days1to7: { type: Type.STRING },
              days8to21: { type: Type.STRING },
              days22to30: { type: Type.STRING }
            },
            required: ["days1to7", "days8to21", "days22to30"]
          },
          adHooks: { type: Type.ARRAY, items: { type: Type.STRING } },
          outreachAngle: { type: Type.STRING },
          funnelStages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stage: { type: Type.STRING },
                action: { type: Type.STRING }
              },
              required: ["stage", "action"]
            }
          }
        },
        required: ["launchAngle", "timeline", "adHooks", "outreachAngle", "funnelStages"]
      },
      competitiveAnalysis: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            pricing: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            positioning: { type: Type.STRING }
          },
          required: ["name", "pricing", "strengths", "weaknesses", "positioning"]
        }
      }
    },
    required: ["productName", "selectedMode", "dataConfidence", "normalization", "failureRiskScore", "topMistakes", "optimizationStrategies", "salesStrategy", "gtmPlan", "competitiveAnalysis", "summary"]
  };

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.7,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI engine.");
  
  try {
    const data = JSON.parse(text);
    return data as AnalysisResult;
  } catch (err) {
    console.error("JSON Parse Error:", text);
    throw new Error("Failed to parse market data. Please try again.");
  }
};
