import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize environment configurations
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// LAZY INITIALIZATION BLOCK FOR GEMINI CLIENT
// As instructed: Checks for process.env.GEMINI_API_KEY dynamically at runtime
// to avoid crashing the server on startup when the secret is not configured in secrets.
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// ----------------------------------------------------------------------------
// 1. AI HYGIENE PHOTO ANALYSIS
// ----------------------------------------------------------------------------
app.post("/api/ai/hygiene-photo", async (req, res) => {
  const { vendorId, vendorName, photoUrl, mockOnly } = req.body;
  const ai = getGeminiClient();

  if (!ai || mockOnly) {
    // Elegant fallbacks representing typical street stall observations in Bangalore
    const score = vendorName?.toLowerCase().includes("shawarma") ? 68 : 88;
    const status = score < 75 ? "Fail" : "Pass";
    const highlights = score < 75 
      ? [
          "Identified exposed raw poultry skewers near exhaust fumes (critical threat).",
          "Lack of active workspace sterilization record over current shift cycle.",
          "Adequate hairnet and FSSAI sanitation gloves present on main preparer."
        ]
      : [
          "Perfect stainless steel workbench setup observed in high-def feed.",
          "Proper grease trapping and waste disposal lids locked.",
          "Safe ambient temperature recorded at cold-holding unit (4.2°C)."
        ];

    return res.json({
      success: true,
      mode: "Mock AI (Fallback)",
      data: {
        vendorId,
        vendorName,
        aiPhotoScore: score,
        foodSafetyStatus: status,
        findings: highlights,
        timestamp: new Date().toISOString(),
        hazardCount: score < 75 ? 2 : 0,
        inspectorAlertTriggered: score < 75,
        confidence: 0.89
      }
    });
  }

  try {
    const prompt = `Perform a food safety and kitchen hygiene digital scan of the street food stall "${vendorName}" (ID: ${vendorId}). 
    Since this is a simulated image URL input "${photoUrl || 'default_stall.png'}", generate a highly realistic computer-vision style report using the following JSON schema. Make sure to tailor findings to authentic Indian street vendor scenarios.
    
    Response model structure:
    {
      "aiPhotoScore": number (0-100),
      "foodSafetyStatus": string ("Pass" or "Fail", "Fail" if score < 75),
      "findings": string[],
      "hazardCount": number,
      "inspectorAlertTriggered": boolean,
      "confidence": number (float from 0.0 to 1.0)
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiPhotoScore: { type: Type.INTEGER, description: "Compliance score from 0 to 100" },
            foodSafetyStatus: { type: Type.STRING, description: "'Pass' or 'Fail'" },
            findings: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Array of distinct bullet points detailing observations" 
            },
            hazardCount: { type: Type.INTEGER },
            inspectorAlertTriggered: { type: Type.BOOLEAN },
            confidence: { type: Type.NUMBER, description: "Confidence score from 0.0 to 1.0" }
          },
          required: ["aiPhotoScore", "foodSafetyStatus", "findings", "hazardCount", "inspectorAlertTriggered", "confidence"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({
      success: true,
      mode: "Gemini Live API",
      data: {
        vendorId,
        vendorName,
        ...parsedData,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------------------------------
// 2. AI FAKE REVIEW DETECTION (SPAM FILTERS)
// ----------------------------------------------------------------------------
app.post("/api/ai/fake-review", async (req, res) => {
  const { vendorName, reviews, mockOnly } = req.body;
  const ai = getGeminiClient();

  if (!ai || mockOnly) {
    // Premium logical mock for Bangalore food streets spam patterns
    const analyzedReviews = (reviews || []).map((rev: any, index: number) => {
      const text = rev.text || "";
      const isSuspect = text.includes("BEST!!!") || text.includes("PROMO") || text.includes("discount key") || text.length < 8;
      return {
        id: rev.id || `r-${index}`,
        text: rev.text,
        user: rev.user || "Citizen Advocate",
        isSpam: isSuspect,
        confidence: isSuspect ? 0.94 : 0.03,
        reason: isSuspect ? "Repetitive punctuation and promotional spam keywords detected in quick succession." : "Legitimate user sentiment with contextual descriptors."
      };
    });

    return res.json({
      success: true,
      mode: "Mock AI (Fallback)",
      spamCount: analyzedReviews.filter((r: any) => r.isSpam).length,
      analyzedReviews
    });
  }

  try {
    const prompt = `Act as an AI Security Audit bot in Bangalore Food Court administrative center. Analyze the following listing of user reviews for vendor "${vendorName}" to detect fraudulent reviews, review matching spam, or marketing abuse. 
    
    Reviews to analyze:
    ${JSON.stringify(reviews)}

    Return a JSON response matching the following schema representation:
    {
      "analyzedReviews": [
        {
          "id": "match reviewer ID",
          "isSpam": boolean,
          "confidence": number (float from 0.0 to 1.0),
          "reason": "short explanation of why it is flagged or safe"
        }
      ]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analyzedReviews: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  isSpam: { type: Type.BOOLEAN },
                  confidence: { type: Type.NUMBER },
                  reason: { type: Type.STRING }
                },
                required: ["id", "isSpam", "confidence", "reason"]
              }
            }
          },
          required: ["analyzedReviews"]
        }
      }
    });

    res.json({
      success: true,
      mode: "Gemini Live API",
      ...JSON.parse(response.text || "{}")
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------------------------------
// 3. AI VENDOR RISK SCORING
// ----------------------------------------------------------------------------
app.post("/api/ai/vendor-risk", async (req, res) => {
  const { vendorData, mockOnly } = req.body;
  const ai = getGeminiClient();

  if (!ai || mockOnly) {
    // Generate logical compliance categories & flags dynamically
    const hygieneScore = vendorData?.hygieneScore || 80;
    const complaintsCount = vendorData?.complaintsCount || 0;
    
    let riskLevel: "Safe" | "Medium Risk" | "High Risk" = "Safe";
    let explanation = "Vendor shows high systemic compliance and active hygienic certifications.";
    
    if (hygieneScore < 75 || complaintsCount >= 2) {
      riskLevel = "High Risk";
      explanation = "Critical FSSAI sanitary violation reports combined with recurring customer safety disputes.";
    } else if (hygieneScore < 85 || complaintsCount > 0) {
      riskLevel = "Medium Risk";
      explanation = "Minor inspection warnings on cold-holding logs or waste management. Recommend next-day sanitary audit.";
    }

    return res.json({
      success: true,
      mode: "Mock AI (Fallback)",
      data: {
        riskLevel,
        recommendedAction: riskLevel === "High Risk" ? "Dispatch Spot Inspector & Freeze QR-Payments" : riskLevel === "Medium Risk" ? "Schedule Next-Day Sanitary Audit" : "Approve Routine Compliance Operations",
        explanation,
        weights: {
          hygieneWeight: 0.5,
          disputeWeight: 0.3,
          licenseWeight: 0.2
        },
        confidence: 0.92
      }
    });
  }

  try {
    const prompt = `Conduct a regulatory and health risk assessment of a street food vendor in Bangalore with the following attributes:
    ${JSON.stringify(vendorData)}

    Categorize as 'Safe', 'Medium Risk', or 'High Risk'. Suggest concrete actions for municipal management.
    Provide the response using this JSON structure:
    {
      "riskLevel": "Safe" | "Medium Risk" | "High Risk",
      "recommendedAction": "Action text",
      "explanation": "Detailed regulatory reasoning",
      "confidence": number (0.0 to 1.0)
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, description: "Must be 'Safe', 'Medium Risk', or 'High Risk'" },
            recommendedAction: { type: Type.STRING },
            explanation: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          },
          required: ["riskLevel", "recommendedAction", "explanation", "confidence"]
        }
      }
    });

    res.json({
      success: true,
      mode: "Gemini Live API",
      data: JSON.parse(response.text || "{}")
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------------------------------
// 4. AI HIDDEN GEM DETECTION
// ----------------------------------------------------------------------------
app.post("/api/ai/hidden-gems", async (req, res) => {
  const { vendor, reviews, mockOnly } = req.body;
  const ai = getGeminiClient();

  if (!ai || mockOnly) {
    const score = Math.max(88, vendor?.hiddenGemScore || 91);
    return res.json({
      success: true,
      mode: "Mock AI (Fallback)",
      data: {
        stallName: vendor?.stallName || "Unknown South Indian Stall",
        underRatedFactor: "High culinary sentiment score but lower organic tourist footfall indexes.",
        spikeProbability: "82% likelihood of community viral traction within 14 days.",
        sentimentScore: score,
        gemClassification: "Legacy Gastronomic Treasure",
        suggestedCampaign: `Launch 'Indiranagar Local Bites Trail' highlighting their signature craft specialties.`,
        confidence: 0.91
      }
    });
  }

  try {
    const prompt = `Determine if the following food vendor constitutes an authentic 'Hidden Gem' based on review volume, search spikes, and customer satisfaction ratings.
    Vendor Profile: ${JSON.stringify(vendor)}
    Customer Reviews: ${JSON.stringify(reviews)}

    Output model structured in JSON:
    {
      "stallName": "Name of stall",
      "underRatedFactor": "Text describing why they are highly rated but lacks spotlight",
      "spikeProbability": "Percentage string (e.g. 78%)",
      "sentimentScore": number (0-100),
      "gemClassification": "Classification text (e.g. Traditional Master, Modern Innovator)",
      "suggestedCampaign": "Concrete ideas to promote them organically",
      "confidence": number (float from 0.0 to 1.0)
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stallName: { type: Type.STRING },
            underRatedFactor: { type: Type.STRING },
            spikeProbability: { type: Type.STRING },
            sentimentScore: { type: Type.INTEGER },
            gemClassification: { type: Type.STRING },
            suggestedCampaign: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          },
          required: ["stallName", "underRatedFactor", "spikeProbability", "sentimentScore", "gemClassification", "suggestedCampaign", "confidence"]
        }
      }
    });

    res.json({
      success: true,
      mode: "Gemini Live API",
      data: JSON.parse(response.text || "{}")
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------------------------------
// 5. AI SEARCH TREND SUMMARIZATION
// ----------------------------------------------------------------------------
app.post("/api/ai/search-trends", async (req, res) => {
  const { trends, mockOnly } = req.body;
  const ai = getGeminiClient();

  if (!ai || mockOnly) {
    return res.json({
      success: true,
      mode: "Mock AI (Fallback)",
      summary: "High volume spikes (+140% in search index) for pure Sathvik ghee dosas near temple precincts, followed closely by high Indiranagar midnight shawarma food stalls searches.",
      activeFads: [
        "Sathvik Festival Meals (Vanguard demand near ISKCON)",
        "Zero-refined oil street cart modifications",
        "Korean spicy street noodles crossovers in Indiranagar"
      ],
      zoningSuggestion: "Temporarily allocate expanded evening dining bays near West of Chord Road block.",
      confidence: 0.94
    });
  }

  try {
    const prompt = `Summarize and extract consumer intent patterns from these raw city search vectors:
    ${JSON.stringify(trends)}

    Respond in JSON:
    {
      "summary": "Executive summary of what people are craving and where in the city",
      "activeFads": ["fad item 1", "fad item 2"],
      "zoningSuggestion": "Municipal zoning layout suggestions based on these food flows",
      "confidence": number (float from 0.0 to 1.0)
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            activeFads: { type: Type.ARRAY, items: { type: Type.STRING } },
            zoningSuggestion: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          },
          required: ["summary", "activeFads", "zoningSuggestion", "confidence"]
        }
      }
    });

    res.json({
      success: true,
      mode: "Gemini Live API",
      ...JSON.parse(response.text || "{}")
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------------------------------
// 6. AI CONTENT MODERATION (VIDEO & IMAGES)
// ----------------------------------------------------------------------------
app.post("/api/ai/content-moderation", async (req, res) => {
  const { post, mockOnly } = req.body;
  const ai = getGeminiClient();

  if (!ai || mockOnly) {
    const caption = post?.caption || "";
    let status = "Approved";
    let reason = "Post content contains standard street food advocacy and high engagement parameters.";
    
    if (caption.toLowerCase().includes("dirty") || caption.toLowerCase().includes("fight")) {
      status = "Flagged";
      reason = "Potential negative sanitation depiction or dispute detected in natural language comments.";
    }

    return res.json({
      success: true,
      mode: "Mock AI (Fallback)",
      status,
      confidence: 0.96,
      reason,
      safesensors: {
        medical: "Very Low",
        violence: "Very Low",
        unhygienicSigns: status === "Flagged" ? "Medium" : "Very Low"
      }
    });
  }

  try {
    const prompt = `Review the following content platform upload for food safety and policy violations.
    Post caption: "${post?.caption}"
    Publisher: "${post?.author}"
    Category tags: "${post?.category}"

    Report safety and status categorizations.
    Respond in JSON format:
    {
      "status": "Approved" | "Flagged" | "Removed",
      "confidence": number (float 0.0 to 1.0),
      "reason": "Detailed policy justification explaining why it was flagged/approved"
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, description: "Must be 'Approved', 'Flagged', or 'Removed'" },
            confidence: { type: Type.NUMBER },
            reason: { type: Type.STRING }
          },
          required: ["status", "confidence", "reason"]
        }
      }
    });

    res.json({
      success: true,
      mode: "Gemini Live API",
      ...JSON.parse(response.text || "{}")
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------------------------------
// 7. AI ZONE INSIGHTS
// ----------------------------------------------------------------------------
app.post("/api/ai/zone-insights", async (req, res) => {
  const { zone, mockOnly } = req.body;
  const ai = getGeminiClient();

  if (!ai || mockOnly) {
    const isVV = zone?.name?.includes("VV Puram");
    return res.json({
      success: true,
      mode: "Mock AI (Fallback)",
      congestionWarning: isVV ? "High congestion peak observed between 19:30 and 22:00. Recommend double-parking patrol." : "Normal evening street flow.",
      recommendation: isVV ? "Dispatch 2 auxiliary sanitation inspectors to clear public garbage accumulators near the main mosque entry point." : "Schedule routine nightly sweeping crew check-in.",
      safetyIncidentRating: "Excellent (0 active events)",
      forecastDemand: "Stabilized high density",
      confidence: 0.88
    });
  }

  try {
    const prompt = `Act as an urban master planner for Bangalore Food Streets. Evaluate the following zone's telemetry metrics:
    ${JSON.stringify(zone)}

    Give us actionable recommendations for crowd safety, auxiliary sanitary inspectors dispatch, and garbage management.
    Respond in JSON format:
    {
      "congestionWarning": "Crowd alert string",
      "recommendation": "Suggested dispatch action",
      "safetyIncidentRating": "Short assessment of active safety indicators",
      "forecastDemand": "Short demand prognosis",
      "confidence": number (float from 0.0 to 1.0)
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            congestionWarning: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            safetyIncidentRating: { type: Type.STRING },
            forecastDemand: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          },
          required: ["congestionWarning", "recommendation", "safetyIncidentRating", "forecastDemand", "confidence"]
        }
      }
    });

    res.json({
      success: true,
      mode: "Gemini Live API",
      ...JSON.parse(response.text || "{}")
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------------------------------
// 8. AI CUSTOMER COMPLAINT CLASSIFICATION
// ----------------------------------------------------------------------------
app.post("/api/ai/complaint-classification", async (req, res) => {
  const { complaintText, mockOnly } = req.body;
  const ai = getGeminiClient();

  if (!ai || mockOnly) {
    const text = complaintText?.toLowerCase() || "";
    let priority: "Low" | "Medium" | "High" | "Critical" = "Medium";
    let dispatchedUnit = "FSSAI License Desk";
    
    if (text.includes("poisoning") || text.includes("hospital") || text.includes("sick")) {
      priority = "Critical";
      dispatchedUnit = "Sanitary Rapid Action Force (SRAF)";
    } else if (text.includes("hair") || text.includes("dirty") || text.includes("bug")) {
      priority = "High";
      dispatchedUnit = "Local Sanitary & Garbage Inspector";
    }

    return res.json({
      success: true,
      mode: "Mock AI (Fallback)",
      priority,
      issueCategory: priority === "Critical" ? "Severe Contamination Hazard" : "Minor Sanitation Deficit",
      dispatchedUnit,
      automatedResponseDraft: `Officer Dispatch Notice ID: BLR-${Math.floor(Math.random() * 90000) + 10000}. We have received your public dining report. An administrative inspector is being routed to evaluate compliance in the geocell.`,
      confidence: 0.93
    });
  }

  try {
    const prompt = `Analyze the absolute priority and category of the following street food public complaint ticket in Bangalore:
    Candidate Report: "${complaintText}"

    Output priority levels ('Low', 'Medium', 'High', 'Critical') and suggest which action team of municipal guardians to route this incident.
    Respond in JSON format:
    {
      "priority": "Low" | "Medium" | "High" | "Critical",
      "issueCategory": "Brief safety or billing classification",
      "dispatchedUnit": "Recommended field dispatch (e.g. SRAF, Sanitary Crew)",
      "automatedResponseDraft": "Draft a respectful official letter to prompt the customer of immediate actions",
      "confidence": number (float from 0.0 to 1.0)
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority: { type: Type.STRING },
            issueCategory: { type: Type.STRING },
            dispatchedUnit: { type: Type.STRING },
            automatedResponseDraft: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          },
          required: ["priority", "issueCategory", "dispatchedUnit", "automatedResponseDraft", "confidence"]
        }
      }
    });

    res.json({
      success: true,
      mode: "Gemini Live API",
      ...JSON.parse(response.text || "{}")
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------------------------------
// EXPRESS + VITE INTEGRATION MIDDLEWARE
// ----------------------------------------------------------------------------
async function bootstrapServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Food Court AI Admin full-stack server booted on http://0.0.0.0:${PORT}`);
  });
}

bootstrapServer().catch((error) => {
  console.error("Failed to bootstrap Food Court AI server:", error);
});
