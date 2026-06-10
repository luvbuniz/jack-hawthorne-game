import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { ICONS } from '../constants';
import { sfx } from '../services/soundService';

interface QuizProps {
  questions: QuizQuestion[];
  onRestart: () => void;
  onComplete?: (score: number, total: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onRestart, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQ = questions[currentIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQ.correctAnswer) {
      sfx.correct();
      setScore(s => s + 1);
    } else {
      sfx.wrong();
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      if (score === questions.length) sfx.badge();
      onComplete?.(score, questions.length);
    }
  };

  const getReward = () => {
    const percentage = score / questions.length;
    if (percentage === 1) return { color: "text-yellow-500", text: "Gold Medal", icon: ICONS.Award };
    if (percentage >= 0.7) return { color: "text-slate-400", text: "Silver Medal", icon: ICONS.Award };
    if (percentage >= 0.4) return { color: "text-amber-700", text: "Bronze Medal", icon: ICONS.Award };
    return { color: "text-blue-500", text: "Participation Star", icon: ICONS.Award };
  };

  if (showResult) {
    const reward = getReward();
    const RewardIcon = reward.icon;

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-xl border-4 border-[#8b7355] text-center transition-all duration-500">
        <RewardIcon className={`w-20 h-20 mx-auto mb-4 ${reward.color}`} />
        <h2 className="text-3xl font-bold text-stone-900 mb-2">Quiz Complete!</h2>
        <p className="text-xl mb-5 font-bold text-stone-700">You scored {score} out of {questions.length}</p>

        <div className="bg-stone-50 p-4 rounded-xl mb-5 border-2 border-stone-200">
             <h3 className="text-sm font-bold text-stone-800 mb-1 uppercase tracking-wide">Reward Earned</h3>
             <p className={`text-2xl font-black ${reward.color}`}>{reward.text}</p>
             <p className="mt-2 text-stone-600 font-medium">
               {score === questions.length ? "Perfect score! You are a true scholar of history." : "Great effort! History is full of lessons to learn."}
             </p>
        </div>

        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-8 py-3 bg-[#8b7355] text-white rounded-lg hover:bg-[#6d5a43] transition-colors font-bold text-lg shadow-lg flex items-center justify-center gap-2 mx-auto"
        >
          <ICONS.Map className="w-5 h-5" />
          Return to Main Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
        {/* Header with Home Button */}
        <div className="flex justify-between items-center mb-4 gap-4">
            <h1 className="text-2xl font-bold text-[#d4b483]">Knowledge Check</h1>
            <button
                onClick={onRestart}
                className="flex items-center gap-2 px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-bold text-sm transition-colors shadow-sm"
                aria-label="Return to main menu"
            >
                <ICONS.Map className="w-4 h-4" />
                Menu
            </button>
        </div>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-stone-200">
        {/* Progress Bar */}
        <div className="bg-stone-100 px-4 py-2.5 flex justify-between items-center border-b border-stone-200 gap-2">
          <span className="text-stone-700 font-bold text-sm">Question {currentIndex + 1} of {questions.length}</span>
          <div className="flex gap-1.5">
             {questions.map((_, idx) => (
                 <div
                    key={idx}
                    className={`h-2 w-5 sm:w-7 rounded-full transition-colors ${idx < currentIndex ? 'bg-[#8b7355]' : idx === currentIndex ? 'bg-yellow-500' : 'bg-stone-300'}`}
                    aria-label={`Question ${idx + 1} status`}
                 />
             ))}
          </div>
        </div>

        <div className="p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-4 leading-snug">{currentQ.question}</h3>

          <div className="space-y-2">
            {currentQ.options.map((option, idx) => {
              let btnClass = "w-full text-left p-3 rounded-lg border-2 transition-all font-bold text-sm md:text-base flex items-center justify-between group ";
              
              if (isAnswered) {
                if (idx === currentQ.correctAnswer) {
                    btnClass += "bg-green-100 border-green-600 text-green-900";
                } else if (idx === selectedOption) {
                    btnClass += "bg-red-100 border-red-600 text-red-900";
                } else {
                    btnClass += "bg-stone-50 border-stone-200 opacity-50";
                }
              } else {
                btnClass += "bg-white border-stone-300 hover:border-[#8b7355] hover:bg-stone-50 hover:shadow-md text-stone-800";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <div className="flex items-center">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-center mr-3 text-xs border-2 font-black transition-colors flex-shrink-0 ${isAnswered && idx === currentQ.correctAnswer ? 'bg-green-200 border-green-600 text-green-900' : 'bg-stone-100 border-stone-300 text-stone-600 group-hover:bg-[#8b7355] group-hover:text-white group-hover:border-[#8b7355]'}`}>
                        {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </div>

                  {isAnswered && idx === currentQ.correctAnswer && (
                      <span className="text-green-700 font-black">✓</span>
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && (
                      <span className="text-red-700 font-black">✗</span>
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="mt-4 p-4 bg-stone-100 rounded-xl border-l-4 border-[#8b7355] transition-all duration-300 shadow-inner rise-in">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full text-white flex-shrink-0 ${selectedOption === currentQ.correctAnswer ? 'bg-green-600' : 'bg-[#8b7355]'}`}>
                    {selectedOption === currentQ.correctAnswer ? <ICONS.Award className="w-5 h-5" /> : <ICONS.Info className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-stone-900 text-lg mb-1">
                      {selectedOption === currentQ.correctAnswer ? "Correct!" : "Good try!"}
                  </p>
                  <p className="text-stone-800 text-sm md:text-base leading-relaxed font-medium">{currentQ.explanation}</p>
                </div>
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={handleNext}
                  className="w-full md:w-auto px-6 py-2.5 bg-[#8b7355] text-white rounded-lg hover:bg-[#6d5a43] transition-colors shadow-lg font-bold flex items-center justify-center gap-2 ml-auto"
                >
                  {currentIndex < questions.length - 1 ? (
                      <>Next Question →</>
                  ) : (
                      <>See Results <ICONS.Award className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;