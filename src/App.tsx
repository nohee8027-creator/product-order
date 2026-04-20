/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Sparkles, Heart, Trophy, Zap, BarChart3, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { LOTTO_HISTORICAL_FREQUENCY, getFrequency } from './data/lottoStats';

type LottoSet = number[];

export default function App() {
  const [lottoSets, setLottoSets] = useState<LottoSet[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showStats, setShowStats] = useState(false);

  // Calculate top 10 most frequent numbers for the chart
  const topNumbersData = useMemo(() => {
    return Object.entries(LOTTO_HISTORICAL_FREQUENCY)
      .map(([num, freq]) => ({ number: parseInt(num), frequency: freq }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);
  }, []);

  const triggerConfetti = () => {
    const end = Date.now() + 2 * 1000;
    const colors = ['#6366f1', '#f43f5e', '#fbbf24', '#10b981'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const generateLottoNumbers = useCallback(async () => {
    setIsGenerating(true);
    setProgress(0);
    
    // Start progress simulation
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 2;
      if (currentProgress >= 95) clearInterval(progressInterval);
      setProgress(currentProgress);
    }, 50);

    try {
      const response = await fetch('/api/lotto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API call failed');
      }

      const data = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);
      setLottoSets(data.sets.map((set: number[]) => set.sort((a, b) => a - b)));
      setIsGenerating(false);
      triggerConfetti();
    } catch (error) {
      console.error('API Error, falling back to local generation:', error);
      
      // Fallback to local generation if API fails (e.g. key missing)
      setTimeout(() => {
        const allSets: LottoSet[] = [];
        for (let i = 0; i < 5; i++) {
          const set = new Set<number>();
          while (set.size < 6) {
            set.add(Math.floor(Math.random() * 45) + 1);
          }
          allSets.push(Array.from(set).sort((a, b) => a - b));
        }
        clearInterval(progressInterval);
        setProgress(100);
        setLottoSets(allSets);
        setIsGenerating(false);
        triggerConfetti();
      }, 500);
    }
  }, []);

  const getBallColorClass = (num: number) => {
    if (num <= 10) return 'lotto-ball-1';
    if (num <= 20) return 'lotto-ball-11';
    if (num <= 30) return 'lotto-ball-21';
    if (num <= 40) return 'lotto-ball-31';
    return 'lotto-ball-41';
  };

  return (
    <div className="min-h-screen bg-[#F0F4FF] flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Background Decorations */}
      <div className="bg-blur-circle w-[400px] h-[400px] bg-indigo-400 -top-20 -left-20 animate-float" />
      <div className="bg-blur-circle w-[300px] h-[300px] bg-pink-400 bottom-0 right-0 animate-float" style={{ animationDelay: '-2s' }} />
      <div className="bg-blur-circle w-[250px] h-[250px] bg-yellow-300 top-1/2 left-1/4 opacity-10 animate-float" style={{ animationDelay: '-4s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-md w-full max-w-[900px] min-h-[720px] rounded-[48px] border-8 border-white p-6 md:p-10 flex flex-col items-center justify-between card-glow relative z-10"
      >
        <header className="text-center mb-6 relative w-full flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-6">
            <div className="w-10 md:w-12 h-10 md:w-12" /> {/* Spacer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white text-xs font-black rounded-full uppercase tracking-widest shadow-lg shadow-indigo-200"
            >
              <Trophy size={14} className="text-yellow-300" />
              Lotto Fortune Master
            </motion.div>
            <button 
              onClick={() => setShowStats(!showStats)}
              className={`w-10 md:w-12 h-10 md:h-12 rounded-full flex items-center justify-center transition-all ${showStats ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              title="통계 보기"
            >
              <BarChart3 size={20} />
            </button>
          </div>
          
          <motion.div className="relative inline-block">
            <motion.h1 
              initial={{ rotate: -2 }}
              animate={{ rotate: 2 }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}
              className="text-4xl md:text-7xl font-black text-indigo-900 tracking-tighter mb-2 uppercase italic leading-none"
            >
              Golden Numbers
            </motion.h1>
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute -top-4 -right-8 text-yellow-400"
            >
              <Sparkles size={32} />
            </motion.div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-indigo-400 font-bold text-lg md:text-xl mt-4"
          >
            오늘의 주인공은 바로 당신! 럭키 조합 5
          </motion.p>
        </header>

        <main className="flex-1 w-full flex flex-col justify-start space-y-4 md:space-y-5 overflow-y-auto mb-8 px-2 custom-scrollbar">
          {showStats ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-indigo-50/50 rounded-[40px] p-6 md:p-8 border-2 border-indigo-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="text-indigo-600" size={24} />
                <h2 className="text-2xl font-black text-indigo-900 uppercase italic">Historical Insights</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-50">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap size={14} className="text-yellow-400" /> 역대 최다 등장 TOP 10
                  </h3>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topNumbersData}>
                        <XAxis dataKey="number" hide />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{ fill: 'transparent' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-indigo-900 text-white px-3 py-2 rounded-xl text-xs font-bold border-2 border-indigo-700 shadow-xl">
                                  번호 {payload[0].payload.number}: {payload[0].value}회
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="frequency" radius={[10, 10, 10, 10]}>
                          {topNumbersData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index < 3 ? '#6366f1' : '#c7d2fe'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {topNumbersData.slice(0, 5).map(item => (
                        <span key={item.number} className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-black">{item.number}</span>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-300">최다 위주</span>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
                        <Info size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-indigo-900 text-sm">데이터 기반 추천</h4>
                        <p className="text-xs text-indigo-400 leading-relaxed mt-1">역대 당첨 빈도가 높은 숫자의 출현 확률을 분석하여 세트를 구성합니다. 모든 숫자는 1-45 범위 내에서 검증됩니다.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-pink-500 flex items-center justify-center text-white shrink-0">
                        <Zap size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-indigo-900 text-sm">확률 가중치 시스템</h4>
                        <p className="text-xs text-indigo-400 leading-relaxed mt-1">AI가 각 회차별 패턴과 미출현 번호를 대조하여 가장 잠재력 있는 조합을 선별합니다.</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowStats(false)}
                    className="mt-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest border-2 border-indigo-100 hover:bg-indigo-50 transition-colors"
                  >
                    번호 확인하러 가기
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout text-center">
              {lottoSets.length > 0 ? (
                lottoSets.map((set, setIndex) => (
                  <motion.div
                    key={`set-${setIndex}-${set.join('-')}`}
                    initial={{ opacity: 0, x: -50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.9 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                      delay: setIndex * 0.1 
                    }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`
                      flex items-center justify-between p-3 md:p-5 rounded-[28px] border-2 border-slate-50 shadow-sm
                      ${setIndex % 2 === 0 ? 'bg-indigo-50/50' : 'bg-white'}
                    `}
                  >
                    <div className="flex flex-col items-center justify-center w-10 md:w-14">
                      <span className="text-[10px] font-black text-indigo-300 uppercase leading-none mb-1">Set</span>
                      <span className="text-xl md:text-2xl font-black text-indigo-600 leading-none">
                        {(setIndex + 1).toString().padStart(2, '0')}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4 flex-1 px-4">
                      {set.map((num, numIndex) => (
                        <div key={`${setIndex}-${numIndex}-${num}`} className="relative group/ball">
                          <motion.div
                            initial={{ scale: 0, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            whileHover={{ y: -8, scale: 1.1 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 300, 
                              damping: 15,
                              delay: (setIndex * 0.05) + (numIndex * 0.08) 
                            }}
                            className={`
                              w-10 h-10 md:w-15 md:h-15 rounded-full flex items-center justify-center 
                              text-xl md:text-2xl font-black shadow-[0_4px_10px_rgba(0,0,0,0.15)] ring-4 ring-white
                              ${getBallColorClass(num)} cursor-default
                            `}
                          >
                            {num}
                          </motion.div>
                          {/* Frequency Tooltip */}
                          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover/ball:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                            {getFrequency(num)}회 등장
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="hidden sm:flex flex-col items-end w-20 md:w-24">
                      <div className="flex items-center gap-1 text-[10px] font-black text-indigo-300 uppercase mb-1">
                        <Zap size={10} fill="currentColor" /> Luck
                      </div>
                      <div className="text-sm md:text-lg font-black text-slate-700">
                        {Math.floor(Math.random() * 30) + 70}%
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                !isGenerating && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 md:py-24 text-center border-4 border-dashed border-indigo-100 rounded-[40px] bg-indigo-50/30 group"
                  >
                    <motion.div 
                      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                      className="flex justify-center mb-6"
                    >
                      <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-xl shadow-indigo-100 ring-8 ring-indigo-50">
                        <Sparkles size={48} className="text-indigo-400 group-hover:scale-125 transition-transform" />
                      </div>
                    </motion.div>
                    <h2 className="text-indigo-900 font-black text-3xl md:text-4xl uppercase italic mb-2">Feeling Lucky?</h2>
                    <p className="text-indigo-300 font-bold text-lg">하단의 골든 버튼을 눌러 행운을 시작하세요!</p>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          )}
        </main>

        <footer className="w-full space-y-6">
          {isGenerating && (
            <div className="w-full px-4">
              <div className="h-4 bg-indigo-50 rounded-full overflow-hidden border-2 border-white shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700"
                />
              </div>
              <p className="text-center text-indigo-400 font-black text-xs uppercase mt-2 tracking-tighter">
                Analyzing Lucky Energy... {progress}%
              </p>
            </div>
          )}

          <div className="flex space-x-4 w-full">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -10px rgba(79, 70, 229, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={generateLottoNumbers}
              disabled={isGenerating}
              className={`
                flex-1 py-5 md:py-7 rounded-[32px] font-black text-xl md:text-3xl shadow-2xl uppercase tracking-[0.1em]
                flex items-center justify-center gap-4 transition-all relative overflow-hidden
                ${isGenerating 
                  ? 'bg-indigo-300 text-indigo-100 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'}
              `}
            >
              {isGenerating ? (
                <RotateCcw className="animate-spin" size={32} />
              ) : (
                <>
                  <Zap size={28} fill="currentColor" />
                  새 번호 받기
                </>
              )}
              {!isGenerating && (
                <motion.div 
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent p-4"
                />
              )}
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="w-16 md:w-28 py-5 md:py-7 bg-pink-100 text-pink-600 rounded-[32px] flex items-center justify-center hover:bg-pink-200 transition-colors shadow-lg"
            >
              <Heart size={36} fill="currentColor" className="opacity-80" />
            </motion.button>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
