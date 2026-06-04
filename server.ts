import express, { Request, Response } from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Full-stack API endpoint for Digital Dopamine Detox Analysis
app.post("/api/analyze-detox", async (req: Request, res: Response): Promise<void> => {
  try {
    const { logs, targetGoal } = req.body;

    if (!logs || !Array.isArray(logs) || logs.length === 0) {
      res.status(400).json({ error: "Smartphone usage logs must be provided as a non-empty array." });
      return;
    }

    const logPrompt = logs
      .map(
        (log, idx) =>
          `Day ${idx + 1}: Date=${log.date}, Active Screen Time=${log.screenTimeHours}h ${
            log.screenTimeMinutes
          }m, Unlock count=${log.unlockCount || 0}, Primary App Category=${
            log.primaryCategory || "Unspecified"
          }, Notes/Feeling=${log.notes || "None"}`
      )
      .join("\n");

    const goalPrompt = targetGoal
      ? `Their detox goals are: ${targetGoal}`
      : "No specific goal specified, provide standard digital detox targets.";

    const prompt = `Analyze the smartphone usage logs and goals of a user aiming for a digital dopamine detox.
Usage logs:
${logPrompt}

${goalPrompt}

Based on these details, calculate a psychological smartphone dependency score (0–100, where 100 means extremely high dependent on quick dopamine triggers, 0 means perfectly controlled screen time). Provide insightful, warm, and highly expert Korean recommendations, structural detox milestones, customized alternative behavior loops that replace toxic quick dopamine habits with peaceful slow dopamine activities, and a weekly micro-challenge.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert clinical psychologist and digital wellness consultant. You specialize in dopamine detox (도파민 디톡스), habit remodeling, and mindfulness. Your tone is supportive, precise, professional, and warmly encouraging. Always answer in Korean.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "Dopamine dependency score from 0 (perfect wellness) to 100 (extreme addiction). Give a realistic rating based on hours and unlock counts.",
            },
            dependencyLevel: {
              type: Type.STRING,
              description: "Dependency level category: '양호' (0-30), '주의' (31-60), '고위험' (61-100)",
            },
            primaryTrigger: {
              type: Type.STRING,
              description: "The main psychological or situational trigger for screen unlock behaviour identified from their notes (e.g. 무료함, 습관적 숏폼, 불안감 회피, 업무적 필요)",
            },
            customAnalysis: {
              type: Type.STRING,
              description: "A warm, deep, empathetic 3-4 sentence psychological feedback detailing their scrolling behaviour habits, why they fall into dopamine traps, and validating their wellness path. In Korean.",
            },
            healthyReplacements: {
              type: Type.ARRAY,
              description: "Exactly 3 alternative healthy activities that the user can immediately engage in instead of reaching for their smartphone for instant gratification (instant dopamine vs slow dopamine).",
              items: {
                type: Type.OBJECT,
                properties: {
                  originalHabit: {
                    type: Type.STRING,
                    description: "The digital habit targeted to substitute (e.g. 침대에 누워 인스타 보기)",
                  },
                  alternativeActivity: {
                    type: Type.STRING,
                    description: "A concrete offline alternative action (e.g. 가벼운 일기 작성하기 및 따뜻한 물 한잔 마시기)",
                  },
                  dopamineBenefit: {
                    type: Type.STRING,
                    description: "Why this activity is a healthy slow dopamine generator (Korean).",
                  },
                },
                required: ["originalHabit", "alternativeActivity", "dopamineBenefit"],
              },
            },
            detoxPlan: {
              type: Type.ARRAY,
              description: "A customized 3-part plan segmented by day parts (e.g., 오전, 오후, 취침 전) to help them decouple from their smartphone.",
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: {
                    type: Type.STRING,
                    description: "Time of day (e.g. '아침 기상 후 1시간', '일과 중 집중 시간', '취침 전 2시간')",
                  },
                  action: {
                    type: Type.STRING,
                    description: "A actionable realistic task for that phase (Korean).",
                  },
                  difficulty: {
                    type: Type.STRING,
                    description: "Difficulty: '쉬움', '보통', '어려움'",
                  },
                },
                required: ["phase", "action", "difficulty"],
              },
            },
            weeklyChallenge: {
              type: Type.OBJECT,
              description: "One weekly challenge tailored to break their dependency.",
              properties: {
                challengeName: {
                  type: Type.STRING,
                  description: "A catch, motivating title for the challenge to gamify detoxicating.",
                },
                instructions: {
                  type: Type.STRING,
                  description: "Step by step guidance on how to carry out the challenge over 7 days in Korean.",
                },
              },
              required: ["challengeName", "instructions"],
            },
          },
          required: [
            "score",
            "dependencyLevel",
            "primaryTrigger",
            "customAnalysis",
            "healthyReplacements",
            "detoxPlan",
            "weeklyChallenge",
          ],
        },
      },
    });

    const reportText = response.text || "{}";
    const reportData = JSON.parse(reportText.trim());

    res.json(reportData);
  } catch (error: any) {
    console.error("Detox analysis failed:", error);
    res.status(500).json({
      error: "도파민 디톡스 분석 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.",
      details: error.message,
    });
  }
});

// Vite server setup or production bundle serve
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
