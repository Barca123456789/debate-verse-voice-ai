
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseAudioSpeechOptions {
  onSpeechEnd?: () => void;
}

export function useAudioSpeech(options: UseAudioSpeechOptions = {}) {
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [interruptAI, setInterruptAI] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up audio element
    if (!audioRef.current) {
      const audioElement = new Audio();
      audioElement.addEventListener('ended', () => {
        setIsAISpeaking(false);
        setInterruptAI(false);
        options.onSpeechEnd?.();
      });
      audioRef.current = audioElement;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', options.onSpeechEnd || (() => {}));
      }
    };
  }, [options.onSpeechEnd]);

  const handleSpeech = async (text: string, apiKey?: string) => {
    if (!audioRef.current || interruptAI) return;
    
    setLoadingVoice(true);
    setIsAISpeaking(true);
    
    try {
      // For now, we'll use the browser's speech synthesis
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1; // Slightly faster for more interactive debate
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      window.speechSynthesis.speak(utterance);
      
      utterance.onend = () => {
        setIsAISpeaking(false);
        setLoadingVoice(false);
        setInterruptAI(false);
        options.onSpeechEnd?.();
      };
      
      return true;
    } catch (error) {
      console.error("Error generating speech:", error);
      toast({
        title: "Speech Generation Error",
        description: "There was a problem generating the speech.",
        variant: "destructive",
      });
      setIsAISpeaking(false);
      setLoadingVoice(false);
      
      return false;
    }
  };

  const stopSpeech = () => {
    if (audioRef.current && isAISpeaking) {
      audioRef.current.pause();
      window.speechSynthesis.cancel();
      setIsAISpeaking(false);
      setLoadingVoice(false);
      setInterruptAI(true);
      return true;
    }
    return false;
  };

  return {
    isAISpeaking,
    loadingVoice,
    interruptAI,
    handleSpeech,
    stopSpeech,
    setIsAISpeaking,
    setLoadingVoice,
    setInterruptAI,
  };
}
