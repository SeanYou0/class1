import { ScreenTimeLog } from "../types";
import { Clock, Fingerprint, CalendarDays, BarChart4, AlertCircle, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface HistoryDashboardProps {
  logs: ScreenTimeLog[];
  onTriggerAnalysis: () => void;
  isAnalyzing: boolean;
}

export default function HistoryDashboard({ logs, onTriggerAnalysis, isAnalyzing }: HistoryDashboardProps) {
  if (logs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mx-auto"
        >
          <Clock className="w-8 h-8" />
        </motion.div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 font-display">수집된 도파민 지표가 없습니다</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            아래에 사용자의 하루 동안의 스마트폰 보상 패턴을 적어보세요. 혹은 오른쪽 측면의 과거 5일 가상 백업 데이터를 로드할 수도 있습니다.
          </p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalLogs = logs.length;
  let totalMinutes = 0;
  let totalUnlocks = 0;
  const categoriesMap: Record<string, number> = {};

  logs.forEach((log) => {
    totalMinutes += log.screenTimeHours * 60 + log.screenTimeMinutes;
    totalUnlocks += log.unlockCount;
    categoriesMap[log.primaryCategory] = (categoriesMap[log.primaryCategory] || 0) + 1;
  });

  const avgMinutesPerDay = totalMinutes / totalLogs;
  const avgHours = Math.floor(avgMinutesPerDay / 60);
  const avgMins = Math.round(avgMinutesPerDay % 60);

  const avgUnlocks = Math.round(totalUnlocks / totalLogs);

  // Find most frequent app category
  let topCategory = "N/A";
  let maxCount = 0;
  Object.entries(categoriesMap).forEach(([cat, reqCount]) => {
    if (reqCount > maxCount) {
      maxCount = reqCount;
      topCategory = cat;
    }
  });

  // Short label mapper for Korean display
  const getCategoryLabel = (categoryVal: string): string => {
    switch (categoryVal) {
      case "Social Media / Reels":
        return "SNS & 릴스";
      case "YouTube / Shorts":
        return "유튜브 & 쇼츠";
      case "Mobile Games":
        return "모바일 게임";
      case "Shopping":
        return "온라인 쇼핑";
      case "Webtoon / Novel":
        return "웹툰 & 웹소설";
      case "Productivity / Study":
        return "업무 & 학업";
      default:
        return "기타 스크롤";
    }
  };

  // Sort logs by date to render timeline chart
  const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date));

  // Determine max screen minutes to scale custom SVG bar chart
  const maxLogMinutes = Math.max(
    ...logs.map((l) => l.screenTimeHours * 60 + l.screenTimeMinutes),
    120 // minimum limit for aesthetic scaling
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* High Level Cards */}
      <h2 className="text-xl font-bold font-display text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
        <BarChart4 className="w-5 h-5 text-teal-600" />
        <span>스마트폰 사용 패턴 분석 대시보드</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Average Screen Time */}
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-teal-50 text-teal-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium">일평균 스크린 타임</span>
            <div className="text-lg font-bold font-display text-gray-900">
              {avgHours > 0 ? `${avgHours}시간 ` : ""}{avgMins}분
            </div>
            <div className="text-[10px] text-gray-400">기준 일수: {totalLogs}일</div>
          </div>
        </div>

        {/* Card 2: Unlocks */}
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium font-display">일평균 잠금해제 횟수</span>
            <div className="text-lg font-bold text-gray-900 font-mono">하루 {avgUnlocks}회</div>
            <div className="text-[11px] text-indigo-600 font-semibold font-sans">
              약 {Math.round(avgUnlocks / 16)}번에 한 번씩 폰 확인
            </div>
          </div>
        </div>

        {/* Card 3: Top Category */}
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium">주요 중독 도파민 경로</span>
            <div className="text-sm font-bold text-gray-900 truncate max-w-[150px]">
              {getCategoryLabel(topCategory)}
            </div>
            <p className="text-[10px] text-gray-400 font-sans">가장 높은 노출 활성 빈도</p>
          </div>
        </div>

        {/* Card 4: Action card */}
        <div className="p-5 bg-teal-900 text-white rounded-2xl flex flex-col justify-between shadow-md">
          <div className="space-y-1">
            <span className="text-[10px] text-teal-300 font-semibold tracking-wider font-display">DOPAMINE CLINIC</span>
            <h4 className="text-[13px] font-bold">임상 분석 보고서 준비완료</h4>
          </div>
          <button
            onClick={onTriggerAnalysis}
            disabled={isAnalyzing}
            id="btn-trigger-analysis"
            className="w-full mt-3 py-2 bg-teal-400 hover:bg-teal-300 disabled:bg-teal-800 disabled:text-teal-500 text-teal-980 font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAnalyzing ? "AI 진단 생성 중..." : "AI 디톡스 처방 요청"}</span>
          </button>
        </div>
      </div>

      {/* SVG Custom Interactive Chart */}
      <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-gray-900">스크린 시간 변화 추이</h3>
            <p className="text-xs text-gray-400">수집된 일자별 스마트폰 실사용 시간 추적 차트</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-gray-500">
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-teal-500 rounded-sm"></span> 사용시간 (분)
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm"></span> 잠금해제 횟수
            </span>
          </div>
        </div>

        {/* SVG Render */}
        <div className="relative pt-4">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px] h-60 flex items-end gap-12 pb-5 pt-8 border-b border-gray-100 px-4">
              {sortedLogs.map((log, index) => {
                const currentMinutes = log.screenTimeHours * 60 + log.screenTimeMinutes;
                const barHeightPct = (currentMinutes / maxLogMinutes) * 100;
                // Scale unlock count to visual max height (150 is typical max unlocks)
                const lineProgressHeight = (Math.min(log.unlockCount, 150) / 150) * 160;

                return (
                  <div key={log.id} className="flex-1 flex flex-col items-center group relative">
                    {/* Floating Info Tooltip */}
                    <div className="absolute -top-12 bg-gray-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-lg">
                      <div className="font-semibold text-teal-300">스크린: {log.screenTimeHours}시간 {log.screenTimeMinutes}분</div>
                      <div className="font-medium text-slate-300">잠금: {log.unlockCount}회 ({getCategoryLabel(log.primaryCategory)})</div>
                    </div>

                    {/* Bars stacked */}
                    <div className="w-full flex justify-center gap-1.5 h-36 items-end">
                      {/* Hours Bar */}
                      <div
                        className="w-4 bg-teal-500 group-hover:bg-teal-600 rounded-t transition-all duration-500"
                        style={{ height: `${Math.max(5, barHeightPct)}%` }}
                      ></div>
                      {/* Unlocks visual bar */}
                      <div
                        className="w-1.5 bg-indigo-400 group-hover:bg-indigo-500 rounded-t transition-all duration-500"
                        style={{ height: `${Math.max(5, (log.unlockCount / 150) * 100)}%` }}
                      ></div>
                    </div>

                    <div className="w-full text-center mt-3 space-y-1">
                      <span className="block text-[11px] font-semibold text-gray-700 font-mono">
                        {log.date.substring(5)}
                      </span>
                      <span className="block text-[10px] text-gray-400 truncate max-w-[90px]">
                        {getCategoryLabel(log.primaryCategory)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Log list */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-gray-900 font-display">타임라인 상세 기록</h3>
        <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl bg-white overflow-hidden shadow-sm">
          {sortedLogs.map((log) => (
            <div key={log.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl font-mono text-center shrink-0">
                  <CalendarDays className="w-4 h-4 text-gray-500 mb-0.5 mx-auto" />
                  <span className="block text-[11px] font-bold text-gray-900">{log.date.substring(5)}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-teal-50 text-teal-700 rounded border border-teal-100/30">
                      {getCategoryLabel(log.primaryCategory)}
                    </span>
                    <span className="text-[11px] text-gray-400">{log.date}</span>
                  </div>
                  {log.notes ? (
                    <p className="text-xs text-gray-600 italic font-sans">
                      &ldquo;{log.notes}&rdquo;
                    </p>
                  ) : (
                    <span className="text-[11px] text-gray-300 font-sans">마음가짐 기록 없음</span>
                  )}
                </div>
              </div>

              {/* Stats values */}
              <div className="flex items-center gap-6 shrink-0 text-right">
                <div className="space-y-0.5">
                  <div className="text-[10px] text-gray-400 font-medium">스크린 지표</div>
                  <div className="text-xs font-bold text-gray-800">
                    {log.screenTimeHours}시간 {log.screenTimeMinutes}분
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-[10px] text-gray-400 font-medium">잠금해제</div>
                  <div className="text-xs font-bold text-indigo-700 font-mono">
                    {log.unlockCount}회
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
