import { useState, useEffect, useRef } from 'react';

export const useSpeechToText = (onTranscript) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if the browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition|| window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false; // Stops automatically when they stop talking
    recognitionRef.current.interimResults = true; // Shows words as they speak

    recognitionRef.current.onresult = (event) => {
      // Combine the spoken words into a single string
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      onTranscript(transcript);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Microphone error:", event.error);
      setIsListening(false);
    };
  }, [onTranscript]);

  const toggleListening = () => {
    if (!isSupported) {
      alert("Your browser does not support voice search.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return { isListening, toggleListening, isSupported };
};