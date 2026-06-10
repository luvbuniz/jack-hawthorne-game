import React, { useState } from 'react';
import { ChanceEvent } from '../types';
import { ICONS } from '../constants';

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
    setFlipping(true);
    setTimeout(() => {
      setResult(Math.random() < 0.5 ? 'heads' : 'tails');
      setFlipping(false);
    }, 1500);
  };

  const resultText = result === 'heads' ? chance.headsText : chance.tailsText;
  const nextNodeId = result === 'heads' ? chance.headsNodeId : chance.tailsNodeId;

  return (
    <div className="bg-stone-100 p-8 rounded-xl border-2 border-stone-200 text-center">
      <h3 className="font-bold text-stone-500 uppercase tracking-widest text-sm mb-6">A Moment of Pure Chance</h3>

      <div className="flex justify-center mb-6">
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-lg transition-transform ${
            flipping ? 'animate-spin bg-amber-500' : result ? 'bg-amber-600' : 'bg-amber-500'
          }`}
          aria-hidden="true"
        >
          {result && !flipping ? (
            <span className="font-black text-xl uppercase">{result === 'heads' ? 'H' : 'T'}</span>
          ) : (
            <ICONS.Coin className="w-12 h-12" />
          )}
        </div>
      </div>

      {!result ? (
        <>
          <p className="text-stone-700 font-medium text-lg mb-6">
            Will luck be on Jack's side? There's only one way to find out.
          </p>
          <button
            onClick={flip}
            disabled={flipping}
            className="px-10 py-4 bg-[#8b7355] text-white font-bold text-xl rounded-lg hover:bg-[#705c42] transition-colors shadow-md disabled:opacity-60 flex items-center justify-center gap-2 mx-auto"
          >
            <ICONS.Coin className="w-6 h-6" />
            {flipping ? 'The coin spins...' : 'Flip the Coin'}
          </button>
        </>
      ) : (
        <>
          <p className="text-2xl font-black text-stone-900 mb-2 uppercase tracking-wide">
            {result === 'heads' ? 'Heads!' : 'Tails!'}
          </p>
          <p className="text-stone-700 font-medium text-lg mb-6">{resultText}</p>
          <button
            onClick={() => onContinue(nextNodeId)}
            className="px-10 py-4 bg-[#8b7355] text-white font-bold text-xl rounded-lg hover:bg-[#705c42] transition-colors shadow-md mx-auto"
          >
            Continue →
          </button>
        </>
      )}
    </div>
  );
};

export default CoinFlip;
