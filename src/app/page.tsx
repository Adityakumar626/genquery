"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { GooeyInput } from "@/components/ui/gooey-input";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === 'submitted' || status === 'streaming';
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(0);
  const wasLoading = useRef(false);

  // Play sleek UI sounds using Web Audio API
  const playSound = (type: "send" | "receive") => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;

      // Helper to play a single note with a beautiful decay envelope
      const playNote = (freq: number, startTime: number, duration: number, vol = 0.1) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.value = freq;

        osc.connect(gain);
        gain.connect(ctx.destination);

        // Fast, smooth attack
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.015);
        // Smooth exponential release
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      if (type === "send") {
        // 🔥 Premium SEND — punchy, crisp, satisfying
        playNote(98.00, now, 0.10, 0.12);           // G2 — bass punch
        playNote(196.00, now + 0.015, 0.09, 0.075); // G3
        playNote(392.00, now + 0.035, 0.11, 0.075); // G4
        playNote(587.33, now + 0.075, 0.18, 0.055); // D5

      } else {
        // 🔔 Premium RECEIVE — clear, rich, noticeable
        playNote(110.00, now, 0.12, 0.13);           // A2 — bass
        playNote(220.00, now + 0.015, 0.10, 0.075);  // A3
        playNote(440.00, now + 0.045, 0.16, 0.085);  // A4
        playNote(659.25, now + 0.10, 0.25, 0.065);   // E5
      }
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    // Check if we just received a new assistant message
    if (messages.length > prevMessagesLength.current) {
      const lastMessage = messages[messages.length - 1];
      // Only play receive sound if the message isn't from the user
      // and it's the start of the stream
      if (lastMessage.role !== "user" && messages.length - prevMessagesLength.current === 1) {
        playSound("receive");
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  // Optional: Play a sound when generation finishes
  useEffect(() => {
    if (wasLoading.current && !isLoading) {
      // Stream finished! Could play a sound here if desired, 
      // but typically start-of-receive is enough.
    }
    wasLoading.current = isLoading;
  }, [isLoading]);

  return (
    <div className="flex flex-col w-full h-[calc(100vh-3.5rem)] relative">
      <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto px-4 pt-8 pb-32 scroll-smooth">
        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              className={`flex w-full mb-8 ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] overflow-hidden rounded-2xl px-5 py-4 ${isUser
                  ? "bg-primary text-primary-foreground rounded-br-none shadow-md"
                  : "bg-muted/50 border shadow-sm rounded-bl-none backdrop-blur-sm"
                  }`}
              >
                {!isUser && (
                  <div className="font-semibold text-xs text-muted-foreground mb-2 tracking-wider uppercase">
                    GenQuery AI
                  </div>
                )}

                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <div key={`${message.id}-${i}`} className="prose prose-sm dark:prose-invert max-w-none break-words">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {part.text}
                          </ReactMarkdown>
                        </div>
                      );

                    case "tool-db":
                      const dbInput = (part as any).input?.query;
                      const dbOutput = (part as any).output;
                      return (
                        <div key={`${message.id}-${i}`} className="my-2 w-full max-w-full">
                          <details className="group bg-background/40 backdrop-blur-md border rounded-lg overflow-hidden shadow-sm">
                            <summary className="text-xs font-medium text-blue-400 hover:text-blue-500 cursor-pointer p-2 px-3 transition-colors bg-background/30 hover:bg-muted/30 select-none flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></svg>
                              Database Query
                            </summary>
                            <div className="flex flex-col border-t">
                              {dbInput && (
                                <div className="relative p-3 bg-muted/30">
                                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-muted-foreground pr-10 font-mono">
                                    {dbInput}
                                  </pre>
                                  <button
                                    onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText(dbInput); }}
                                    className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:bg-muted rounded-md transition-colors"
                                    title="Copy query"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                  </button>
                                </div>
                              )}
                              {dbOutput && (
                                <div className="p-3 border-t bg-background/50">
                                  <pre className="text-[10px] overflow-x-auto whitespace-pre text-muted-foreground font-mono max-h-48">
                                    {JSON.stringify(dbOutput, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </details>
                        </div>
                      );

                    case "tool-schema":
                      const schemaOutput = (part as any).output;
                      return (
                        <div key={`${message.id}-${i}`} className="my-2 w-full max-w-full">
                          <details className="group bg-background/50 border rounded-lg overflow-hidden">
                            <summary className="text-xs font-medium text-orange-500 hover:text-orange-600 cursor-pointer p-2 px-3 transition-colors bg-background/30 hover:bg-muted/30 select-none flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                              Analyzed Schema
                            </summary>
                            {schemaOutput && (
                              <div className="p-3 border-t bg-background/50">
                                <pre className="text-[10px] overflow-x-auto whitespace-pre text-muted-foreground font-mono max-h-48">
                                  {typeof schemaOutput === 'string' ? schemaOutput : JSON.stringify(schemaOutput, null, 2)}
                                </pre>
                              </div>
                            )}
                          </details>
                        </div>
                      );

                    case "step-start":
                      // Only show processing if this is the very last part
                      if (i !== message.parts.length - 1) return null;
                      return (
                        <div key={`${message.id}-${i}`} className="my-3 w-fit flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 shadow-sm animate-pulse">
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span className="font-medium text-sm tracking-wide">Processing...</span>
                        </div>
                      );
                  }
                })}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="absolute bottom-0 w-full bg-gradient-to-t from-background via-background to-transparent pb-8 pt-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            playSound("send");
            sendMessage({ text: input });
            setInput("");
          }}
          className="w-full max-w-2xl mx-auto flex justify-center px-4"
        >
          <GooeyInput
            value={input}
            onValueChange={setInput}
            placeholder="Ask..."
            expandedWidth={600}
            className="w-full drop-shadow-xl"
          />
        </form>
      </div>
    </div>
  );
}
