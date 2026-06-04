import { useState, useEffect } from "react";
import { ScreenTimeLog, DetoxReport } from "./types";
import LandingHero from "./components/LandingHero";
import TrackerTab from "./components/TrackerTab";
import HistoryDashboard from "./components/HistoryDashboard";
import ReportTab from "./components/ReportTab";
import {
  Smartphone,
  Brain,
  Calendar,
  Sparkles,
  ClipboardList,
  Flame,
  Github,
  Award,
  BookOpen,
  Info
} from "lucide-react";
import { motion } from "motion/react";

// Local storage keys
const LOGS_STORAGE_KEY = "dopamine_detox_logs_v1";
const REPORT_STORAGE_KEY = "dopamine_detox_report_v1";
const GOAL_STORAGE_KEY = "dopamine_detox_goal_v1";

// Rich preset data to help users test things immediately
const PRESET_LOGS: ScreenTimeLog[] = [
  {
    id: "preset-1",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    screenTimeHours: 6,
    screenTimeMinutes: 45,
    unlockCount: 110,
    primaryCategory: "Social Media / Reels",
    notes: "자기 전에 누워서 인스타 릴스를 2시간 연속으로 돌려보며 심연에 빠진 기분이 들었음.",
  },
  {
    id: "preset-2",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    screenTimeHours: 5,
    screenTimeMinutes: 10,
    unlockCount: 88,
    primaryCategory: "YouTube / Shorts",
    notes: "동영상 몇 개만 보려고 켰는데 쇼츠 무한 스와이프로 뇌가 멍해지고 공부 흐름이 완전히 끊김.",
  },
  {
    id: "preset-3",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    screenTimeHours: 4,
    screenTimeMinutes: 20,
    unlockCount: 95,
    primaryCategory: "Productivity / Study",
    notes: "공부 중간에 집중 안 될 때마다 카톡이나 뉴스 기사 탭을 무의식적으로 터치하는 습관 발견.",
  },
  {
    id: "preset-4",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    screenTimeHours: 7,
    screenTimeMinutes: 15,
    unlockCount: 130,
    primaryCategory: "Shopping",
    notes: "무신사랑 쿠팡 최저가 탭을 아무 의미 없이 계속 새로고침하며 킬링타임을 보냈음, 심한 피로감.",
  },
  {
    id: "preset-5",
    date: new Date().toISOString().substring(0, 10),
    screenTimeHours: 4,
    screenTimeMinutes: 50,
    unlockCount: 72,
    primaryCategory: "Social Media / Reels",
    notes: "스크린 타임을 줄여보고자 산책을 시도했으나 걷는 도중에도 스마트폰 확인을 참기 어려웠음.",
  }
];

