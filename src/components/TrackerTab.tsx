import React, { useState } from "react";
import { ScreenTimeLog } from "../types";
import { Plus, Smartphone, Clock, Fingerprint, Sparkles, Smile, Trash2 } from "lucide-react";
import { motion } from "motion/react";

interface TrackerTabProps {
  logs: ScreenTimeLog[];
  onAddLog: (log: Omit<ScreenTimeLog, "id">) => void;
  onClearLogs: () => void;
  onLoadPresets: () => void;
}

const APP_CATEGORIES = [
  { value: "Social Media / Reels", label: "SNS & 인스타그램 (릴스/스레드)" },
  { value: "YouTube / Shorts", label: "유튜브 (쇼츠/동영상)" },
  { value: "Mobile Games", label: "모바일 게임" },
  { value: "Shopping", label: "쇼핑 앱 (쿠팡/무신사)" },
  { value: "Webtoon / Novel", label: "웹툰 & 웹소설" },
  { value: "Productivity / Study", label: "업무 & 학업 도구" },
  { value: "Other", label: "기타 무작위 브라우징" },
];

export default function TrackerTab({ logs, onAddLog, onClearLogs, onLoadPresets }: TrackerTabProps) {
  const [date, setDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [hours, setHours] = useState<number>(3);
  const [minutes, setMinutes] = useState<number>(30);
  const [unlocks, setUnlocks] = useState<number>(55);
  const [category, setCategory] = useState<string>("Social Media / Reels");
  const [notes, setNotes] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hours < 0 || hours > 24 || minutes < 0 || minutes > 59) {
      alert("올바른 시간을 입력해 주세요.");
      return;
    }

    onAddLog({
      date,
      screenTimeHours: hours,
      screenTimeMinutes: minutes,
      unlockCount: unlocks,
      primaryCategory: category,
      notes: notes.trim(),
    });

    // Reset some states
    setNotes("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto px-4 py-8">
      {/* Logger form - Left side */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 font-display">
            <Smartphone className="w-5 h-5 text-teal-600" />
            <span>오늘 스마트폰 사용 기록하기</span>
          </h2>
          <p className="text-xs text-gray-400">
            하루 동안 사용한 시간과 감정적 트리거를 간직하여 디톡스 상태를 정량화합니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">기록 날짜</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">가장 많이 사용한 앱 분야</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              >
                {APP_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>스크린 시간 (시간)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="24"
                  required
                  value={hours}
                  onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
                <span className="text-xs text-gray-500 shrink-0">시간</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>스크린 시간 (분)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="59"
                  required
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
                <span className="text-xs text-gray-500 shrink-0">분</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
              <Fingerprint className="w-3.5 h-3.5 text-gray-400" />
              <span>화면 잠금해제 횟수</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max="150"
                value={unlocks}
                onChange={(e) => setUnlocks(parseInt(e.target.value))}
                className="w-full h-2 bg-teal-50 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <span className="w-16 text-center font-mono text-sm font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded-lg shrink-0">
                {unlocks}회
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
              <Smile className="w-3.5 h-3.5 text-gray-400" />
              <span>사용 중 심리 상태 / 마음가짐 기록</span>
            </label>
            <textarea
              placeholder="예: 릴스 무한 루프 도중 심한 공허감을 느낌, 침대 누워서 잠들기 전 1시간 동안 아무 생각 없이 슬라이드함, 공부하다 집중이 흐려져서 무의식적으로 켬"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-gray-300 resize-none"
            />
          </div>

          <button
            type="submit"
            id="btn-log-submit"
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl shadow-lg shadow-teal-600/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>오늘의 사용량 등록하기</span>
          </button>
        </form>
      </div>

      {/* Preset helpers - Right side */}
      <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-teal-50/20 border border-slate-100 rounded-2xl p-6 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-teal-800 font-semibold text-sm font-display">
            <Sparkles className="w-4.5 h-4.5 text-teal-600 animate-spin-slow" />
            <span>임시 데이터 도우미</span>
          </div>

          <h3 className="text-base font-bold text-gray-900">자가진단을 위한 과거 기록 준비</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            아직 누적된 스마트폰 일일 사용 기록이 없으시다면, 이 가상 프리셋 등록 시스템을 이용해 인지적 과부하 상태의 가상 5일치 로그를 로드해 보세요.<br />
            AI가 피드백을 통해 뇌 수용체 마인드 분석 보고서를 실시간으로 도출해 냅니다.
          </p>

          <div className="p-4 bg-white/70 border border-teal-100/50 rounded-xl text-[11px] text-teal-800 space-y-1.5 font-mono">
            <div>💡 <strong>프리셋 이력 내용 (예제):</strong></div>
            <div>• 슬라이드 시간: 평균 4~6시간</div>
            <div>• 주 사용 앱: SNS 쇼츠 및 가벼운 스크롤</div>
            <div>• 잠금해제: 빈번함 (하루 90회 이상)</div>
            <div>• 감정 상태: 피로감, 외로움, 미루는 습관 등</div>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <button
            onClick={onLoadPresets}
            id="btn-load-presets"
            className="w-full py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-teal-700 text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            📊 가상 5일치 데이터 로드하기
          </button>

          {logs.length > 0 && (
            <button
              onClick={onClearLogs}
              id="btn-clear-logs"
              className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>전체 스마트폰 기록 초기화</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
