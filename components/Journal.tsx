import React from 'react';
import { STORY_NODES } from '../storyData';
import { ICONS } from '../constants';

interface JournalProps {
  factsFound: string[];
  endingsFound: string[];
  onClose: () => void;
}

const Journal: React.FC<JournalProps> = ({ factsFound, endingsFound, onClose }) => {
  const nodesWithFacts = Object.values(STORY_NODES).filter(n => n.hotspots && n.hotspots.length > 0);
  const endingNodes = Object.values(STORY_NODES).filter(n => n.isEnd);
  const totalFacts = nodesWithFacts.reduce((sum, n) => sum + (n.hotspots?.length ?? 0), 0);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" role="dialog" aria-label="Jack's Journal">
      <div className="bg-[#fdfbf7] rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border-4 border-[#8b7355]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-stone-200">
          <div className="flex items-center gap-3">
            <ICONS.Journal className="w-8 h-8 text-[#8b7355]" />
            <div>
              <h2 className="text-2xl font-bold text-stone-900 leading-none">Jack's Journal</h2>
              <p className="text-sm text-stone-600 font-bold mt-1">
                {factsFound.length}/{totalFacts} facts · {endingsFound.length}/{endingNodes.length} badges
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-700"
            aria-label="Close journal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8">
          {/* Badges */}
          <section>
            <h3 className="font-bold text-stone-500 uppercase tracking-widest text-sm mb-3 flex items-center gap-2">
              <ICONS.Trophy className="w-4 h-4" /> Explorer Badges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {endingNodes.map(node => {
                const earned = endingsFound.includes(node.id);
                return (
                  <div
                    key={node.id}
                    className={`p-3 rounded-lg border-2 text-center ${earned ? 'bg-amber-50 border-amber-400' : 'bg-stone-100 border-stone-200'}`}
                  >
                    {earned ? (
                      <ICONS.Award className="w-8 h-8 mx-auto text-amber-500 mb-1" />
                    ) : (
                      <ICONS.Lock className="w-8 h-8 mx-auto text-stone-400 mb-1" />
                    )}
                    <p className={`font-bold text-sm ${earned ? 'text-stone-900' : 'text-stone-400'}`}>
                      {earned ? node.badge : '???'}
                    </p>
                    {earned && <p className="text-xs text-stone-500 font-medium mt-1">{node.title}</p>}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Facts */}
          <section>
            <h3 className="font-bold text-stone-500 uppercase tracking-widest text-sm mb-3 flex items-center gap-2">
              <ICONS.Search className="w-4 h-4" /> History Facts
            </h3>
            <div className="space-y-5">
              {nodesWithFacts.map(node => (
                <div key={node.id}>
                  <p className="font-bold text-[#8b7355] text-sm uppercase tracking-wide mb-2">{node.title}</p>
                  <div className="space-y-2">
                    {node.hotspots!.map(spot => {
                      const found = factsFound.includes(spot.id);
                      return (
                        <div
                          key={spot.id}
                          className={`p-3 rounded-lg border-2 ${found ? 'bg-white border-stone-200' : 'bg-stone-100 border-stone-200'}`}
                        >
                          {found ? (
                            <>
                              <p className="font-bold text-stone-900 flex items-center gap-2">
                                <ICONS.Check className="w-4 h-4 text-green-600 flex-shrink-0" /> {spot.label}
                              </p>
                              <p className="text-stone-700 font-medium mt-1 text-sm leading-relaxed">{spot.description}</p>
                            </>
                          ) : (
                            <p className="font-bold text-stone-400 flex items-center gap-2">
                              <ICONS.Lock className="w-4 h-4 flex-shrink-0" /> Undiscovered fact — explore the scene to find it!
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Journal;
