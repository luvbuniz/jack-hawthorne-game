import React, { useState, useCallback } from 'react';
import { AppState, GameProgress, Hotspot } from './types';
import { STORY_NODES, QUIZ_QUESTIONS } from './storyData';
import { ICONS, PROGRESS_STORAGE_KEY } from './constants';
import { sfx, isSfxMuted, setSfxMuted } from './services/soundService';
import InteractiveImage from './components/InteractiveImage';
import Quiz from './components/Quiz';
import TitleScreen from './components/TitleScreen';
import Journal from './components/Journal';
import DialogueBox from './components/DialogueBox';
import EndingPanel from './components/EndingPanel';

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

const loadNarrationPref = (): boolean => {
  try {
    return localStorage.getItem('jh-narration') === '1';
  } catch {
    return false;
  }
};

const App: React.FC = () => {
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [appState, setAppState] = useState<AppState>(AppState.TITLE);
  const [progress, setProgress] = useState<GameProgress>(loadProgress);
  const [journalOpen, setJournalOpen] = useState(false);
  const [newBadge, setNewBadge] = useState<boolean>(false);
  const [showEnding, setShowEnding] = useState(false);
  const [narrationOn, setNarrationOn] = useState(loadNarrationPref);
  const [sfxOn, setSfxOn] = useState(!isSfxMuted());

  const currentNode = STORY_NODES[currentNodeId];

  const saveProgress = (next: GameProgress) => {
    setProgress(next);
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable (private mode etc.) — play without saving
    }
  };

  const handleChoice = (nextNodeId: string) => {
    sfx.pageTurn();
    setCurrentNodeId(nextNodeId);
    setShowEnding(false);

    // Record the ending and badge as soon as the player reaches it
    const nextNode = STORY_NODES[nextNodeId];
    if (nextNode?.isEnd) {
      const isNew = !progress.endingsFound.includes(nextNodeId);
      setNewBadge(isNew);
      if (isNew) {
        saveProgress({ ...progress, endingsFound: [...progress.endingsFound, nextNodeId] });
      }
    } else {
      setNewBadge(false);
    }
  };

  const handleDiscoverFact = useCallback((hotspot: Hotspot) => {
    setProgress(prev => {
      if (prev.factsFound.includes(hotspot.id)) return prev;
      sfx.fact();
      const next = { ...prev, factsFound: [...prev.factsFound, hotspot.id] };
      try {
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const handleQuizComplete = useCallback((score: number) => {
    setProgress(prev => {
      if (score <= prev.bestQuizScore) return prev;
      const next = { ...prev, bestQuizScore: score };
      try {
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const startStory = () => {
    sfx.pageTurn();
    setCurrentNodeId('start');
    setNewBadge(false);
    setShowEnding(false);
    setAppState(AppState.STORY);
  };

  const goToTitle = () => {
    setCurrentNodeId('start');
    setNewBadge(false);
    setShowEnding(false);
    setAppState(AppState.TITLE);
  };

  const resetProgress = () => {
    if (window.confirm('Reset all progress? Your badges, facts, and quiz score will be erased.')) {
      saveProgress(EMPTY_PROGRESS);
    }
  };

  const startQuiz = () => {
    sfx.click();
    setShowEnding(false);
    setAppState(AppState.QUIZ);
  };

  const toggleNarration = () => {
    const next = !narrationOn;
    setNarrationOn(next);
    if (!next && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    try {
      localStorage.setItem('jh-narration', next ? '1' : '0');
    } catch {
      // ignore
    }
  };

  const toggleSfx = () => {
    const next = !sfxOn;
    setSfxOn(next);
    setSfxMuted(!next);
    if (next) sfx.click();
  };

  const openEnding = () => {
    if (newBadge) sfx.badge();
    else sfx.click();
    setShowEnding(true);
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

  // First-person view: the scene fills the screen, UI floats on top
  return (
    <div className="h-screen w-screen overflow-hidden relative bg-black select-none">

      {/* Full-screen scene */}
      <div key={`scene-${currentNodeId}`} className="absolute inset-0 scene-fade">
        {currentNode && (
          <InteractiveImage
            nodeId={currentNode.id}
            prompt={currentNode.imagePrompt}
            imagePath={currentNode.imagePath}
            hotspots={appState === AppState.STORY ? currentNode.hotspots : undefined}
            discoveredFacts={progress.factsFound}
            onDiscoverFact={handleDiscoverFact}
          />
        )}
        {/* Subtle vignette for text legibility */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/50 via-transparent to-black/60" />
      </div>

      {/* HUD */}
      <header className="absolute top-0 inset-x-0 z-30 px-3 py-2 md:px-5 md:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/90">
          <ICONS.Compass className="w-6 h-6 text-[#d4b483]" />
          <span className="font-bold text-sm tracking-wide hidden sm:inline drop-shadow">Jack Hawthorne's Adventure</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { sfx.click(); setJournalOpen(true); }}
            className="flex items-center gap-1.5 px-2.5 py-2 bg-black/45 hover:bg-black/70 backdrop-blur rounded-lg font-bold text-white text-xs transition-colors border border-white/20"
            aria-label="Open Jack's Journal"
            title="Jack's Journal"
          >
            <ICONS.Journal className="w-4 h-4 text-[#d4b483]" />
            {progress.factsFound.length}/{TOTAL_FACTS}
          </button>
          <button
            onClick={toggleNarration}
            className={`p-2 backdrop-blur rounded-lg transition-colors border border-white/20 ${narrationOn ? 'bg-[#8b7355] text-white' : 'bg-black/45 text-white/70 hover:bg-black/70'}`}
            aria-label={narrationOn ? 'Turn off auto-narration' : 'Turn on auto-narration'}
            aria-pressed={narrationOn}
            title={narrationOn ? 'Auto-narration: on' : 'Auto-narration: off'}
          >
            {narrationOn ? <ICONS.Volume className="w-4 h-4" /> : <ICONS.VolumeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleSfx}
            className={`p-2 backdrop-blur rounded-lg transition-colors border border-white/20 ${sfxOn ? 'bg-black/45 text-white hover:bg-black/70' : 'bg-black/45 text-white/40 hover:bg-black/70'}`}
            aria-label={sfxOn ? 'Mute sound effects' : 'Unmute sound effects'}
            aria-pressed={sfxOn}
            title={sfxOn ? 'Sound effects: on' : 'Sound effects: off'}
          >
            <ICONS.Music className="w-4 h-4" />
          </button>
          <button
            onClick={goToTitle}
            className="flex items-center gap-1.5 px-2.5 py-2 bg-black/45 hover:bg-black/70 backdrop-blur rounded-lg font-bold text-white text-xs transition-colors border border-white/20"
            aria-label="Return to main menu"
            title="Main menu"
          >
            <ICONS.Map className="w-4 h-4 text-[#d4b483]" />
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>
      </header>

      {/* Explore hint */}
      {appState === AppState.STORY && currentNode?.hotspots && currentNode.hotspots.length > 0 && !showEnding && (
        <div className="absolute top-14 md:top-16 inset-x-0 z-20 flex justify-center pointer-events-none">
          <div className="flex items-center gap-1.5 text-white/85 font-bold text-xs bg-black/40 backdrop-blur py-1.5 px-3 rounded-full">
            <ICONS.Search className="w-3.5 h-3.5" />
            Examine the glowing spots to collect facts
          </div>
        </div>
      )}

      {/* Dialogue box */}
      {appState === AppState.STORY && currentNode && !showEnding && (
        <DialogueBox
          key={`dialogue-${currentNodeId}`}
          node={currentNode}
          narrationOn={narrationOn}
          onChoice={handleChoice}
          onShowEnding={openEnding}
        />
      )}

      {/* Ending overlay */}
      {appState === AppState.STORY && currentNode?.isEnd && showEnding && (
        <EndingPanel
          node={currentNode}
          isNewBadge={newBadge}
          endingsFound={progress.endingsFound.length}
          totalEndings={TOTAL_ENDINGS}
          onPlayAgain={startStory}
          onQuiz={startQuiz}
          onMenu={goToTitle}
        />
      )}

      {/* Quiz overlay */}
      {appState === AppState.QUIZ && (
        <div className="fixed inset-0 z-40 bg-[#171310]/97 overflow-y-auto p-4 flex">
          <div className="m-auto w-full max-w-2xl">
            <Quiz questions={QUIZ_QUESTIONS} onRestart={goToTitle} onComplete={handleQuizComplete} />
          </div>
        </div>
      )}

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
