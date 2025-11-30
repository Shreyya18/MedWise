"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LanguagePage() {
  const router = useRouter();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const prompts = [
    { lang: "en-US", text: "Press 1 for English, press 2 for Kannada, press 3 for Hindi." },
    { lang: "kn-IN", text: "ಇಂಗ್ಲಿಷ್‌ಗಾಗಿ 1 ಒತ್ತಿರಿ, ಕನ್ನಡಕ್ಕಾಗಿ 2 ಒತ್ತಿರಿ, ಹಿಂದಿಗಾಗಿ 3 ಒತ್ತಿರಿ." },
    { lang: "hi-IN", text: "अंग्रेज़ी के लिए 1 दबाएं, कन्नड़ के लिए 2 दबाएं, हिंदी के लिए 3 दबाएं।" },
  ];

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      console.log("Available voices:", availableVoices);
      setVoices(availableVoices);

      // Pick a consistent voice (prefer Google or a clear one)
      const googleVoice =
        availableVoices.find((v) => v.name.includes("Google हिन्दी")) ||
        availableVoices.find((v) => v.lang === "hi-IN") ||
        availableVoices[0];

      setSelectedVoice(googleVoice || null);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Speak using selected voice
  const speak = (text: string, lang: string) => {
    if (!selectedVoice) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = selectedVoice;
    utter.lang = lang; // only for correct pronunciation
    utter.rate = 1;
    utter.pitch = 1;

    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    if (!selectedVoice) return;

    const speakAll = () => {
      let delay = 0;
      prompts.forEach((p) => {
        setTimeout(() => speak(p.text, p.lang), delay);
        delay += 5000; // more natural
      });
    };

    speakAll();
    const interval = setInterval(speakAll, 16000); // repeat

    return () => {
      clearInterval(interval);
      speechSynthesis.cancel();
    };
  }, [selectedVoice]);

  const chooseLanguage = (value: string) => {
  // Fully stop any speaking instantly
  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.pause();
    window.speechSynthesis.resume(); // flush queued voices
  } catch (e) {
    console.log("Voice stop error:", e);
  }

  localStorage.setItem("app-lang", value);
  router.push("/input-method");
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-3xl font-bold mb-6">Select Language</h1>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button onClick={() => chooseLanguage("en")} className="py-3 bg-blue-600 text-white rounded-lg">
          English
        </button>
        <button onClick={() => chooseLanguage("kn")} className="py-3 bg-green-600 text-white rounded-lg">
          ಕನ್ನಡ (Kannada)
        </button>
        <button onClick={() => chooseLanguage("hi")} className="py-3 bg-red-500 text-white rounded-lg">
          हिंदी (Hindi)
        </button>
      </div>
    </div>
  );
}
