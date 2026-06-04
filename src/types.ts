export interface ScreenTimeLog {
  id: string;
  date: string;
  screenTimeHours: number;
  screenTimeMinutes: number;
  unlockCount: number;
  primaryCategory: string; // Social, Short-form, Game, Work, Shopping, Other
  notes: string; // feelings or triggers
}

export interface HealthyReplacement {
  originalHabit: string;
  alternativeActivity: string;
  dopamineBenefit: string;
}

export interface DetoxPlanItem {
  phase: string;
  action: string;
  difficulty: "쉬움" | "보통" | "어려움" | string;
}

export interface WeeklyChallenge {
  challengeName: string;
  instructions: string;
}

export interface DetoxReport {
  score: number; // 0 (good) to 100 (high dependency)
  dependencyLevel: "양호" | "주의" | "고위험" | string;
  primaryTrigger: string;
  customAnalysis: string;
  healthyReplacements: HealthyReplacement[];
  detoxPlan: DetoxPlanItem[];
  weeklyChallenge: WeeklyChallenge;
}
