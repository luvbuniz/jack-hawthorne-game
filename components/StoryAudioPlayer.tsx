import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../constants';
import { generateStorySpeech } from '../services/geminiService';

interface StoryAudioPlayerProps {
  text: string;
  nodeId: string;
}

// PCM Decode Helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const StoryAudioPlayer: React.FC<StoryAudioPlayerProps> = ({ text, nodeId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopAudio();
      // Reset buffer when node changes
      audioBufferRef.current = null;
    };
  }, [nodeId]);

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch (e) {
        // Ignore errors if already stopped
      }
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const playAudio = async () => {
    setLoading(true);

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      let buffer = audioBufferRef.current;

      if (!buffer) {
        // Check cache
        const cachedBase64 = sessionStorage.getItem(`audio_${nodeId}`);
        let base64Data = cachedBase64;

        if (!base64Data) {
          base64Data = await generateStorySpeech(text);
          if (base64Data) {
            try {
              sessionStorage.setItem(`audio_${nodeId}`, base64Data);
            } catch (e) {
              console.warn("Storage full");
            }
          }
        }

        if (base64Data && isMountedRef.current) {
            const bytes = decode(base64Data);
            buffer = await decodeAudioData(bytes, audioContextRef.current, 24000, 1);
            audioBufferRef.current = buffer;
        }
      }

      if (buffer && isMountedRef.current) {
        stopAudio(); // Ensure any previous is stopped
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => {
             if (isMountedRef.current) setIsPlaying(false);
        };
        sourceNodeRef.current = source;
        source.start();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Playback error", error);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const handleToggle = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  };

  return (
    <div className="flex items-center gap-3 my-4 p-3 bg-[#eaddcf] rounded-lg border border-[#d4c5b0] w-fit shadow-sm">
      <button 
        onClick={handleToggle}
        disabled={loading}
        className="w-10 h-10 flex items-center justify-center bg-[#8b7355] text-white rounded-full hover:bg-[#6d5a43] transition-colors disabled:opacity-50"
        aria-label={isPlaying ? "Stop narration" : "Play narration"}
      >
        {loading ? (
            <ICONS.Loader className="w-5 h-5 animate-spin" />
        ) : isPlaying ? (
            <ICONS.Stop className="w-5 h-5 fill-current" />
        ) : (
            <ICONS.Volume className="w-5 h-5" />
        )}
      </button>
      <span className="text-[#5c4d3c] font-bold font-serif text-sm uppercase tracking-wide">
        {loading ? 'Generating Narration...' : isPlaying ? 'Listen' : 'Listen to Story'}
      </span>
    </div>
  );
};

export default StoryAudioPlayer;