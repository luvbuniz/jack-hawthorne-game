import React, { useState, useEffect, useCallback } from 'react';
import { AppState, GameProgress, Hotspot } from './types';
import { STORY_NODES, QUIZ_QUESTIONS } from './storyData';
import { ICONS, PROGRESS_STORAGE_KEY } from './constants';
import InteractiveImage from './components/InteractiveImage';
import Quiz from './components/Quiz';
import StoryAudioPlayer from './components/StoryAudioPlayer';
import TitleScreen from './components/TitleScreen';
import Journal from './components/Journal';
import CoinFlip from './components/CoinFlip';

const TOTAL_FACTS = Object.values(STORY_NODES).reduce((sum, n) => sum + (n.hotspots?.length ?? 0), 0);
const TOTAL_ENDINGS = Object.values(STORY_NODES).filter(n => n.isEnd).length;

const EMPTY_PROGRESS: GameProgress = { endingsFound: [], factsFound: [], bestQuizScore: 0 };

const loadProgress = (): GameProgress => {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      endingsFound: Array.isArray(parsed.endingsFound) ? parsed.endingsFound : [],
      factsFound: Array.isArray(parsed.factsFound) ? parsed.factsFound : [],
      bestQuizScore: typeof parsed.bestQuizScore === 'number' ? parsed.bestQuizScore : 0,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
};

