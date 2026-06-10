import React from 'react';
import { StoryNode } from '../types';
import { ICONS } from '../constants';

interface EndingPanelProps {
  node: StoryNode;
  isNewBadge: boolean;
  endingsFound: number;
  totalEndings: number;
  onPlayAgain: () => void;
  onQuiz: () => void;
  onMenu: () => void;
}

const EndingPanel: React.FC<EndingPanelProps> = ({
  node,
  isNewBadge,
  endingsFound,
  totalEndings,
  onPlayAgain,
  onQuiz,
  onMenu,
}) => {
  return (
    <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-label="Chapter complete">
      <div className="bg-[#fdfbf7] rounded-xl border-4 border-[#8b7355] shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto rise-in">
        <div className="p-6 text-center">
          <ICONS.Award className={`w-16 h-16 mx-auto mb-2 ${isNewBadge ? 'text-amber-500' : 'text-stone-400'}`} />
          <p className="text-xs font-bold uppercase tracking-widest text-stone-500">
            {isNewBadge ? 'New Badge Unlocked!' : 'Badge Already Earned'}
          </p>
          <h2 className="text-3xl font-black text-stone-900 mt-1 mb-1">{node.badge}</h2>
          <p className="text-stone-500 font-bold text-sm mb-4">
            Endings discovered: {endingsFound} of {totalEndings}
          </p>

          {node.historicalNote && (
            <div className="p-4 bg-stone-100 rounded-lg border-l-4 border-[#8b7355] text-left mb-5">
              <h3 className="font-bold text-stone-900 text-sm mb-1 flex items-center gap-2 uppercase tracking-wide">
                <ICONS.Book className="w-4 h-4 text-[#8b7355]" /> What Really Happened
              </h3>
              <p className="text-stone-800 font-medium text-sm leading-relaxed">{node.historicalNote}</p>
            </div>
          )}

          {endingsFound < totalEndings && (
            <p className="text-stone-600 font-medium text-sm mb-4">
              {totalEndings - endingsFound} more endings remain. Choose a different path next time!
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={onPlayAgain}
              className="py-3 px-4 bg-white border-2 border-stone-300 text-stone-800 font-bold rounded-lg hover:bg-stone-50 transition-colors text-sm"
            >
              Play Again
            </button>
            <button
              onClick={onQuiz}
              className="py-3 px-4 bg-[#8b7355] text-white font-bold rounded-lg hover:bg-[#705c42] transition-colors text-sm flex items-center justify-center gap-1"
            >
              <ICONS.Book className="w-4 h-4" /> Take Quiz
            </button>
            <button
              onClick={onMenu}
              className="py-3 px-4 bg-white border-2 border-stone-300 text-stone-800 font-bold rounded-lg hover:bg-stone-50 transition-colors text-sm flex items-center justify-center gap-1"
            >
              <ICONS.Map className="w-4 h-4" /> Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndingPanel;
