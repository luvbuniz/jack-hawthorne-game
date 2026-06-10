import React from 'react';
import { GameProgress } from '../types';
import { ICONS } from '../constants';

interface TitleScreenProps {
  progress: GameProgress;
  totalEndings: number;
  totalFacts: number;
  totalQuizQuestions: number;
  onStart: () => void;
  onOpenJournal: () => void;
  onResetProgress: () => void;
}

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

  return (
    <div className="h-full w-full overflow-y-auto bg-[#2a2520]">
      <div
        className="min-h-full flex items-center justify-center p-6 bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(20,16,12,0.75), rgba(20,16,12,0.85)), url('/images/start.jpg')" }}
      >
        <div className="max-w-2xl w-full text-center py-10">
          <ICONS.Compass className="w-16 h-16 mx-auto text-[#d4b483] mb-4" />
          <p className="text-[#d4b483] font-bold tracking-[0.3em] uppercase text-sm mb-2">Secrets of Empires</p>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            Jack Hawthorne's Adventure
          </h1>
          <p className="text-lg md:text-xl text-stone-200 font-medium mb-8 max-w-xl mx-auto leading-relaxed">
            London, 1851. A torn map, a whispered plot, and an empire full of secrets.
            Travel the Victorian world, make your choices, and discover real history along the way.
          </p>

          {/* How to play */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-8 text-left text-stone-100">
            <h2 className="font-bold uppercase tracking-widest text-sm text-[#d4b483] mb-4 text-center">How to Play</h2>
            <ul className="space-y-3 font-medium">
              <li className="flex items-start gap-3">
                <ICONS.Map className="w-5 h-5 mt-1 flex-shrink-0 text-[#d4b483]" />
                <span>Read each scene and choose Jack's next move — every path leads to a different ending.</span>
              </li>
              <li className="flex items-start gap-3">
                <ICONS.Search className="w-5 h-5 mt-1 flex-shrink-0 text-[#d4b483]" />
                <span>Tap the glowing magnifying glasses on each picture to collect <strong>History Facts</strong> for your journal.</span>
              </li>
              <li className="flex items-start gap-3">
                <ICONS.Trophy className="w-5 h-5 mt-1 flex-shrink-0 text-[#d4b483]" />
                <span>Find all {totalEndings} endings to earn every <strong>Explorer Badge</strong>.</span>
              </li>
              <li className="flex items-start gap-3">
                <ICONS.Book className="w-5 h-5 mt-1 flex-shrink-0 text-[#d4b483]" />
                <span>Finish a chapter, then take the <strong>Knowledge Quiz</strong> to test what you've learned.</span>
              </li>
            </ul>
          </div>

          {/* Progress summary */}
          {hasProgress && (
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                <p className="text-3xl font-black text-white">{progress.endingsFound.length}<span className="text-lg text-stone-300">/{totalEndings}</span></p>
                <p className="text-xs font-bold uppercase tracking-wider text-[#d4b483] mt-1">Endings Found</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                <p className="text-3xl font-black text-white">{progress.factsFound.length}<span className="text-lg text-stone-300">/{totalFacts}</span></p>
                <p className="text-xs font-bold uppercase tracking-wider text-[#d4b483] mt-1">Facts Collected</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                <p className="text-3xl font-black text-white">{progress.bestQuizScore}<span className="text-lg text-stone-300">/{totalQuizQuestions}</span></p>
                <p className="text-xs font-bold uppercase tracking-wider text-[#d4b483] mt-1">Best Quiz Score</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStart}
              className="px-10 py-5 bg-[#8b7355] text-white font-bold text-xl rounded-xl hover:bg-[#a08660] transition-colors shadow-2xl flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-[#d4b483]/50"
            >
              <ICONS.Play className="w-6 h-6" />
              {hasProgress ? 'Continue the Adventure' : 'Begin the Adventure'}
            </button>
            {hasProgress && (
              <button
                onClick={onOpenJournal}
                className="px-8 py-5 bg-white/10 border-2 border-white/30 text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <ICONS.Journal className="w-5 h-5" />
                Jack's Journal
              </button>
            )}
          </div>

          {hasProgress && (
            <button
              onClick={onResetProgress}
              className="mt-6 text-stone-400 hover:text-white underline decoration-2 font-bold text-sm flex items-center gap-1 mx-auto"
            >
              <ICONS.Restart className="w-4 h-4" /> Reset all progress
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;