export default function App() {
  const [logs, setLogs] = useState<ScreenTimeLog[]>([]);
  const [report, setReport] = useState<DetoxReport | null>(null);
  const [targetGoal, setTargetGoal] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"landing" | "tracker" | "dashboard" | "report">("landing");
  
  // Loading & clinical simulation states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState("");

  // Load from local storage
  useEffect(() => {
    try {
      const savedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      }
      const savedReport = localStorage.getItem(REPORT_STORAGE_KEY);
      if (savedReport) {
        setReport(JSON.parse(savedReport));
      }
      const savedGoal = localStorage.getItem(GOAL_STORAGE_KEY);
      if (savedGoal) {
        setTargetGoal(savedGoal);
      }
    } catch (e) {
      console.error("Local storage sync error:", e);
    }
  }, []);

  // Save to local storage on changes
  const updateLogs = (newLogs: ScreenTimeLog[]) => {
    setLogs(newLogs);
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(newLogs));
  };

  const handleAddLog = (newLogData: Omit<ScreenTimeLog, "id">) => {
    const freshLog: ScreenTimeLog = {
      ...newLogData,
      id: "log-" + Date.now(),
    };
    const nextLogs = [freshLog, ...logs];
    updateLogs(nextLogs);
    setActiveTab("dashboard");
  };

  const handleClearLogs = () => {
    if (confirm("정말로 기록된 사용 이력을 전부 초기화하시겠습니까?")) {
      updateLogs([]);
      setReport(null);
      localStorage.removeItem(REPORT_STORAGE_KEY);
    }
  };

  const handleLoadPresets = () => {
    updateLogs(PRESET_LOGS);
    setActiveTab("dashboard");
  };

  const handleUpdateGoal = (val: string) => {
    setTargetGoal(val);
    localStorage.setItem(GOAL_STORAGE_KEY, val);
  };

  // Rule-based high-fidelity fallback when the backend acts out or is hosted statically on purely client Vercel
  const runOfflineAnalysis = (logsSnapshot: ScreenTimeLog[], goalText: string): DetoxReport => {
    let totalMins = 0;
    let totalUnlocks = 0;
    logsSnapshot.forEach(l => {
      totalMins += (l.screenTimeHours * 60) + l.screenTimeMinutes;
      totalUnlocks += l.unlockCount;
    });
    const avgMinutes = totalMins / logsSnapshot.length;
    const avgHoursFloat = avgMinutes / 60;
    const avgUnlocks = totalUnlocks / logsSnapshot.length;

    // Determine dependency score
    let score = 40;
    // Increase for hours
    if (avgHoursFloat > 6) score += 25;
    else if (avgHoursFloat > 4) score += 15;
    else if (avgHoursFloat > 2) score += 5;

    // Increase for unlocks
    if (avgUnlocks > 100) score += 25;
    else if (avgUnlocks > 70) score += 15;
    else if (avgUnlocks > 40) score += 5;

    score = Math.min(score, 98);

    let level = "양호";
    if (score > 60) level = "고위험";
    else if (score > 30) level = "주의";

    return {
      score,
      dependencyLevel: level,
      primaryTrigger: "습관적 공허감 및 지루함 회피",
      customAnalysis: `상담 가이드: 사용자의 일평균 시간인 약 ${Math.floor(avgHoursFloat)}시간 ${Math.round(avgMinutes % 60)}분과 평균 ${Math.round(avgUnlocks)}회의 기기 화면 잠금해제는 뇌에 끊임없는 미세 보상을 불어넣고 있음을 나타냅니다. 특히 긴장을 해소하거나 무료한 찰나의 틈에 무의식적으로 스마트폰을 움켜쥐고 있습니다. 이는 '지루함을 참지 못하는 현대인들의 스마트 전두엽 피로' 패턴에 매우 깊게 상응합니다. 스마트폰을 잠시 내려두고 뇌 신경 물질인 아데노신과 도파민을 이완 단계로 복구하시기를 권장합니다.`,
      healthyReplacements: [
        {
          originalHabit: "소파나 침대에 누워 스마트폰 뒤적거리기",
          alternativeActivity: "침대 주변 스마트폰을 서랍에 가두고 10분간 종이 에세이/소설 읽기",
          dopamineBenefit: "종이 책의 텍스트를 인지하며 전두엽의 느린 문해 회로를 활성화해 고요하고 은은한 느린 만족감을 산출합니다."
        },
        {
          originalHabit: "공부나 학업 집중이 안 될 때 카톡 목록 새로고침하기",
          alternativeActivity: "손가락 지압을 동반하며 창밖 먼 전경을 보며 3분간 심호흡하기",
          dopamineBenefit: "멀리 있는 고정된 물체를 응시함으로써 시각 중추의 긴장을 완화하고 스마트폰 없이도 뇌 속 잡념을 고요하게 해소합니다."
        },
        {
          originalHabit: "밥 먹을 때 쇼츠, 릴스 무의식적으로 켜두기",
          alternativeActivity: "클래식 혹은 조용한 가사 없는 연주곡만을 켜두고 식사 자체의 맛과 향기에 온전히 집중하기",
          dopamineBenefit: "미각을 세밀하게 관장하는 뇌 수용체를 복원하고 감각적 자선 상태를 만들어 식사 후 소화 능력과 만족도를 증대시킵니다."
        }
      ],
      detoxPlan: [
        { phase: "아침 기상 후 30분", action: "폰을 보지 않고 따뜻한 물 한 잔을 마시며 맨손 스트레칭으로 뇌 온도 조절하기", difficulty: "보통" },
        { phase: "일과 및 학업 집중기", action: '스마트폰을 시야 밖으로 차단하고 PC 웹브라우저의 불필요한 SNS 탭 일체 로그아웃 시키기', difficulty: "어려운" },
        { phase: "취침 1시간 전", action: "디지털 기기 전원을 완전 차단하고 방 안 조명을 한 단계 낮춘 뒤 일기장에 손글씨 한 단락 휘갈기기", difficulty: "쉬움" }
      ],
      weeklyChallenge: {
        challengeName: "하루 3번, ‘디지털 숨바꼭질’ 주간 과제",
        instructions: "약속 시간, 엘리베이터 이동 중, 화장실을 갈 때는 스마트폰을 절대로 소지하지 않고 맨손으로 이동하여 '아무 자극도 없는 단순한 영겁의 지루함'을 있는 그대로 뇌에 노출시켜 주는 7일 행동 챌린지입니다."
      }
    };
  };

  const handleTriggerAnalysis = async () => {
    if (logs.length === 0) return;
    setIsAnalyzing(true);

    const steps = [
      "디지털 노출량 정량분석 중...",
      "무의식 스크롤 트리거 정서 모델 분석 중...",
      "행동경제학적 대체 과제 구성 중...",
      "3.5 인지 세라피스트 도파민 종합 진료 보고서 완성 중..."
    ];

    // Simulate animated loading progress for premium feeling
    for (const step of steps) {
      setAnalysisStep(step);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    try {
      const response = await fetch("/api/analyze-detox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logs, targetGoal }),
      });

      if (!response.ok) {
        throw new Error("Server responded with error status");
      }

      const generatedReport = await response.json();
      setReport(generatedReport);
      localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(generatedReport));
      setActiveTab("report");
    } catch (err) {
      console.warn("Backend API error or standalone static environment. Triggering offline expert model fallback...", err);
      // Run fallback rule engine
      const fallbackReport = runOfflineAnalysis(logs, targetGoal);
      setReport(fallbackReport);
      localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(fallbackReport));
      setActiveTab("report");
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep("");
    }
  };

  const handleResetReport = () => {
    setReport(null);
    localStorage.removeItem(REPORT_STORAGE_KEY);
    setActiveTab("tracker");
  };

  return (
    <div className="min-h-screen bg-[#fbfcfe] flex flex-col selection:bg-teal-100 selection:text-teal-900">
      {/* Dynamic Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div
            onClick={() => setActiveTab("landing")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-600/10 group-hover:scale-105 transition-all">
              <Brain className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="font-display font-extrabold text-sm md:text-base text-gray-900 tracking-tight block">
                Digital Dopamine Detox
              </span>
              <span className="text-[10px] text-gray-400 block tracking-normal">
                당신의 고요한 일상 리포트 및 지연 보상 촉진기
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-100 rounded-full text-[10px] text-amber-800 font-semibold leading-none">
              <Flame className="w-3 h-3 text-amber-600 fill-amber-500 animate-pulse" />
              <span>디톡스 이행도 {logs.length > 0 ? "실행 중" : "준비"}</span>
            </span>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-150"
              title="Vercel 및 GitHub 호환 완비"
            >
              <Github className="w-4.5 h-4.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Header Tab Guide */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 flex overflow-x-auto gap-4 md:gap-8 scrollbar-none">
          <button
            onClick={() => setActiveTab("landing")}
            className={`py-4 px-1 text-xs md:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === "landing"
                ? "border-teal-600 text-teal-600 font-bold"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <Info className="w-4 h-4" />
            <span>디톡스란? (가이던스)</span>
          </button>

          <button
            onClick={() => setActiveTab("tracker")}
            className={`py-4 px-1 text-xs md:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === "tracker"
                ? "border-teal-600 text-teal-600 font-bold"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>스마트폰 사용 기록지</span>
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`py-4 px-1 text-xs md:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === "dashboard"
                ? "border-teal-600 text-teal-600 font-bold"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>사용 분석판 ({logs.length}개 이력)</span>
          </button>

          {report && (
            <button
              onClick={() => setActiveTab("report")}
              className={`py-4 px-1 text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer text-teal-700 flex items-center gap-1.5 animate-pulse ${
                activeTab === "report"
                  ? "border-teal-600 text-teal-600 font-bold"
                  : "border-transparent"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>✨ 3.5 AI 최종진료서</span>
            </button>
          )}
        </div>
      </div>

      {/* Target Goal Banner */}
      {activeTab !== "landing" && (
        <div className="bg-teal-50/50 border-b border-teal-100/30 py-3">
          <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-teal-800">
              <span className="p-1 bg-teal-100 rounded text-teal-800 font-bold">도파민 선언</span>
              <span className="font-semibold">스마트폰을 극복하기 위해 다짐할 나의 단 하나의 수칙:</span>
            </div>
            
            <div className="flex-1 max-w-lg">
              <input
                type="text"
                placeholder="예: 밤 11시 이후 폰 안방 충전기에 두고 자러가기, 대중교통에서 스마트폰 대신 종이책 읽기"
                value={targetGoal}
                onChange={(e) => handleUpdateGoal(e.target.value)}
                className="w-full px-3 py-1 bg-white border border-teal-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500/20 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow pb-24">
        {isAnalyzing && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl border border-gray-100">
              <div className="relative w-20 h-20 mx-auto">
                {/* Custom animated double-ring progress loader */}
                <div className="absolute inset-0 rounded-full border-4 border-teal-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-teal-600 border-t-transparent animate-spin"></div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 text-base font-display">의학적 자가 분석 실행 중</h4>
                <p className="text-xs text-teal-600 font-semibold font-mono animate-pulse">{analysisStep}</p>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                인공지능 상담 어시스턴트 3.5가 수집된 스마트폰 사용 통계를 확인하여, 도파민 수용체를 치유할 행동학적 맞춤 방안을 고안 중입니다. 잠시만 기다려 주세요...
              </p>
            </div>
          </div>
        )}

        {activeTab === "landing" && (
          <LandingHero onStartTracking={() => setActiveTab("tracker")} />
        )}

        {activeTab === "tracker" && (
          <TrackerTab
            logs={logs}
            onAddLog={handleAddLog}
            onClearLogs={handleClearLogs}
            onLoadPresets={handleLoadPresets}
          />
        )}

        {activeTab === "dashboard" && (
          <HistoryDashboard
            logs={logs}
            onTriggerAnalysis={handleTriggerAnalysis}
            isAnalyzing={isAnalyzing}
          />
        )}

        {activeTab === "report" && report && (
          <ReportTab
            report={report}
            onReset={handleResetReport}
            targetGoal={targetGoal}
          />
        )}
      </main>

      {/* Vercel Guidance Footer in Case of static hosting */}
      <footer className="bg-gray-900 text-gray-100 border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-teal-400 rounded-full animate-ping"></span>
                <span className="text-sm font-bold text-teal-300 font-display">Vercel & GitHub 배포 완벽 지원</span>
              </div>
              <p className="text-xs text-gray-400 max-w-xl">
                이 저장소는 Vercel Static Hosting (즉 SPA 모드)과 Node.js Cloud Run 모두와 완벽하게 호환하도록 정량식 하이브리드 로직으로 설계되었습니다. Vercel에서 즉석 배포하는 것만으로도 오프라인 심성 분석 처방 모델이 실시간 탑재 및 이행됩니다.
              </p>
            </div>

            <div className="flex gap-4">
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-white transition-all cursor-pointer border border-gray-700"
              >
                Vercel로 배포하기
              </a>
              <button
                onClick={handleLoadPresets}
                id="btn-footer-preset"
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-xs font-bold text-slate-950 rounded-lg transition-all cursor-pointer"
              >
                가상 데이터로 시작해보기
              </button>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between text-[11px] text-gray-500 gap-4">
            <span>© 2026 Digital Dopamine Detox & Wellness. All rights reserved.</span>
            <div className="flex gap-4">
              <span>개인 기기 로컬 스토리지에 한해 데이터 보호 및 보장</span>
              <span>-</span>
              <span>3.5 AI Wellness Practitioner</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
