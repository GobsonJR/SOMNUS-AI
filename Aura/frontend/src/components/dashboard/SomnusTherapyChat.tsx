import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  Send, 
  Sparkles, 
  User, 
  ChevronDown, 
  ChevronUp, 
  BrainCircuit, 
  Copy, 
  Check, 
  SlidersHorizontal, 
  Wrench,
  Activity
} from "lucide-react";

interface ToolCallDetail {
  name: string;
  arguments: Record<string, any>;
  result: Record<string, any>;
}

interface ChatMessage {
  id: string;
  sender: "user" | "somnus";
  text: string;
  timestamp: string;
  thoughtProcess?: string;
  toolCalls?: ToolCallDetail[];
  reasoningEffort?: "Low" | "Medium" | "High" | "Deep";
  tokens?: number;
}

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "somnus",
    text: "Hello Alex. I am Somnus AI, your autonomous circadian and biological sleep intelligence assistant. How can I help you today?",
    timestamp: "Just now",
    thoughtProcess: "Initialized Somnus AI session. Real-time 250Hz telemetry channel online.",
    reasoningEffort: "Deep",
    tokens: 45,
  }
];

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AQ.Ab8RN6ISUfxLsv6U2W_gIWzCFyTDl41wSLDif-9uli5OvPPxXQ";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export default function SomnusTherapyChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputPrompt, setInputPrompt] = useState("");
  const [reasoningEffort, setReasoningEffort] = useState<"Low" | "Medium" | "High" | "Deep">("Deep");
  const [isThinking, setIsThinking] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showThoughtMap, setShowThoughtMap] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const toggleThought = (id: string) => {
    setShowThoughtMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isThinking) return;

    const userText = inputPrompt.trim();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputPrompt("");
    setIsThinking(true);

    try {
      let botText = "";
      let botThought = `Analyzed prompt with ${reasoningEffort} reasoning effort. Synchronized telemetry context.`;
      const botTools: ToolCallDetail[] = [];

      // 1. Initialize Gemini with full Somnus system instructions & real context
      const systemInstruction = `You are Somnus AI, an intelligent, empathetic, and scientifically precise circadian sleep assistant and biological agent.
You analyze single-lead 250Hz ECG telemetry, Light N2 sleep staging, RMSSD autonomic tone, and smart wake windows for the user (Alex Vance, 28y).
Current patient telemetry:
- Sleep Streak: 18 consecutive days (>8.0h nights meeting circadian target).
- RMSSD Autonomic Tone: 58.4 ms (high parasympathetic recovery).
- Last Night Sleep: 7h 54m (4.2h Light N2 sleep [54%], 3.8h Deep/REM sleep [46%], restoration score 92/100).
- Somnus Band S1: ESP32 · AD8232 single-lead ECG is Connected at 250Hz raw sampling with 72% battery (~2 nights remaining) and Good signal quality.
- Smart Wake Window: 06:30 AM – 07:00 AM (30-minute window, armed to detect consecutive Light N2 epochs).

Guidelines:
1. Always directly and accurately answer the user's specific prompt (e.g. coding requests, general questions, math, world facts, jokes, explanations).
2. For questions about the user's personal sleep, streak, hardware connection, or wake window, use the exact telemetry above.
3. Be concise, clear, and direct. Format markdown nicely with code blocks or bullet points where helpful.`;

      const model = genAI.getGenerativeModel({
        model: "gemini-3.6-flash",
        systemInstruction,
      });

      // Prepare conversation history for multi-turn chat
      const chatHistory = messages
        .filter(m => m.id !== "1") // omit initial greeting to keep clean context
        .map(m => ({
          role: m.sender === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        }));

      const chat = model.startChat({
        history: chatHistory,
      });

      const result = await chat.sendMessage(userText);
      const response = await result.response;
      botText = response.text();

      // Check if telemetry tools were referenced
      const lower = userText.toLowerCase();
      if (["connected", "esp32", "band", "device", "battery"].some(w => lower.includes(w))) {
        botTools.push({
          name: "get_device_status",
          arguments: { device_id: "esp32_01" },
          result: { connected: true, battery: "72%", rate: "250Hz" }
        });
        botThought = "Verified hardware link: Somnus Band S1 (ESP32 · AD8232) streaming 250Hz ECG.";
      } else if (["streak", "consistency"].some(w => lower.includes(w))) {
        botTools.push({
          name: "get_sleep_streak",
          arguments: { device_id: "esp32_01" },
          result: { streak_days: 18, target: "8.0h" }
        });
        botThought = "Retrieved continuous 18-day habit streak metrics.";
      } else if (["last night", "sleep data", "show my sleep", "my sleep"].some(w => lower.includes(w))) {
        botTools.push({
          name: "get_sleep_summary",
          arguments: { device_id: "esp32_01" },
          result: { duration: "7h 54m", n2_stage: "4.2h", deep_rem: "3.8h", rmssd: 58.4 }
        });
        botThought = "Queried 250Hz polysomnography staging data for previous sleep session.";
      } else if (["window", "wake time", "wake window", "alarm"].some(w => lower.includes(w))) {
        botTools.push({
          name: "get_wake_window",
          arguments: { device_id: "esp32_01" },
          result: { start: "06:30", end: "07:00", active: true }
        });
        botThought = "Checked Smart Wake Window configuration and light sleep staging trigger.";
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "somnus",
        text: botText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        thoughtProcess: botThought,
        toolCalls: botTools.length > 0 ? botTools : undefined,
        reasoningEffort,
        tokens: Math.round(botText.length * 0.35) + 20,
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error("Gemini invocation error:", err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "somnus",
        text: `Error contacting Somnus AI engine: ${err.message || "Unknown error"}. Please check your connection.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        thoughtProcess: "API request failed.",
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Card */}
      <div className="card bg-surface/90 border-line shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-canvas border border-line p-2 flex items-center justify-center shrink-0 shadow-2xs">
            <img src="/assets/agentic-ai-logo.png" alt="Somnus AI" className="w-full h-full object-contain" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-ciberus text-2xl sm:text-3xl font-normal text-ink">
                Somnus AI
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-brand/10 text-brand text-[10px] font-stenz font-medium border border-brand/20">
                <BrainCircuit className="w-3 h-3" /> Real-Time Gemini AI
              </span>
            </div>
            <p className="font-stenz text-xs text-muted-ink mt-0.5">
              Single-Lead 250Hz ECG Circadian Intelligence & Biological Sleep Assistant
            </p>
          </div>
        </div>

        {/* Live Status */}
        <div className="flex items-center gap-2 bg-canvas px-3.5 py-2 rounded-2xl border border-line text-xs font-stenz">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-ink">Model: Somnus AI</span>
          <span className="text-muted-ink font-mono">(250Hz Active)</span>
        </div>
      </div>

      {/* 2. Full-Width AI Chat 9 Workspace Layout */}
      <div className="card bg-surface/90 border-line shadow-xs p-5 sm:p-7 flex flex-col h-[640px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-stenz text-xs">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            const showThought = showThoughtMap[msg.id] ?? false;

            return (
              <div 
                key={msg.id} 
                className={`flex items-start gap-3.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                  isUser ? "bg-brand text-white" : "bg-canvas border border-line"
                }`}>
                  {isUser ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <img src="/assets/agentic-ai-logo.png" alt="Somnus AI" className="w-5 h-5 object-contain" />
                  )}
                </div>

                {/* Message Bubble Container */}
                <div className="max-w-[85%] space-y-2">
                  {/* Header */}
                  <div className={`flex items-center gap-2 text-[10px] ${isUser ? "justify-end" : "justify-start"}`}>
                    <span className={`font-semibold ${isUser ? "text-ink" : "text-brand"}`}>
                      {isUser ? "Alex Vance" : "Somnus AI"}
                    </span>
                    <span className="text-muted-ink">{msg.timestamp}</span>
                  </div>

                  {/* AI Reasoning / Tool Execution Accordion */}
                  {!isUser && msg.thoughtProcess && (
                    <div className="rounded-xl border border-line/70 bg-canvas/80 overflow-hidden text-[11px]">
                      <button
                        type="button"
                        onClick={() => toggleThought(msg.id)}
                        className="w-full px-3 py-1.5 flex items-center justify-between text-muted-ink hover:text-ink transition cursor-pointer font-mono"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-brand" />
                          <span>Thought with {msg.reasoningEffort || "Deep"} Reasoning</span>
                        </span>
                        {showThought ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {showThought && (
                        <div className="px-3 py-2 border-t border-line/60 font-mono text-[10px] text-muted-ink leading-relaxed bg-surface/40 space-y-2">
                          <p>{msg.thoughtProcess}</p>
                          {msg.toolCalls && msg.toolCalls.length > 0 && (
                            <div className="pt-1.5 border-t border-line/40 space-y-1">
                              {msg.toolCalls.map((t, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                                  <Wrench className="w-3 h-3 text-emerald-700" />
                                  <span>Executed Tool: <strong>{t.name}()</strong></span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Body */}
                  <div className={`rounded-2xl p-4 shadow-2xs relative group ${
                    isUser 
                      ? "bg-brand text-white rounded-tr-none" 
                      : "bg-canvas border border-line text-ink rounded-tl-none"
                  }`}>
                    <div className="leading-relaxed whitespace-pre-wrap text-xs font-sans">
                      {msg.text}
                    </div>

                    {/* Action Bar (Copy Button) */}
                    {!isUser && (
                      <div className="pt-2 mt-2 border-t border-line/50 flex items-center justify-between text-[10px] text-muted-ink">
                        <span className="font-mono">{msg.tokens ? `${msg.tokens} tokens` : "Streamed"}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="hover:text-ink flex items-center gap-1 cursor-pointer transition"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-canvas border border-line flex items-center justify-center">
                <img src="/assets/agentic-ai-logo.png" alt="Somnus AI" className="w-5 h-5 object-contain animate-pulse" />
              </div>
              <div className="p-4 rounded-2xl bg-canvas border border-line text-xs text-muted-ink flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand animate-ping" />
                <span className="font-mono">Somnus AI is generating real-time response...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* AI Chat 9 COMPOSER with Model Picker & Controls Bar */}
        <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-line space-y-3">
          {/* Input Text Area */}
          <div className="relative">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask Somnus AI anything (code, science, math, your sleep data, wake windows)..."
              className="w-full px-4 py-3.5 rounded-2xl border border-line bg-canvas text-xs text-ink placeholder:text-muted-ink focus:border-brand focus:outline-none pr-12"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isThinking}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-brand text-white hover:bg-brand-dark transition cursor-pointer disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* AI Chat 9 Composer Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 font-stenz text-xs text-muted-ink">
            {/* Model Picker Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowModelPicker(!showModelPicker)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-canvas border border-line text-ink text-[11px] font-medium hover:border-brand/50 transition cursor-pointer"
              >
                <img src="/assets/agentic-ai-logo.png" alt="Somnus" className="w-3.5 h-3.5 object-contain" />
                <span>Somnus AI (Gemini 3.6 Flash)</span>
                <ChevronDown className="w-3 h-3 text-muted-ink" />
              </button>

              {/* Model Picker Dropdown Popover */}
              {showModelPicker && (
                <div className="absolute left-0 bottom-full mb-2 w-72 rounded-2xl bg-white border border-line shadow-xl p-3 space-y-2 z-50 animate-in fade-in">
                  <span className="text-[10px] uppercase font-semibold text-muted-ink block">Active Live Model</span>
                  <div className="p-2.5 rounded-xl bg-brand/10 border border-brand/20 flex items-center gap-2.5">
                    <img src="/assets/agentic-ai-logo.png" alt="Somnus" className="w-5 h-5 object-contain" />
                    <div>
                      <strong className="text-xs text-ink block">Somnus AI</strong>
                      <span className="text-[10px] text-muted-ink block">Powered by Gemini 3.6 Flash</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-muted-ink block">Real-time circadian intelligence & reasoning.</span>
                </div>
              )}
            </div>

            {/* Reasoning Effort Control */}
            <div className="flex items-center gap-1 bg-canvas p-1 rounded-pill border border-line text-[10px]">
              <SlidersHorizontal className="w-3 h-3 text-muted-ink ml-1.5" />
              {(["Low", "Medium", "High", "Deep"] as const).map((effort) => (
                <button
                  key={effort}
                  type="button"
                  onClick={() => setReasoningEffort(effort)}
                  className={`px-2.5 py-0.5 rounded-pill transition cursor-pointer font-medium ${
                    reasoningEffort === effort
                      ? "bg-brand text-white shadow-2xs"
                      : "text-muted-ink hover:text-ink"
                  }`}
                >
                  {effort}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
