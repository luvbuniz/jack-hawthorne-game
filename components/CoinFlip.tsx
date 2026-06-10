import React, { useState } from 'react';
import { ChanceEvent } from '../types';
import { ICONS } from '../constants';
import { sfx } from '../services/soundService';

interface CoinFlipProps {
  chance: ChanceEvent;
  onContinue: (nextNodeId: string) => void;
}

type FlipResult = 'heads' | 'tails';

const CoinFlip: React.FC<CoinFlipProps> = ({ chance, onContinue }) => {
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<FlipResult | null>(null);

  const flip = () => {
    if (flipping || result) return;
    sfx.coin();
    setFlipping(true);
    setTimeout(() => {
      setResult(Math.random() < 0.5 ? 'heads' : 'tails');
      setFlipping(false);
    }, 1500);
  };

  const resultText = result === 'heads' ? chance.headsText : chance.tailsText;
  const nextNodeId = result === 'heads' ? chance.headsNodeId : chance.tailsNodeId;

  return (
    <div className="flex items-center gap-4">
      <div
        className={`w-16 h-16 flex-shrink-0 rounded-full flex items-center justify-center text-white shadow-lg ${
          flipping ? 'animate-spin bg-amber-500' : 'bg-amber-600'
        }`}
        aria-hidden="true"
      >
        {result && !flipping ? (
          <span className="font-black text-2xl uppercase">{result === 'heads' ? 'H' : 'T'}</span>
        ) : (
          <ICONS.Coin className="w-8 h-8" />
        )}
      </div>

      {!result ? (
        <div className="flex-1">
          <p className="text-stone-300 font-medium text-sm mb-2">
            A moment of pure chance. Will luck be on Jack's side?
          </p>
          <button
            onClick={flip}
            disabled={flipping}
            className="px-6 py-2.5 bg-[#8b7355] text-white font-bold rounded-lg hover:bg-[#a08660] transition-colors shadow-md disabled:opacity-60 flex items-center gap-2"
          >
            <ICONS.Coin className="w-5 h-5" />
            {flipping ? 'The coin spins...' : 'Flip the Coin'}
          </button>
        </div>
      ) : (
        <div className="flex-1">
          <p className="font-black text-amber-400 uppercase tracking-wide">
            {result === 'heads' ? 'Heads!' : 'Tails!'}
          </p>
          <p className="text-stone-200 font-medium text-sm mb-2">{resultText}</p>
          <button
            onClick={() => onContinue(nextNodeId)}
            className="px-6 py-2.5 bg-[#8b7355] text-white font-bold rounded-lg hover:bg-[#a08660] transition-colors shadow-md"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
};

export default CoinFlip;
