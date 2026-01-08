"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Cluster } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface ClustersProps {
  clusters: Cluster[];
  onPickOne: () => void;
  onSelectIdea: (idea: string) => void;
  onBack: () => void;
  onStartOver: () => void;
  isLoading: boolean;
}

const clusterColors = [
  "bg-sage-dark/30 hover:bg-sage-dark/40",
  "bg-surface-light hover:bg-surface",
  "bg-ember-dark/25 hover:bg-ember-dark/35",
  "bg-sage/20 hover:bg-sage/30",
  "bg-surface hover:bg-surface-light",
  "bg-ember/20 hover:bg-ember/30",
];

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
};

export function Clusters({ clusters, onPickOne, onSelectIdea, onBack, onStartOver, isLoading }: ClustersProps) {
  return (
    <motion.div
      className="flex-1 flex flex-col px-8 py-12 overflow-auto"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cream-muted hover:text-cream text-sm transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dump
        </button>

        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="font-serif text-4xl text-cream-light tracking-tight">
            Here's what I noticed
          </h1>
          <p className="text-cream-muted text-lg max-w-md mx-auto">
            Click on any thought to focus on it, or let me pick one for you.
          </p>
        </div>

        {/* Clusters grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {clusters.map((cluster, index) => (
            <motion.div
              key={cluster.id}
              variants={cardVariants}
              transition={{ duration: 0.3 }}
              className={cn(
                "p-6 rounded-2xl transition-colors duration-200",
                clusterColors[index % clusterColors.length]
              )}
            >
              <h3 className="font-medium text-cream-light mb-3 text-lg">
                {cluster.title}
              </h3>
              <ul className="space-y-2">
                {cluster.ideas.slice(0, 4).map((idea, i) => (
                  <li
                    key={i}
                    onClick={() => onSelectIdea(idea)}
                    className="text-cream-muted text-sm leading-relaxed cursor-pointer hover:text-cream transition-colors py-1 -mx-2 px-2 rounded hover:bg-night-50/30"
                  >
                    {idea.length > 80 ? idea.slice(0, 80) + "..." : idea}
                  </li>
                ))}
                {cluster.ideas.length > 4 && (
                  <li className="text-cream-muted/60 text-xs italic pt-1">
                    +{cluster.ideas.length - 4} more
                  </li>
                )}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <Button size="lg" onClick={onPickOne} disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-cream-muted border-t-transparent rounded-full animate-spin" />
                Choosing...
              </span>
            ) : (
              "Pick one for me"
            )}
          </Button>
          <button
            onClick={onStartOver}
            className="text-cream-muted hover:text-cream text-sm transition-colors"
          >
            Start over
          </button>
        </div>
      </div>
    </motion.div>
  );
}
