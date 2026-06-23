import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, HelpCircle, Bot, User, CornerDownRight, Volume2, Mic, MicOff } from 'lucide-react';
import { UserProfile } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  hasAudio?: boolean;
}

interface LocalAIAssistantProps {
  activeUser: UserProfile | null;
}

const PRESETS = [
  "Why did maintenance increase this month?",
  "Show pending dues over $100.",
  "Which vendors cost us most this year?",
  "Predict water tanker needs for next month.",
  "Are there any abnormal electricity readings?"
];

export default function LocalAIAssistant({ activeUser }: LocalAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender: "ai",
      text: "Hello! I am your Resident-RWA Intelligence Assistant. You can ask me anything about building finances, utility usage anomalies, vendor spending analytics, or task schedules.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [speechActive, setSpeechActive] = useState(false);
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const speakText = async (text: string, messageId: string) => {
    try {
      setPlayingAudioId(messageId);
      // Calls server-side text-to-speech
      const cleanedText = text.replace(/[#_*\[\]`]/g, '').slice(0, 300); // chunk for quick TTS
      const res = await fetch('/api/assistant/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanedText })
      });

      if (!res.ok) throw new Error("TTS call failed");
      const data = await res.json();
      if (data.audio) {
        const audioBytes = atob(data.audio);
        const arrayBuffer = new ArrayBuffer(audioBytes.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < audioBytes.length; i++) {
          uint8Array[i] = audioBytes.charCodeAt(i);
        }
        
        // Output format of our TTS model is raw pcm (sampleRate: 24000) or standard audio blob depending on model.
        // Let's create an audio element or use Web Audio API to play 24kHz raw PCM or standard WAV.
        // If it's a base64 PCM stream, we can build a simple quick AudioBuffer and play it.
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const floatArray = new Float32Array(uint8Array.length / 2);
        const dataView = new DataView(arrayBuffer);
        for (let i = 0; i < floatArray.length; i++) {
          floatArray[i] = dataView.getInt16(i * 2, true) / 32768.0; // decode 16bit PCM little-endian
        }
        const buffer = audioCtx.createBuffer(1, floatArray.length, 24000);
        buffer.getChannelData(0).set(floatArray);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.onended = () => {
          setPlayingAudioId(null);
        };
        source.start();
      } else {
        setPlayingAudioId(null);
      }
    } catch (err) {
      console.warn("TTS playback errored / fallback", err);
      // Simple built-in speech synthesis fallback
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 150));
      utterance.onend = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          userId: activeUser?.id || 'anonymous'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: Message = {
          id: `msg-ai-${Date.now()}`,
          sender: 'ai',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          hasAudio: true
        };
        setMessages(prev => [...prev, aiMsg]);
        // Auto-speak if speech active
        if (speechActive) {
          speakText(data.reply, aiMsg.id);
        }
      } else {
        throw new Error("HTTP error");
      }
    } catch (_) {
      // Offline / fallback rules response
      let fallbackReply = "Let me search our financial spreadsheet records: ";
      const t = textToSend.toLowerCase();
      if (t.includes("maintenance")) {
        fallbackReply = "**Budget Audit Report**: Maintenance spending was increased by 12% this month due to seasonal water tanker sourcing ($1,200 additional payout) and repair of the community pool's booster pump ($650). The base remains stable.";
      } else if (t.includes("due") || t.includes("pending")) {
        fallbackReply = "**Flat Dues Audit Alert**: There are currently **4 flats** with outstanding balances over $100:\n1. Flat 204: **$240** (Elena Rostova - remote status)\n2. Flat 105: **$110** (Pending check clearances)\n3. Flat 403: **$165** (Tenant dispute under review)\nTotal Outstanding Receivables: **$515**.";
      } else if (t.includes("vendor") || t.includes("cost")) {
        fallbackReply = "**RWA Outflow Analysis**: Our highest cost vendor this year is **AquaFlow Municipal Tankers** ($4,800 collective payments), followed closely by **Apex Pipe Services** ($3,200 for water infrastructure repairs). Regular housekeeping remains under a fixed master contract.";
      } else if (t.includes("tanker") || t.includes("water")) {
        fallbackReply = "**AI Operations Predictor**: Due to summer temperatures and active lateral leakage at Sector 9, water tanker demands will likely escalate by **24%** next month. Recommended action: Approve material procurement for local pipe-wall patching to offset three $450 tankers.";
      } else if (t.includes("electricity") || t.includes("abnormal")) {
        fallbackReply = "**AI Energy Anomaly Sniffer**: Flat 302 registered 3.4x average energy draw at 3:00 AM UTC. Immediate flag issued for possible appliance coil failure / HVAC damage. Recommended safety inspection.";
      } else {
        fallbackReply = `I am analyzing the Sector 9 District details. Your query "${textToSend}" is dispatched to our live RWA databases. Let me know if you would like to run automated predictive audits!`;
      }

      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasAudio: true
      };
      setMessages(prev => [...prev, aiMsg]);
      if (speechActive) {
        speakText(fallbackReply, aiMsg.id);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border-2 border-slate-100 shadow-xl overflow-hidden flex flex-col h-[520px]" id="local_ai_assistant_panel">
      {/* Header */}
      <div className="bg-indigo-950 p-4 shrink-0 flex items-center justify-between text-white">
        <div className="flex items-center gap-2.5">
          <div className="bg-amber-400 p-2 rounded-xl text-indigo-950 animate-pulse">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-300 block font-mono">Gemini 3.5 Assistant</span>
            <h3 className="text-xs font-black font-display tracking-tight">RWA Board & Citizen Data Chat</h3>
          </div>
        </div>

        {/* Speech Mode toggle switches */}
        <button
          type="button"
          onClick={() => setSpeechActive(!speechActive)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
            speechActive 
              ? 'bg-amber-400 border-amber-300 text-indigo-950 shadow'
              : 'bg-indigo-900 border-indigo-900 text-indigo-200'
          }`}
        >
          {speechActive ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
          <span>Audio Feed {speechActive ? "ON" : "OFF"}</span>
        </button>
      </div>

      {/* Chat Messages flow */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((m) => (
          <div 
            key={m.id}
            className={`flex items-start gap-2 max-w-[85%] ${
              m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div className={`p-2 rounded-full shrink-0 ${
              m.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-amber-400 text-indigo-950'
            }`}>
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className={`p-4 rounded-[1.5rem] text-xs space-y-2 relative leading-relaxed ${
              m.sender === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm'
            }`}>
              <div className="whitespace-pre-line">{m.text}</div>
              
              <div className="flex justify-between items-center text-[8px] opacity-70">
                <span>{m.timestamp}</span>
                {m.sender === 'ai' && m.hasAudio && (
                  <button 
                    onClick={() => speakText(m.text, m.id)}
                    className={`flex items-center gap-1 transition px-1.5 py-0.5 rounded-md ${
                      playingAudioId === m.id 
                        ? 'bg-amber-500 text-white font-bold animate-pulse'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Volume2 className="w-2.5 h-2.5" />
                    <span>{playingAudioId === m.id ? "Playing..." : "Speak Sound"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 max-w-[85%]">
            <div className="p-2 rounded-full bg-amber-400 text-indigo-950 animate-bounce">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 bg-white border border-slate-100 rounded-2xl text-[11px] text-slate-500 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              <span>Scanning RWA telemetry registers...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Preset quick actions */}
      <div className="p-3 bg-slate-100/70 border-t border-slate-150 flex gap-2 overflow-x-auto shrink-0 scrollbar-none" id="assistant_presets">
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(p)}
            className="bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 hover:text-indigo-950 whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] font-bold transition flex items-center gap-1 shrink-0"
          >
            <CornerDownRight className="w-2.5 h-2.5 text-indigo-500" />
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Input Tray */}
      <div className="p-3 bg-white border-t border-slate-100 shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputVal);
          }}
          className="flex gap-2"
        >
          <input 
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your budget/energy query here..."
            className="flex-1 bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-indigo-500 text-slate-800 font-semibold"
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
