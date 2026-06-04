import { motion } from "motion/react";
import { Sparkles, Brain, Clock, ShieldCheck, HeartPulse, ArrowRight } from "lucide-react";

interface LandingHeroProps {
  onStartTracking: () => void;
}

export default function LandingHero({ onStartTracking }: LandingHeroProps) {
  return (
    <section className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-100/50 rounded-full text-teal-700 text-xs font-semibold backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>도파민 수용체 재조정 프로젝트</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 font-display leading-[1.12]"
        >
          스마트폰 무한 스크롤 뒤에 숨겨진 <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600">
            진짜 일상을 되찾을 시간
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-sans"
        >
          릴스, 쇼츠, SNS 알림은 쾌락 호르몬인 도파민의 급격한 서지를 부릅니다.<br />
          그로 인해 평화롭던 일상의 독서, 집중력, 사색은 영문도 모른 채 지루하게 느껴집니다.<br />
          스마트폰 패턴을 기록하고, 3.5 AI의 처방을 통해 건강한 <strong>느린 도파민</strong>으로 뇌를 회복시키세요.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-4 flex flex-wrap justify-center gap-4"
        >
          <button
            onClick={onStartTracking}
            id="btn-hero-start"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl shadow-lg shadow-teal-600/15 transition-all flex items-center gap-2 group cursor-pointer"
          >
            <span>디톡스 시작하기 (기록&분석)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#science"
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all flex items-center justify-center cursor-pointer"
          >
            기능 및 과학적 배경 알아보기
          </a>
        </motion.div>
      </div>

      {/* Grid Features */}
      <div id="science" className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-gray-100">
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 bg-white rounded-2xl border border-gray-100 glow-teal hover:border-teal-100 transition-all space-y-4"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 font-display">빠른 도파민 vs 느린 도파민</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            자극적인 쇼츠, 릴스는 즉각적인 보상으로 뇌를 중독시킵니다. 일기 쓰기, 명상, 숲길 걷기는 지연된 보상을 가진 '느린 도파민'으로, 주의 집중력과 의지력을 강화합니다.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 bg-white rounded-2xl border border-gray-100 glow-teal hover:border-teal-100 transition-all space-y-4"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 font-display">일일 사용량 및 잠금 해제 기록</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            전혀 인지하지 못했던 하루 스크린 시간과 무의식적인 잠금 해제 횟수를 정밀 수집합니다. 정량화된 지표는 중독 상태를 인지하는 첫걸음입니다.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 bg-white rounded-2xl border border-gray-100 glow-teal hover:border-teal-100 transition-all space-y-4"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 font-display">3.5 AI 심리학자의 밀착 진단</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            나의 스마트폰 사용 이력과 감정 기록을 분석해, 무의식적으로 스크롤을 내리는 마인드 트리거를 식별하고, 나만을 위한 3가지 도파민 대체 행동을 구성해 줍니다.
          </p>
        </motion.div>
      </div>

      {/* Info Banner */}
      <div className="mt-12 p-8 bg-gradient-to-r from-gray-900 to-slate-900 text-white rounded-3xl relative overflow-hidden shadow-xl shadow-slate-900/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/10 rounded-full text-xs font-medium text-teal-300">
              <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
              <span>자가 검증 상식</span>
            </div>
            <h4 className="text-xl font-bold font-display">"스마트폰을 보고 난 후 더 피곤하시죠?"</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              도파민이 소모되면 뇌 속 아데노신 농도가 높아져 강한 브레인 포그와 만성 무기력함을 느끼게 됩니다. 뇌 수용체를 잠시 잠재우고 일요일 단 하루만큼은 아날로그로 채우는 플래너 이행 가이드를 활용해 보세요.
            </p>
          </div>
          <button
            onClick={onStartTracking}
            id="btn-hero-action"
            className="px-5 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl transition-all shrink-0 cursor-pointer text-xs"
          >
            지금 자가 진단지 수집하기
          </button>
        </div>
      </div>
    </section>
  );
}
