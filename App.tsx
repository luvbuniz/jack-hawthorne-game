import React, { useState } from 'react';
import { AppState } from './types';
import { STORY_NODES, QUIZ_QUESTIONS } from './storyData';
import { ICONS } from './constants';
import InteractiveImage from './components/InteractiveImage';
import Quiz from './components/Quiz';
import StoryAudioPlayer from './components/StoryAudioPlayer';

const App: React.FC = () => {
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [appState, setAppState] = useState<AppState>(AppState.STORY);
  const [history, setHistory] = useState<string[]>([]);

  const currentNode = STORY_NODES[currentNodeId];

  const handleChoice = (nextNodeId: string) => {
    setHistory([...history, currentNodeId]);
    setCurrentNodeId(nextNodeId);
  };

  const restart = () => {
    setCurrentNodeId('start');
    setAppState(AppState.STORY);
    setHistory([]);
    sessionStorage.clear();
  };

  const startQuiz = () => {
    setAppState(AppState.QUIZ);
  };

  // Full screen layout with no outer scrolling
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col md:flex-row bg-[#fdfbf7]">
      
      {/* LEFT PANEL: Text Content (Scrollable) */}
      <div className="w-full md:w-1/2 h-full flex flex-col overflow-hidden bg-[#fdfbf7] relative shadow-xl z-20">
        
        {/* Header Area */}
        <header className="px-8 pt-8 pb-4 border-b border-stone-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3 text-[#8b7355]">
            <ICONS.Compass className="w-8 h-8" />
            <div>
               <h1 className="text-2xl font-bold text-stone-900 leading-none">Secrets of Empires</h1>
               <p className="text-sm text-stone-600 font-bold mt-1">Jack Hawthorne's Adventure</p>
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
                    onClick={restart}
                    className="flex items-center text-sm font-bold text-stone-500 hover:text-stone-900 underline decoration-2"
                  >
                    <ICONS.Map className="w-4 h-4 mr-1" /> Restart
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

              {/* Choices */}
              {!currentNode.isEnd ? (
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
                <div className="text-center bg-stone-100 p-8 rounded-xl border-2 border-stone-200">
                  <h3 className="text-2xl font-bold text-stone-800 mb-6">Chapter Complete</h3>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={restart}
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
              )}
            </div>
          ) : appState === AppState.QUIZ ? (
            <div className="max-w-2xl mx-auto">
              <Quiz questions={QUIZ_QUESTIONS} onRestart={restart} />
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
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-[#2a2520]">
             <ICONS.Compass className="w-24 h-24 text-stone-700 opacity-20" />
          </div>
        )}
        
        {/* Caption Overlay */}
        {appState === AppState.STORY && currentNode && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
             <div className="flex items-center justify-center text-white/90 gap-2 font-bold text-sm bg-black/40 backdrop-blur-md py-2 px-4 rounded-full w-fit mx-auto pointer-events-auto">
                <ICONS.Search className="w-4 h-4" />
                Tap highlighted areas on the image
             </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default App;