"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { BrainDump } from "@/components/brain-dump";
import { Clusters } from "@/components/clusters";
import { Focus } from "@/components/focus";
import { ProgressIndicator } from "@/components/progress-indicator";
import { Logo } from "@/components/logo";
import { loadState, saveState, clearState, type AppState, type Cluster } from "@/lib/storage";
import { organizeIdeas, generateNextAction, pickRandomIdea } from "@/lib/ai";

type Screen = "dump" | "clusters" | "focus";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("dump");
  const [rawDump, setRawDump] = useState("");
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
  const [nextAction, setNextAction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = loadState();
    setRawDump(saved.rawDump);
    setClusters(saved.clusters);
    setSelectedIdea(saved.selectedIdea);
    setNextAction(saved.nextAction);

    // Determine which screen to show based on saved state
    if (saved.nextAction && saved.selectedIdea) {
      setScreen("focus");
    } else if (saved.clusters.length > 0) {
      setScreen("clusters");
    }

    setMounted(true);
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    if (!mounted) return;

    saveState({
      rawDump,
      clusters,
      selectedIdea,
      nextAction,
      timeChoice: null,
      moodChoice: null,
    });
  }, [rawDump, clusters, selectedIdea, nextAction, mounted]);

  const handleOrganize = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await organizeIdeas(rawDump);
      setClusters(result);
      setScreen("clusters");
    } finally {
      setIsLoading(false);
    }
  }, [rawDump]);

  const handlePickOne = useCallback(async () => {
    setIsLoading(true);
    try {
      const idea = pickRandomIdea(clusters);
      if (idea) {
        setSelectedIdea(idea);
        setNextAction(null);
        setScreen("focus");
      }
    } finally {
      setIsLoading(false);
    }
  }, [clusters]);

  const handleSelectIdea = useCallback((idea: string) => {
    setSelectedIdea(idea);
    setNextAction(null);
    setScreen("focus");
  }, []);

  const handleBack = useCallback(() => {
    if (screen === "focus") {
      setNextAction(null);
      setScreen("clusters");
    } else if (screen === "clusters") {
      setScreen("dump");
    }
  }, [screen]);

  const handleGenerateAction = useCallback(
    async (time: string, mood: string) => {
      if (!selectedIdea) return;

      setIsLoading(true);
      try {
        const action = await generateNextAction(selectedIdea, time, mood);
        setNextAction(action);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedIdea]
  );

  const handleStartOver = useCallback(() => {
    clearState();
    setRawDump("");
    setClusters([]);
    setSelectedIdea(null);
    setNextAction(null);
    setScreen("dump");
  }, []);

  const currentStep = screen === "dump" ? 1 : screen === "clusters" ? 2 : 3;

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Header with logo */}
      <header className="fixed top-0 left-0 right-0 z-20 p-4">
        <Logo size="sm" />
      </header>

      <ProgressIndicator currentStep={currentStep} />

      <AnimatePresence mode="wait">
        {screen === "dump" && (
          <BrainDump
            key="dump"
            value={rawDump}
            onChange={setRawDump}
            onOrganize={handleOrganize}
            isLoading={isLoading}
          />
        )}

        {screen === "clusters" && (
          <Clusters
            key="clusters"
            clusters={clusters}
            onPickOne={handlePickOne}
            onSelectIdea={handleSelectIdea}
            onBack={handleBack}
            onStartOver={handleStartOver}
            isLoading={isLoading}
          />
        )}

        {screen === "focus" && selectedIdea && (
          <Focus
            key="focus"
            selectedIdea={selectedIdea}
            nextAction={nextAction}
            onGenerateAction={handleGenerateAction}
            onBack={handleBack}
            onStartOver={handleStartOver}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
}