const App: React.FC = () => {
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [appState, setAppState] = useState<AppState>(AppState.TITLE);
  const [history, setHistory] = useState<string[]>([]);
  const [progress, setProgress] = useState<GameProgress>(loadProgress);
  const [journalOpen, setJournalOpen] = useState(false);
  const [newBadge, setNewBadge] = useState<string | null>(null);

  const currentNode = STORY_NODES[currentNodeId];

  // Persist progress whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Storage unavailable (private mode etc.) — play without saving
    }
  }, [progress]);

  const handleChoice = (nextNodeId: string) => {
    setHistory([...history, currentNodeId]);
    setCurrentNodeId(nextNodeId);

    // Record the ending and badge as soon as the player reaches it
    const nextNode = STORY_NODES[nextNodeId];
    if (nextNode?.isEnd) {
      const isNew = !progress.endingsFound.includes(nextNodeId);
      setNewBadge(isNew ? nextNode.badge ?? null : null);
      if (isNew) {
        setProgress(prev =>
          prev.endingsFound.includes(nextNodeId)
            ? prev
            : { ...prev, endingsFound: [...prev.endingsFound, nextNodeId] }
        );
      }
    } else {
      setNewBadge(null);
    }
  };

  const handleDiscoverFact = useCallback((hotspot: Hotspot) => {
    setProgress(prev =>
      prev.factsFound.includes(hotspot.id)
        ? prev
        : { ...prev, factsFound: [...prev.factsFound, hotspot.id] }
    );
  }, []);

  const handleQuizComplete = useCallback((score: number) => {
    setProgress(prev =>
      score > prev.bestQuizScore ? { ...prev, bestQuizScore: score } : prev
    );
  }, []);

  const startStory = () => {
    setCurrentNodeId('start');
    setHistory([]);
    setNewBadge(null);
    setAppState(AppState.STORY);
  };

  const goToTitle = () => {
    setCurrentNodeId('start');
    setHistory([]);
    setNewBadge(null);
    setAppState(AppState.TITLE);
  };

  const resetProgress = () => {
    if (window.confirm('Reset all progress? Your badges, facts, and quiz score will be erased.')) {
      setProgress(EMPTY_PROGRESS);
      try {
        localStorage.removeItem(PROGRESS_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };

  const startQuiz = () => {
    setAppState(AppState.QUIZ);
  };

  // Title screen takes over the whole viewport
  if (appState === AppState.TITLE) {
    return (
      <div className="h-screen w-screen overflow-hidden">
        <TitleScreen
          progress={progress}
          totalEndings={TOTAL_ENDINGS}
          totalFacts={TOTAL_FACTS}
          totalQuizQuestions={QUIZ_QUESTIONS.length}
          onStart={startStory}
          onOpenJournal={() => setJournalOpen(true)}
          onResetProgress={resetProgress}
        />
        {journalOpen && (
          <Journal
            factsFound={progress.factsFound}
            endingsFound={progress.endingsFound}
            onClose={() => setJournalOpen(false)}
          />
        )}
      </div>
    );
  }

  // Full screen layout with no outer scrolling
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col md:flex-row bg-[#fdfbf7]">

      {/* LEFT PANEL: Text Content (Scrollable) */}
      <div className="w-full md:w-1/2 h-full flex flex-col overflow-hidden bg-[#fdfbf7] relative shadow-xl z-20">

        {/* Header Area */}
        <header className="px-8 pt-8 pb-4 border-b border-stone-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-[#8b7355]">
              <ICONS.Compass className="w-8 h-8" />
              <div>
                 <h1 className="text-2xl font-bold text-stone-900 leading-none">Secrets of Empires</h1>
                 <p className="text-sm text-stone-600 font-bold mt-1">Jack Hawthorne's Adventure</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setJournalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg font-bold text-stone-700 text-sm transition-colors"
                aria-label="Open Jack's Journal"
              >
                <ICONS.Journal className="w-5 h-5 text-[#8b7355]" />
                <span className="hidden sm:inline">{progress.factsFound.length}/{TOTAL_FACTS}</span>
              </button>
              <button
                onClick={goToTitle}
                className="flex items-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg font-bold text-stone-700 text-sm transition-colors"
                aria-label="Return to title screen"
              >
                <ICONS.Map className="w-5 h-5 text-[#8b7355]" />
                <span className="hidden sm:inline">Menu</span>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 scroll-smooth">
          {appState === AppState.STORY && currentNode ? (
            <div className="max-w-xl mx-auto">

              {/* Navigation Breadcrumb */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold tracking-widest text-[#8b7355] uppercase border px-2 py-1 rounded border-[#8b7355]">
                  {currentNode.title}
                </span>
                {history.length > 0 && (
                  <button
                    onClick={startStory}
                    className="flex items-center text-sm font-bold text-stone-500 hover:text-stone-900 underline decoration-2"
                  >
                    <ICONS.Restart className="w-4 h-4 mr-1" /> Restart
                  </button>
                )}
              </div>

              {/* Audio Player */}
              <div className="mb-6">
                 <StoryAudioPlayer text={currentNode.content} nodeId={currentNode.id} />
              </div>

              {/* Main Text - High Contrast, Large Font */}
              <div className="prose prose-xl prose-stone max-w-none text-stone-900 leading-relaxed font-sans mb-10">
                 {currentNode.content.split('\n').map((paragraph, idx) => (
                   <p key={idx} className="mb-6 font-medium">
                     {paragraph}
                   </p>
                 ))}
              </div>

              {/* Chance event: real coin flip */}
              {currentNode.chance ? (
                <CoinFlip key={currentNode.id} chance={currentNode.chance} onContinue={handleChoice} />
              ) : !currentNode.isEnd ? (
                <div className="space-y-4">
                  <h3 className="font-bold text-stone-500 uppercase tracking-widest text-sm mb-4">What will you do?</h3>
                  <div className="flex flex-col gap-4">
                    {currentNode.choices.map((choice, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleChoice(choice.nextNodeId)}
                        className="p-5 bg-white text-stone-900 border-2 border-stone-300 rounded-lg hover:border-[#8b7355] hover:bg-stone-50 transition-all text-left font-bold text-lg shadow-sm hover:shadow-md flex items-center group focus:ring-4 focus:ring-[#8b7355]/30 focus:outline-none"
                      >
                         <span className="bg-stone-200 text-stone-700 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm mr-4 group-hover:bg-[#8b7355] group-hover:text-white transition-colors">
                           {String.fromCharCode(65 + idx)}
                         </span>
                         {choice.text}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Badge earned */}
                  {currentNode.badge && (
                    <div className={`text-center p-6 rounded-xl border-2 ${newBadge ? 'bg-amber-50 border-amber-400' : 'bg-stone-50 border-stone-200'}`}>
                      <ICONS.Award className="w-14 h-14 mx-auto text-amber-500 mb-2" />
                      <p className="text-sm font-bold uppercase tracking-widest text-stone-500">
                        {newBadge ? 'New Badge Unlocked!' : 'Badge Already Earned'}
                      </p>
                      <p className="text-3xl font-black text-stone-900 mt-1">{currentNode.badge}</p>
                      <p className="text-stone-600 font-bold mt-3 text-sm">
                        Endings discovered: {progress.endingsFound.length} of {TOTAL_ENDINGS}
                      </p>
                    </div>
                  )}

                  {/* Educational note */}
                  {currentNode.historicalNote && (
                    <div className="p-6 bg-stone-100 rounded-xl border-l-8 border-[#8b7355] shadow-inner">
                      <h3 className="font-bold text-stone-900 text-lg mb-2 flex items-center gap-2">
                        <ICONS.Book className="w-5 h-5 text-[#8b7355]" /> What Really Happened
                      </h3>
                      <p className="text-stone-800 font-medium leading-relaxed">{currentNode.historicalNote}</p>
                    </div>
                  )}

                  <div className="text-center bg-stone-100 p-8 rounded-xl border-2 border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-2">Chapter Complete</h3>
                    {progress.endingsFound.length < TOTAL_ENDINGS && (
                      <p className="text-stone-600 font-medium mb-6">
                        There are still {TOTAL_ENDINGS - progress.endingsFound.length} more endings to discover. Choose a different path next time!
                      </p>
                    )}
                    <div className="flex flex-col gap-4 mt-4">
                      <button
                        onClick={startStory}
                        className="w-full py-4 px-6 bg-white border-2 border-stone-300 text-stone-800 font-bold rounded-lg hover:bg-stone-50 transition-colors shadow-sm"
                      >
                        Play Again
                      </button>
                      <button
                        onClick={startQuiz}
                        className="w-full py-4 px-6 bg-[#8b7355] text-white font-bold rounded-lg hover:bg-[#705c42] transition-colors shadow-md flex items-center justify-center gap-2"
                      >
                        <ICONS.Book className="w-5 h-5" />
                        Take the Knowledge Quiz
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : appState === AppState.QUIZ ? (
            <div className="max-w-2xl mx-auto">
              <Quiz questions={QUIZ_QUESTIONS} onRestart={goToTitle} onComplete={handleQuizComplete} />
            </div>
          ) : null}
        </div>
      </div>

      {/* RIGHT PANEL: Image (Fixed) */}
      <div className="w-full md:w-1/2 h-64 md:h-full bg-stone-900 relative border-l-4 border-[#8b7355] shadow-inner">
        {appState === AppState.STORY && currentNode ? (
          <InteractiveImage
            nodeId={currentNode.id}
            prompt={currentNode.imagePrompt}
            imagePath={currentNode.imagePath}
            hotspots={currentNode.hotspots}
            discoveredFacts={progress.factsFound}
            onDiscoverFact={handleDiscoverFact}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-[#2a2520]">
             <ICONS.Compass className="w-24 h-24 text-stone-700 opacity-20" />
          </div>
        )}

        {/* Caption Overlay */}
        {appState === AppState.STORY && currentNode && currentNode.hotspots && currentNode.hotspots.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
             <div className="flex items-center justify-center text-white/90 gap-2 font-bold text-sm bg-black/40 backdrop-blur-md py-2 px-4 rounded-full w-fit mx-auto pointer-events-auto">
                <ICONS.Search className="w-4 h-4" />
                Tap highlighted areas to collect History Facts
             </div>
          </div>
        )}
      </div>

      {/* Journal overlay */}
      {journalOpen && (
        <Journal
          factsFound={progress.factsFound}
          endingsFound={progress.endingsFound}
          onClose={() => setJournalOpen(false)}
        />
      )}

    </div>
  );
};

export default App;
