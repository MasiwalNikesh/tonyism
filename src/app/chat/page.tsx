"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  fetchOpenAIChat,
  getRandomMemory,
  getRandomPhilosophy,
} from "@/lib/chatgpt";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Jai Shri Ram, beta! 🙏 I am Tony Ji, and I am here to give you all my love and wisdom. Come, let me offer you a Jadoo Ki Jhuppy! ❤️ I'm here to listen, share stories, and help you with whatever is on your heart. Whether you need guidance, a kind word, or just someone to chat with - I'm always here for you, my dear. Tell me, what's happening in your life today?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const openAIMessages = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: userMessage.content },
      ];
      const response = await fetchOpenAIChat(openAIMessages);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setError("Sorry, there was a problem getting a response.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getRandomInsight = () => {
    const insights = [
      getRandomMemory(),
      getRandomPhilosophy(),
      "Tony believed that every person has the power to make a difference in the world.",
      "He often said that true leadership is about serving others and creating opportunities for growth.",
      "Family was everything to Tony - he believed it was the cornerstone of a meaningful life.",
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <Link href="/chapters" className="inline-block mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-amber-600 text-white font-serif rounded-lg hover:bg-amber-700 transition-colors"
            >
              ← Back to Table of Contents
            </motion.button>
          </Link>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-800 mb-2">
            Chat with Tony&apos;s Wisdom
          </h1>
          <p className="text-lg text-amber-700 font-serif italic">
            Ask questions and receive guidance inspired by Tony&apos;s life and
            philosophy
          </p>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-lg shadow-2xl border-4 border-amber-200 overflow-hidden"
        >
          {/* Book Spine Effect */}

          {/* Chat Messages */}
          <div className="relative z-10 h-96 overflow-y-auto p-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={cn(
                    "mb-4 flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg font-serif",
                      message.role === "user"
                        ? "bg-amber-600 text-white"
                        : "bg-amber-50 text-black border border-amber-200"
                    )}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p
                      className={cn(
                        "text-xs mt-2",
                        message.role === "user"
                          ? "text-amber-200"
                          : "text-amber-600"
                      )}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start mb-4"
              >
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
            {error && (
              <div className="text-red-600 font-serif mt-2">{error}</div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-amber-200 p-4 bg-amber-50">
            <div className="flex space-x-4">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Tony about life, leadership, family, or anything else..."
                className="flex-1 p-3 border border-amber-300 rounded-lg font-serif text-black resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                rows={2}
                disabled={isLoading}
              />
              <motion.button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-6 py-3 bg-amber-600 text-white font-serif rounded-lg",
                  "hover:bg-amber-700 transition-colors",
                  (!inputValue.trim() || isLoading) &&
                    "opacity-50 cursor-not-allowed"
                )}
              >
                Send
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Quick Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-8 p-6 bg-white rounded-lg shadow-lg border border-amber-200"
        >
          <h3 className="text-xl font-serif font-semibold text-amber-800 mb-4">
            Random Insight from Tony
          </h3>
          <motion.p
            key={Date.now()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg text-amber-700 font-serif italic"
          >
            &ldquo;{getRandomInsight()}&rdquo;
          </motion.p>
        </motion.div>

        {/* Suggested Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-8 p-6 bg-white rounded-lg shadow-lg border border-amber-200"
        >
          <h3 className="text-xl font-serif font-semibold text-amber-800 mb-4">
            Suggested Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Tell me about TONY-ism and what it means",
              "What is 'Jadoo Ki Jhuppy' and why was it special?",
              "How can I practice 'Bina shart prem' in my life?",
              "What does 'Jahi Vidhi Rakhe Ram, Tahi Vidhi Rahiye' mean?",
              "How did Tony Ji show unconditional love to everyone?",
              "What can I learn from Tony Ji about being there for family?",
            ].map((question, index) => (
              <motion.button
                key={index}
                onClick={() => setInputValue(question)}
                whileHover={{ scale: 1.02 }}
                className="p-3 text-left bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors font-serif text-amber-700"
              >
                {question}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
