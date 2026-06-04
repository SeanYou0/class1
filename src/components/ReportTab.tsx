import { DetoxReport } from "../types";
import {
  Award,
  Calendar,
  Frown,
  Activity,
  CheckCircle,
  TrendingDown,
  RotateCcw,
  Sparkles,
  Zap,
  Coffee,
  Sunset,
  ArrowRight,
  Heart
} from "lucide-react";
import { motion } from "motion/react";

interface ReportTabProps {
  report: DetoxReport;
  onReset: () => void;
  targetGoal: string;
}

export default function ReportTab({ report, onReset, targetGoal }: ReportTabProps) {
  // Determine color matching dependency level
  const getBadgeColor = (level: string) => {
    switch (level) {
      case "양호":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "주의":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  const getScoreColorClass = (score: number) => {
    if (score <= 30) return "text-emerald-500 stroke-emerald-500";
    if (score <= 60) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  // Convert score to angle for custom half-gauge
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (report.score / 100) * circumference;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Reset upper action button */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-teal-600 tracking-wider uppercase font-display">Analysis Report</span>
          <h2 className="text-2xl font-bold font-display text-gray-900">당신의 도파민 수용체 진료서</h2>
        </div>
        <button
          onClick={onReset}
          id="btn-report-reset"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>다시 기록하기</span>
        </button>
      </div>

      {/* Main Grid Score and Core Overview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Gauge card */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl"></div>
          
          <h3 className="text-xs font-semibold text-gray-400 mb-4 font-display">도파민 의존 수치</h3>
          
          <div className="relative flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              {/* Center Background Gray Circle */}
              <circle
                className="stroke-gray-100"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              {/* Accent Animated Arc */}
              <motion.circle
                className={getScoreColorClass(report.score)}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + " " + circumference}
                style={{ strokeDashoffset }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold font-display text-gray-900">{report.score}</span>
              <span className="text-[10px] text-gray-400">/ 100</span>
            </div>
          </div>

          <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${getBadgeColor(report.dependencyLevel)}`}>
            <Activity className="w-3.5 h-3.5" />
            <span>상해 및 의존도: {report.dependencyLevel}</span>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 w-full text-center">
            <span className="text-[10px] block text-gray-400 mb-1">인식된 잠정적 중독 원인</span>
            <span className="text-xs font-bold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg inline-block">
              ⚠️ {report.primaryTrigger || "습관성 무의식 스크롤"}
            </span>
          </div>
        </div>

        {/* Psychological Insight Content Card */}
        <div className="md:col-span-8 bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-teal-50 rounded-lg text-teal-600">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </span>
              <h4 className="font-bold text-gray-900 font-display text-sm">3.5 AI 임상 심리 분석 상담</h4>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed font-sans">
              {report.customAnalysis}
            </p>

            {targetGoal && (
              <div className="p-4 bg-teal-50/40 rounded-xl border border-teal-100/30">
                <span className="text-[10px] block font-bold text-teal-800 mb-1">나의 디톡스 각오 & 목표 이행 상태</span>
                <span className="text-xs text-gray-700 italic">
                  &ldquo;{targetGoal}&rdquo;
                </span>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-100 mt-6 flex flex-wrap gap-4 text-[11px] text-gray-400">
            <span>🩺 담당 검수 AI: 웰니스 전문 디지털 어시스턴트 3.5</span>
            <span>📅 발급 시간: 방금 전 실시간 산출</span>
          </div>
        </div>
      </div>

      {/* Alternative Slow Dopamine Behavior Replacement Grid */}
      <div className="space-y-4">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-gray-900 font-display">💡 빠른 도파민을 대체할 느린 보상 활동 (우선순위 3)</h3>
          <p className="text-xs text-gray-400">자극적 자판기 역할을 하던 스마트폰 습관을 평화롭고 성취감 넘치는 힐링 활동으로 개조합니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {report.healthyReplacements.map((rem, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -3 }}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-slate-50 flex items-center justify-center text-xs font-bold text-gray-400 rounded-bl-xl">
                0{idx + 1}
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider flex items-center gap-1">
                    <Frown className="w-3 h-3" /> 탈피할 루틴
                  </span>
                  <p className="text-xs font-semibold text-gray-500 line-through decoration-rose-200">
                    {rem.originalHabit}
                  </p>
                </div>

                <div className="text-teal-500 my-1 justify-center flex">
                  <ArrowRight className="w-4 h-4 transform rotate-90 md:rotate-0" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> 건강한 느린 도파민 대체 행동
                  </span>
                  <p className="text-sm font-bold text-gray-900 leading-snug">
                    {rem.alternativeActivity}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-50 text-[11px] text-gray-500 font-sans flex items-start gap-1">
                <Heart className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                <span>{rem.dopamineBenefit}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Segmented Phase Actions Plan */}
      <div className="space-y-4">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-gray-900 font-display">📅 스마트폰 거리두기 일일 3단계 실천 로드맵</h3>
          <p className="text-xs text-gray-400">지속 가능한 절제 라이프를 위한 오전/오후/취침 시간대 행동 제어 가이드</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 divide-y divide-gray-100 shadow-sm">
          {report.detoxPlan.map((step, idx) => (
            <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="px-2.5 py-1.5 bg-slate-50 border border-gray-150 rounded-xl text-center shrink-0">
                  <span className="block text-xs font-bold text-gray-700">{step.phase}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-800 leading-snug">{step.action}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-gray-400">난이도</span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  step.difficulty === "쉬움" 
                    ? "bg-emerald-50 text-emerald-700" 
                    : step.difficulty === "보통"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-rose-50 text-rose-700"
                }`}>
                  {step.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly gamified Challenge Card */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-indigo-950 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl shadow-teal-900/10">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-teal-300">
            <Award className="w-4 h-4" />
            <span>이주의 특별 과제 수행</span>
          </div>

          <div className="space-y-2">
            <h4 className="text-xl md:text-2xl font-extrabold text-white font-display">
              🏆 {report.weeklyChallenge.challengeName}
            </h4>
            <p className="text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
              {report.weeklyChallenge.instructions}
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 text-xs text-teal-200/80 font-sans flex items-center gap-2">
            <Zap className="w-4 h-4 animate-bounce" />
            <span>팁: 일주일 이행 후, 성공한 날마다 다이어리나 캘린더에 별표를 남기는 것만으로 느린 성취 도파민 뇌 회로가 완공됩니다!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
