"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function InputMethodPage() {
  const router = useRouter();
  const [lang, setLang] = useState<string | null>(null);

  // Language-based instructions
  const instructions: Record<string, string> = {
    en: "Press 1 for image input. Press 2 to type the medicine name. Press 3 for voice input.",
    kn: "ಚಿತ್ರ ಇನ್‌ಪುಟ್‌ಗಾಗಿ 1 ಒತ್ತಿರಿ. ಮೆಡಿಸಿನ್ ಹೆಸರನ್ನು ಟೈಪ್ ಮಾಡಲು 2 ಒತ್ತಿರಿ. ವಾಯ್ಸ್ ಇನ್‌ಪುಟ್‌ಗಾಗಿ 3 ಒತ್ತಿರಿ.",
    hi: "इमेज इनपुट के लिए 1 दबाएँ। दवा का नाम टाइप करने के लिए 2 दबाएँ। वॉइस इनपुट के लिए 3 दबाएँ।",
  };
function getVoiceForLang(lang: string) {
  const voices = window.speechSynthesis.getVoices();

  if (lang === "en") {
    return voices.find(v => v.name === "Google US English") ||
           voices.find(v => v.lang === "en-US");
  }

  if (lang === "hi") {
    return voices.find(v => v.name === "Google हिन्दी") ||
           voices.find(v => v.lang === "hi-IN");
  }

  if (lang === "kn") {
    // No Kannada voice available → choose closest (Hindi)
    return voices.find(v => v.name === "Google हिन्दी") ||
           voices.find(v => v.lang === "hi-IN");
  }

  return voices[0]; // fallback
}

  useEffect(() => {
    window.speechSynthesis.cancel();
    const storedLang = localStorage.getItem("app-lang") || "en";
    setLang(storedLang);

    // Voice instruction
    const speakInstruction = () => {
  const voice = getVoiceForLang(storedLang);

  const utter = new SpeechSynthesisUtterance(instructions[storedLang]);

  // Set correct language code
  if (storedLang === "en") utter.lang = "en-US";
  if (storedLang === "hi") utter.lang = "hi-IN";
  if (storedLang === "kn") utter.lang = "kn-IN"; // Kannada text

  // Assign the selected voice
  if (voice) utter.voice = voice;

  utter.rate = 1;
  utter.pitch = 1;

  window.speechSynthesis.speak(utter);
};


    speakInstruction();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const goTo = (path: string) => {
    window.speechSynthesis.cancel();
    router.push(path);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-3xl font-bold mb-6">Choose Input Method</h1>

      <p className="mb-8 text-lg opacity-80">
        {lang ? instructions[lang] : "Loading..."}
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => goTo("/scan")}
          className="py-3 bg-blue-600 text-white rounded-lg"
        >
          Image Input
        </button>

        <button
          onClick={() => goTo("/text")}
          className="py-3 bg-green-600 text-white rounded-lg"
        >
          Type Input
        </button>

        <button
          onClick={() => goTo("/voice")}
          className="py-3 bg-red-500 text-white rounded-lg"
        >
          Voice Input
        </button>
      </div>
    </div>
  );
}
