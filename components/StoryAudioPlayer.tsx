import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../constants';
import { generateStorySpeech } from '../services/geminiService';

interface StoryAudioPlayerProps {
  text: string;
  nodeId: string;
  autoPlay?: boolean;
}

// PCM Decode Helpers (for Gemini-generated narration)
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

// Pick the most storybook-appropriate browser voice available:
// prefer British English, then any English voice.
function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  return (
    voices.find(v => /en-GB/i.test(v.lang) && /daniel|arthur|george|male/i.test(v.name)) ||
    voices.find(v => /en-GB/i.test(v.lang)) ||
    voices.find(v => /^en/i.test(v.lang)) ||
    null
  );
}

const StoryAudioPlayer: React.FC<StoryAudioPlayerProps> = ({ text, nodeId, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const isMountedRef = useRef(true);

  // Browser voices load asynchronously; warm them up so pickVoice works
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const warm = () => window.speechSynthesis.getVoices();
    warm();
    window.speechSynthesis.addEventListener('voiceschanged', warm);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', warm);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    if (autoPlay) {
      playAudio();
    }
    return () => {
      isMountedRef.current = false;
      stopAudio();
      audioBufferRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  // Fallback narration using the browser's built-in speech synthesis,
  // so the game is fully playable without a Gemini API key.
  const playWithBrowserTTS = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return false;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => {
      if (isMountedRef.current) setIsPlaying(false);
    };
    utterance.onerror = () => {
      if (isMountedRef.current) setIsPlaying(false);
    };
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    return true;
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
        } else if (isMountedRef.current) {
            // No API key or generation failed — use the browser's voice instead
            playWithBrowserTTS();
            return;
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

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="w-9 h-9 flex items-center justify-center bg-[#8b7355] text-white rounded-full hover:bg-[#a08660] transition-colors disabled:opacity-50 flex-shrink-0 shadow"
      aria-label={isPlaying ? "Stop narration" : "Play narration"}
      title={isPlaying ? "Stop narration" : "Listen to this scene"}
    >
      {loading ? (
          <ICONS.Loader className="w-4 h-4 animate-spin" />
      ) : isPlaying ? (
          <ICONS.Stop className="w-4 h-4 fill-current" />
      ) : (
          <ICONS.Volume className="w-4 h-4" />
      )}
    </button>
  );
};

export default StoryAudioPlayer;
