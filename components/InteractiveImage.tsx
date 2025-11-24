import React, { useState, useEffect } from 'react';
import { Hotspot } from '../types';
import { ICONS, PLACEHOLDER_IMAGE } from '../constants';
import { generateStoryImage } from '../services/geminiService';

interface InteractiveImageProps {
  nodeId: string;
  prompt: string;
  hotspots?: Hotspot[];
}

const InteractiveImage: React.FC<InteractiveImageProps> = ({ nodeId, prompt, hotspots }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      // Check if we have a cached image in session storage to save API calls
      const cached = sessionStorage.getItem(`img_${nodeId}`);
      if (cached) {
        setImageUrl(cached);
        return;
      }

      setLoading(true);
      const generated = await generateStoryImage(prompt);
      if (isMounted) {
        if (generated) {
          setImageUrl(generated);
          try {
             sessionStorage.setItem(`img_${nodeId}`, generated);
          } catch(e) {
             console.warn("Storage full, cannot cache image");
          }
        } else {
          // Fallback if API fails or no key
          setImageUrl(PLACEHOLDER_IMAGE);
        }
        setLoading(false);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [nodeId, prompt]);

  return (
    <div className="relative w-full h-full bg-neutral-900 overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#eaddcf] z-10">
          <div className="flex flex-col items-center">
             <ICONS.Feather className="w-16 h-16 text-[#8b7355] animate-bounce" />
             <p className="mt-4 font-sans text-xl font-bold text-[#5c4d3c]">Painting Scene...</p>
          </div>
        </div>
      )}
      
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Scene illustration" 
          className="w-full h-full object-cover animate-in fade-in duration-1000"
        />
      )}

      {/* Hotspots Layer */}
      {!loading && hotspots && hotspots.map((spot) => (
        <button
          key={spot.id}
          onClick={() => setSelectedHotspot(spot)}
          style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none focus:ring-4 focus:ring-blue-500 rounded-full"
          aria-label={`Explore ${spot.label}`}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-50 animate-ping"></div>
            <div className="relative bg-yellow-500 text-white p-3 rounded-full shadow-lg border-2 border-white hover:bg-yellow-600 transition-colors cursor-pointer">
              <ICONS.Search className="w-6 h-6" />
            </div>
            {/* Tooltip on Hover */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-3 py-2 bg-black text-white text-sm font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {spot.label}
            </div>
          </div>
        </button>
      ))}

      {/* Info Modal/Overlay */}
      {selectedHotspot && (
        <div className="absolute inset-0 bg-black/80 z-30 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-lg max-w-lg shadow-2xl border-4 border-[#8b7355] relative">
            <button 
              onClick={() => setSelectedHotspot(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black p-2 bg-gray-100 rounded-full"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex items-center gap-3 mb-4 border-b pb-2">
              <ICONS.Book className="w-8 h-8 text-[#8b7355]" />
              <h3 className="text-2xl font-bold text-black">{selectedHotspot.label}</h3>
            </div>
            <p className="text-gray-800 leading-relaxed text-lg lg:text-xl">
              {selectedHotspot.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveImage;