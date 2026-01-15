'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useFilterStore } from '@/stores/filterStore';

export default function ActiveFilters() {
  const {
    searchQuery,
    instructionTypes,
    agentTypes,
    categories,
    status,
    onlyBatched,
    onlyMultiStep,
    setSearchQuery,
    setInstructionTypes,
    setAgentTypes,
    setCategories,
    setStatus,
    setOnlyBatched,
    setOnlyMultiStep,
    reset,
  } = useFilterStore();

  const hasActiveFilters =
    searchQuery ||
    (instructionTypes && instructionTypes.length > 0) ||
    (agentTypes && agentTypes.length > 0) ||
    (categories && categories.length > 0) ||
    (status && status.length > 0) ||
    onlyBatched ||
    onlyMultiStep;

  if (!hasActiveFilters) return null;

  const removeInstructionType = (type: string) => {
    if (instructionTypes) {
      setInstructionTypes(instructionTypes.filter((t) => t !== type) as any);
    }
  };

  const removeAgentType = (type: string) => {
    if (agentTypes) {
      setAgentTypes(agentTypes.filter((t) => t !== type) as any);
    }
  };

  const removeCategory = (cat: string) => {
    if (categories) {
      setCategories(categories.filter((c) => c !== cat) as any);
    }
  };

  const removeStatus = (s: string) => {
    if (status) {
      setStatus(status.filter((st) => st !== s) as any);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap py-2 px-4 bg-zinc-900/50 border-y border-zinc-800">
      <span className="text-sm text-zinc-400">Active filters:</span>

      {searchQuery && (
        <div className="flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full text-sm">
          <span className="text-zinc-300">Search: "{searchQuery}"</span>
          <button
            onClick={() => setSearchQuery('')}
            className="ml-1 text-zinc-500 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {instructionTypes && instructionTypes.map((type) => (
        <div
          key={type}
          className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-sm"
        >
          <span className="text-blue-300">{type}</span>
          <button
            onClick={() => removeInstructionType(type)}
            className="ml-1 text-blue-400 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}

      {agentTypes && agentTypes.map((type) => (
        <div
          key={type}
          className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-sm"
        >
          <span className="text-purple-300">{type}</span>
          <button
            onClick={() => removeAgentType(type)}
            className="ml-1 text-purple-400 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}

      {categories && categories.map((cat) => (
        <div
          key={cat}
          className="flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-sm"
        >
          <span className="text-green-300">{cat}</span>
          <button
            onClick={() => removeCategory(cat)}
            className="ml-1 text-green-400 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}

      {status && status.map((s) => (
        <div
          key={s}
          className="flex items-center gap-1 px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded-full text-sm"
        >
          <span className="text-amber-300">{s}</span>
          <button
            onClick={() => removeStatus(s)}
            className="ml-1 text-amber-400 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}

      {onlyBatched && (
        <div className="flex items-center gap-1 px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-sm">
          <span className="text-cyan-300">Batched only</span>
          <button
            onClick={() => setOnlyBatched(false)}
            className="ml-1 text-cyan-400 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {onlyMultiStep && (
        <div className="flex items-center gap-1 px-3 py-1 bg-pink-500/20 border border-pink-500/50 rounded-full text-sm">
          <span className="text-pink-300">Multi-step only</span>
          <button
            onClick={() => setOnlyMultiStep(false)}
            className="ml-1 text-pink-400 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={reset}
        className="text-zinc-400 hover:text-white text-xs"
      >
        Clear All
      </Button>
    </div>
  );
}
