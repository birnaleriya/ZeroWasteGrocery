import React, { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const VoiceAssistant = () => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [reply, setReply] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utterance, setUtterance] = useState(null);

  const speak = (text) => {
    const newUtterance = new SpeechSynthesisUtterance(text);
    newUtterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(newUtterance);
    setUtterance(newUtterance);
    setIsSpeaking(true);
  };

  useEffect(() => {
    if (transcript && !listening) {
      fetch("http://127.0.0.1:5000/gemini-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: transcript }),
      })
        .then((res) => res.json())
        .then((data) => {
          setReply(data.reply);
          speak(data.reply);
        })
        .catch((err) => console.error("Error:", err));
    }
  }, [transcript, listening]);

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: "en-IN" });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const stopSpeaking = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="p-4 bg-slate-100 rounded-lg shadow max-w-xl mx-auto mt-6">
      <h3 className="text-lg font-bold mb-2">🎙️ Ask Zero Anything</h3>

      <div className="space-x-2">
        <button
          onClick={startListening}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Start Listening
        </button>

        <button
          onClick={stopListening}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Stop Listening
        </button>

        <button
          onClick={stopSpeaking}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Stop Speaking
        </button>
      </div>

      {transcript && (
        <div className="mt-4">
          <p><strong>You said:</strong> {transcript}</p>
        </div>
      )}

      {reply && (
        <div className="mt-4 bg-green-100 p-3 rounded border border-green-300">
          <p><strong>Zero says:</strong> {reply}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
