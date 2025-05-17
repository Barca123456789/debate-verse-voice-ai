
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface VoiceRecognitionOptions {
  onFinalTranscript?: (transcript: string) => void;
  onError?: (error: any) => void;
}

export function useVoiceRecognition(options: VoiceRecognitionOptions = {}) {
  const [recognition, setRecognition] = useState<any | null>(null);
  const [isMicActive, setIsMicActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Web Speech API if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
          
        if (event.results[0].isFinal && transcript.trim().length > 0) {
          options.onFinalTranscript?.(transcript);
        }
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error", event);
        options.onError?.(event);
        if (isMicActive) {
          toast({
            title: "Speech Recognition Error",
            description: "There was a problem with the speech recognition. Please try again.",
            variant: "destructive",
          });
          setIsMicActive(false);
        }
      };
      
      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "Browser Not Supported",
        description: "Your browser doesn't support speech recognition. Please try a different browser.",
        variant: "destructive",
      });
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [options.onFinalTranscript, options.onError]);
  
  const toggleMicrophone = async () => {
    if (!recognition) return;
    
    if (!isMicActive) {
      try {
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Start speech recognition
        recognition.start();
        setIsMicActive(true);
        
        toast({
          title: "Microphone Activated",
          description: "You are now speaking. Your voice will be transcribed.",
        });
        
        return true;
      } catch (error) {
        console.error("Error accessing microphone:", error);
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access to participate.",
          variant: "destructive",
        });
        
        return false;
      }
    } else {
      // Stop speech recognition
      recognition.stop();
      setIsMicActive(false);
      
      toast({
        title: "Microphone Deactivated",
        description: "You have stopped speaking.",
      });
      
      return true;
    }
  };

  return {
    recognition,
    isMicActive,
    toggleMicrophone,
    setIsMicActive,
  };
}
