import React, { useState, useEffect, useMemo } from 'react';
import { StoryNode } from '../types';
import { ICONS } from '../constants';
import { sfx } from '../services/soundService';
import StoryAudioPlayer from './StoryAudioPlayer';
import CoinFlip from './CoinFlip';

interface DialogueBoxProps {
  node: StoryNode;
  narrationOn: boolean;
  onChoice: (nextNodeId: string) => void;
  onShowEnding: () => void;
}

// Classic adventure-game dialogue box: text types out page by page,
// click to advance, choices appear when the text is done. No scrolling.
const DialogueBox: React.FC<DialogueBoxProps> = ({ node, narrationOn, onChoice, onShowEnding }) => {
  const paragraphs = useMemo(
    () => node.content.split('\n').map(p => p.trim()).filter(Boolean),
    [node.content]
  );
  const [page, setPage] = useState(0);
  const [chars, setChars] = useState(0);
  const [hidden, setHidden] = useState(false);

  const current = paragraphs[page] ?? '';
  const typingDone = chars >= current.length;
  const lastPage = page === paragraphs.length - 1;
  const textDone = typingDone && lastPage;

  useEffect(() => {
    setPage(0);
    setChars(0);
    setHidden(false);
  }, [node.id]);

  useEffect(() => {
    if (typingDone) return;
    const timer = setInterval(() => {
      setChars(c => Math.min(c + 2, current.length));
    }, 22);
    return () => clearInterval(timer);
  }, [page, typingDone, current]);

  const advance = () => {
    if (!typingDone) {
      setChars(current.length); // skip the typewriter
      return;
    }
    if (!lastPage) {
      sfx.click();
      setPage(p => p + 1);
      setChars(0);
    }
  };

  // Tucked away so the player can explore the scene and reach
  // hotspots that sit behind the dialogue box
  if (hidden) {
    return (
      <div className="absolute bottom-0 inset-x-0 z-20 p-3 md:p-5 flex justify-center pointer-events-none">
        <button
          onClick={() => { sfx.click(); setHidden(false); }}
          className="pointer-events-auto rise-in flex items-center gap-2 px-4 py-2.5 bg-[#1d1814]/95 backdrop-blur-md border-2 border-[#8b7355] rounded-full text-[#d4b483] font-bold text-sm shadow-2xl hover:bg-[#2a2218] transition-colors"
          aria-label="Show story text"
        >
          <ICONS.Book className="w-4 h-4" /> Show text
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-0 inset-x-0 z-20 p-3 md:p-5 pointer-events-none">
      <div className="max-w-3xl mx-auto pointer-events-auto rise-in">
        <div className="bg-[#1d1814]/95 backdrop-blur-md border-2 border-[#8b7355] rounded-xl shadow-2xl overflow-hidden">

          {/* Box header: scene title + narration + hide toggle */}
          <div className="flex items-center justify-between px-4 md:px-5 pt-3">
            <span className="text-xs font-bold tracking-[0.2em] text-[#d4b483] uppercase">
              {node.title}
            </span>
            <div className="flex items-center gap-1">
              <StoryAudioPlayer text={node.content} nodeId={node.id} autoPlay={narrationOn} />
              <button
                onClick={() => { sfx.click(); setHidden(true); }}
                className="p-1.5 text-stone-400 hover:text-[#d4b483] transition-colors"
                aria-label="Hide story text to explore the scene"
                title="Hide text to explore the scene"
              >
                <ICONS.ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Narrative text (typewriter, paged) */}
          <div
            onClick={textDone ? undefined : advance}
            role={textDone ? undefined : 'button'}
            aria-label={textDone ? undefined : 'Continue story text'}
            className={`px-4 md:px-5 py-3 text-stone-100 text-base md:text-lg leading-relaxed font-medium min-h-[5.5rem] max-h-[34vh] overflow-y-auto ${textDone ? '' : 'cursor-pointer'}`}
          >
            <p>{current.slice(0, chars)}</p>
            {!textDone && typingDone && (
              <p className="text-[#d4b483] text-sm font-bold mt-2 flex items-center gap-1 blink-soft">
                <ICONS.ChevronDown className="w-4 h-4" /> Click to continue
              </p>
            )}
          </div>

          {/* Interaction area appears when the text is finished */}
          {textDone && (
            <div className="px-4 md:px-5 pb-4 rise-in">
              {node.chance ? (
                <CoinFlip chance={node.chance} onContinue={onChoice} />
              ) : node.isEnd ? (
                <button
                  onClick={onShowEnding}
                  className="w-full py-3 px-5 bg-[#8b7355] text-white font-bold text-lg rounded-lg hover:bg-[#a08660] transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <ICONS.Award className="w-5 h-5" />
                  See what you've earned →
                </button>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">What will you do?</p>
                  {node.choices.map((choice, idx) => (
                    <button
                      key={idx}
                      onClick={() => onChoice(choice.nextNodeId)}
                      className="py-2.5 px-4 bg-white/5 border border-[#8b7355]/60 text-stone-100 rounded-lg hover:bg-[#8b7355]/40 hover:border-[#d4b483] transition-all text-left font-bold text-sm md:text-base flex items-center group focus:ring-2 focus:ring-[#d4b483] focus:outline-none"
                    >
                      <span className="bg-[#8b7355]/50 text-[#eaddcf] font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs mr-3 flex-shrink-0 group-hover:bg-[#d4b483] group-hover:text-stone-900 transition-colors">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {choice.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DialogueBox;
