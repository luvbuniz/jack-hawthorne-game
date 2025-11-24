import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { ICONS } from '../constants';

interface QuizProps {
  questions: QuizQuestion[];
  onRestart: () => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onRestart }) => {
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
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
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
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-xl border-4 border-[#8b7355] text-center mt-10 animate-in fade-in duration-500">
        <RewardIcon className={`w-32 h-32 mx-auto mb-6 ${reward.color}`} />
        <h2 className="text-4xl font-bold text-stone-900 mb-4">Quiz Complete!</h2>
        <p className="text-2xl mb-8 font-bold text-stone-700">You scored {score} out of {questions.length}</p>
        
        <div className="bg-stone-50 p-6 rounded-xl mb-8 border-2 border-stone-200">
             <h3 className="text-xl font-bold text-stone-800 mb-2 uppercase tracking-wide">Reward Earned</h3>
             <p className={`text-3xl font-black ${reward.color}`}>{reward.text}</p>
             <p className="mt-4 text-stone-600 font-medium text-lg">
               {score === questions.length ? "Perfect score! You are a true scholar of history." : "Great effort! History is full of lessons to learn."}
             </p>
        </div>

        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-8 py-4 bg-[#8b7355] text-white rounded-lg hover:bg-[#6d5a43] transition-colors font-bold text-xl shadow-lg flex items-center justify-center gap-2 mx-auto"
        >
          <ICONS.Map className="w-6 h-6" />
          Return to Home Page
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
        {/* Header with Home Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-[#8b7355]">Knowledge Check</h1>
            <button 
                onClick={onRestart}
                className="flex items-center gap-2 px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-bold transition-colors shadow-sm"
                aria-label="Return to Home"
            >
                <ICONS.Map className="w-5 h-5" />
                Home
            </button>
        </div>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-stone-200">
        {/* Progress Bar */}
        <div className="bg-stone-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-b border-stone-200 gap-2">
          <span className="text-stone-700 font-bold text-lg">Question {currentIndex + 1} of {questions.length}</span>
          <div className="flex gap-2">
             {questions.map((_, idx) => (
                 <div 
                    key={idx} 
                    className={`h-3 w-10 rounded-full transition-colors ${idx < currentIndex ? 'bg-[#8b7355]' : idx === currentIndex ? 'bg-yellow-500' : 'bg-stone-300'}`} 
                    aria-label={`Question ${idx + 1} status`}
                 />
             ))}
          </div>
        </div>
        
        <div className="p-6 md:p-10">
          <h3 className="text-2xl md:text-3xl font-bold text-stone-900 mb-8 leading-snug">{currentQ.question}</h3>
          
          <div className="space-y-4">
            {currentQ.options.map((option, idx) => {
              let btnClass = "w-full text-left p-5 rounded-lg border-2 transition-all font-bold text-lg flex items-center justify-between group ";
              
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
                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-center mr-4 text-sm border-2 font-black transition-colors ${isAnswered && idx === currentQ.correctAnswer ? 'bg-green-200 border-green-600 text-green-900' : 'bg-stone-100 border-stone-300 text-stone-600 group-hover:bg-[#8b7355] group-hover:text-white group-hover:border-[#8b7355]'}`}>
                        {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </div>
                  
                  {isAnswered && idx === currentQ.correctAnswer && (
                      <span className="text-green-700 font-black text-xl">✓</span>
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && (
                      <span className="text-red-700 font-black text-xl">✗</span>
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="mt-8 p-6 bg-stone-100 rounded-xl border-l-8 border-[#8b7355] animate-in fade-in slide-in-from-bottom-4 shadow-inner">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className={`p-3 rounded-full text-white mt-1 flex-shrink-0 ${selectedOption === currentQ.correctAnswer ? 'bg-green-600' : 'bg-[#8b7355]'}`}>
                    {selectedOption === currentQ.correctAnswer ? <ICONS.Award className="w-8 h-8" /> : <ICONS.Info className="w-8 h-8" />}
                </div>
                <div>
                  <p className="font-bold text-stone-900 text-2xl mb-2">
                      {selectedOption === currentQ.correctAnswer ? "Correct!" : "Good try!"}
                  </p>
                  <p className="text-stone-800 text-lg leading-relaxed font-medium">{currentQ.explanation}</p>
                </div>
              </div>
              <div className="mt-8 text-right">
                <button
                  onClick={handleNext}
                  className="w-full md:w-auto px-8 py-4 bg-[#8b7355] text-white rounded-lg hover:bg-[#6d5a43] transition-colors shadow-lg font-bold text-xl flex items-center justify-center gap-2 ml-auto"
                >
                  {currentIndex < questions.length - 1 ? (
                      <>Next Question <span className="text-2xl">→</span></>
                  ) : (
                      <>See Results <ICONS.Award className="w-6 h-6" /></>
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