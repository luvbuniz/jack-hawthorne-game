import React from 'react';
import { GameProgress } from '../types';
import { ICONS } from '../constants';
import { sfx } from '../services/soundService';

interface TitleScreenProps {
  progress: GameProgress;
  totalEndings: number;
  totalFacts: number;
  totalQuizQuestions: number;
  onStart: () => void;
  onOpenJournal: () => void;
  onResetProgress: () => void;
}

const explorerRank = (p: GameProgress, totals: { endings: number; facts: number; quiz: number }): string => {
  const score =
    (p.endingsFound.length / totals.endings) * 0.45 +
    (p.factsFound.length / totals.facts) * 0.35 +
    (p.bestQuizScore / totals.quiz) * 0.2;
  if (score >= 0.999) return 'Legendary Master Historian';
  if (score >= 0.75) return 'Master Explorer';
  if (score >= 0.5) return 'Seasoned Adventurer';
  if (score >= 0.25) return 'Junior Explorer';
  if (score > 0) return 'Apprentice Adventurer';
  return 'New Recruit';
};

const TitleScreen: React.FC<TitleScreenProps> = ({
  progress,
  totalEndings,
  totalFacts,
  totalQuizQuestions,
  onStart,
  onOpenJournal,
  onResetProgress,
}) => {
  const hasProgress = progress.endingsFound.length > 0 || progress.factsFound.length > 0 || progress.bestQuizScore > 0;
  const rank = explorerRank(progress, { endings: totalEndings, facts: totalFacts, quiz: totalQuizQuestions });

  return (
    <div className="h-full w-full overflow-y-auto bg-[#2a2520]">
      <div
        className="min-h-full flex items-center justify-center p-4 bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(20,16,12,0.75), rgba(20,16,12,0.85)), url('/images/start.jpg')" }}
      >
        <div className="max-w-xl w-full text-center py-4">
          <ICONS.Compass className="w-10 h-10 mx-auto text-[#d4b483] mb-2" />
          <p className="text-[#d4b483] font-bold tracking-[0.3em] uppercase text-xs mb-1">Secrets of Empires</p>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
            Jack Hawthorne's Adventure
          </h1>
          <p className="text-sm md:text-base text-stone-200 font-medium mb-4 max-w-md mx-auto leading-relaxed">
            London, 1851. A torn map, a whispered plot, and an empire full of secrets.
            Step into Jack's shoes, explore each scene, and discover real history along the way.
          </p>

          {/* How to play */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-4 text-left text-stone-100">
            <h2 className="font-bold uppercase tracking-widest text-xs text-[#d4b483] mb-2 text-center">How to Play</h2>
            <ul className="space-y-1.5 font-medium text-sm">
              <li className="flex items-start gap-2">
                <ICONS.Map className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#d4b483]" />
                <span>Read each scene and choose Jack's next move — every path leads to a different ending.</span>
              </li>
              <li className="flex items-start gap-2">
                <ICONS.Search className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#d4b483]" />
                <span>Click the glowing spots in each scene to collect <strong>History Facts</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <ICONS.Trophy className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#d4b483]" />
                <span>Find all {totalEndings} endings to earn every <strong>Explorer Badge</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <ICONS.Book className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#d4b483]" />
                <span>Then take the <strong>Knowledge Quiz</strong> to test what you've learned.</span>
              </li>
            </ul>
          </div>

          {/* Progress summary */}
          {hasProgress && (
            <>
              <p className="text-[#d4b483] font-bold uppercase tracking-widest text-xs mb-2">
                Rank: <span className="text-white">{rank}</span>
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-white/10 border border-white/20 rounded-lg p-2.5">
                  <p className="text-xl font-black text-white">{progress.endingsFound.length}<span className="text-sm text-stone-300">/{totalEndings}</span></p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#d4b483]">Endings</p>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-lg p-2.5">
                  <p className="text-xl font-black text-white">{progress.factsFound.length}<span className="text-sm text-stone-300">/{totalFacts}</span></p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#d4b483]">Facts</p>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-lg p-2.5">
                  <p className="text-xl font-black text-white">{progress.bestQuizScore}<span className="text-sm text-stone-300">/{totalQuizQuestions}</span></p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#d4b483]">Best Quiz</p>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              onClick={onStart}
              className="px-8 py-3.5 bg-[#8b7355] text-white font-bold text-lg rounded-xl hover:bg-[#a08660] transition-colors shadow-2xl flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-[#d4b483]/50"
            >
              <ICONS.Play className="w-5 h-5" />
              {hasProgress ? 'Continue the Adventure' : 'Begin the Adventure'}
            </button>
            {hasProgress && (
              <button
                onClick={() => { sfx.click(); onOpenJournal(); }}
                className="px-6 py-3.5 bg-white/10 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <ICONS.Journal className="w-5 h-5" />
                Jack's Journal
              </button>
            )}
          </div>

          {hasProgress && (
            <button
              onClick={onResetProgress}
              className="mt-3 text-stone-400 hover:text-white underline decoration-2 font-bold text-xs flex items-center gap-1 mx-auto"
            >
              <ICONS.Restart className="w-3 h-3" /> Reset all progress
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;
