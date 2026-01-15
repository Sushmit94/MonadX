'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useFilterStore } from '@/stores/filterStore';

export default function FilterPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    instructionTypes,
    agentTypes,
    categories,
    status,
    onlyBatched,
    onlyMultiStep,
    setInstructionTypes,
    setAgentTypes,
    setCategories,
    setStatus,
    setOnlyBatched,
    setOnlyMultiStep,
    reset,
  } = useFilterStore();

  const instructionOptions = [
    { value: 'payment', label: '💸 Payment', color: '#10b981' },
    { value: 'swap', label: '🔄 Swap', color: '#3b82f6' },
    { value: 'stake', label: '🔒 Stake', color: '#f59e0b' },
    { value: 'bridge', label: '🌉 Bridge', color: '#8b5cf6' },
    { value: 'settlement', label: '⚖️ Settlement', color: '#6b7280' },
  ];

  const categoryOptions = [
    { value: 'defi', label: '💰 DeFi', icon: '💰' },
    { value: 'payment', label: '💳 Payment', icon: '💳' },
    { value: 'nft', label: '🎨 NFT', icon: '🎨' },
    { value: 'bridge', label: '🌉 Bridge', icon: '🌉' },
    { value: 'other', label: '📦 Other', icon: '📦' },
  ];

  const statusOptions = [
    { value: 'success', label: '✅ Success', color: '#10b981' },
    { value: 'failed', label: '❌ Failed', color: '#ef4444' },
    { value: 'pending', label: '⏳ Pending', color: '#f59e0b' },
  ];

  const toggleInstructionType = (value: string) => {
    const currentTypes = instructionTypes || [];
    if (currentTypes.includes(value as any)) {
      setInstructionTypes(currentTypes.filter((t) => t !== value) as any);
    } else {
      setInstructionTypes([...currentTypes, value] as any);
    }
  };

  const toggleCategory = (value: string) => {
    const currentTypes = categories || [];
    if (currentTypes.includes(value as any)) {
      setCategories(currentTypes.filter((t) => t !== value) as any);
    } else {
      setCategories([...currentTypes, value] as any);
    }
  };

  const toggleStatus = (value: string) => {
    const currentTypes = status || [];
    if (currentTypes.includes(value as any)) {
      setStatus(currentTypes.filter((t) => t !== value) as any);
    } else {
      setStatus([...currentTypes, value] as any);
    }
  };

  const activeFilterCount =
    (instructionTypes?.length || 0) +
    (agentTypes?.length || 0) +
    (categories?.length || 0) +
    (status?.length || 0) +
    (onlyBatched ? 1 : 0) +
    (onlyMultiStep ? 1 : 0);

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 relative"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
        {activeFilterCount > 0 && (
          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
            {activeFilterCount}
          </span>
        )}
        {isOpen ? (
          <ChevronUp className="h-4 w-4 ml-2" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-2" />
        )}
      </Button>

      {/* Filter Panel */}
      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 bg-zinc-900 border-zinc-800 text-white z-50 p-6 max-h-[600px] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            <div className="flex gap-2">
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={reset}
                  className="text-zinc-400 hover:text-white text-xs"
                >
                  Reset All
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Instruction Type Filters */}
          <div className="mb-6">
            <Label className="text-sm font-semibold mb-3 block text-zinc-200">
              Instruction Types
            </Label>
            <div className="space-y-2">
              {instructionOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleInstructionType(option.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    instructionTypes?.includes(option.value as any)
                      ? 'bg-zinc-800 border-2 border-blue-500'
                      : 'bg-zinc-950 border-2 border-transparent hover:bg-zinc-800'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-sm flex-1 text-left">{option.label}</span>
                  {instructionTypes?.includes(option.value as any) && (
                    <span className="text-blue-500 text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-6">
            <Label className="text-sm font-semibold mb-3 block text-zinc-200">
              Categories
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleCategory(option.value)}
                  className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
                    categories?.includes(option.value as any)
                      ? 'bg-zinc-800 border-2 border-blue-500'
                      : 'bg-zinc-950 border-2 border-transparent hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-sm flex-1">{option.label.split(' ')[1]}</span>
                  {categories?.includes(option.value as any) && (
                    <span className="text-blue-500 text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filters */}
          <div className="mb-6">
            <Label className="text-sm font-semibold mb-3 block text-zinc-200">
              Status
            </Label>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleStatus(option.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    status?.includes(option.value as any)
                      ? 'bg-zinc-800 border-2 border-blue-500'
                      : 'bg-zinc-950 border-2 border-transparent hover:bg-zinc-800'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-sm flex-1 text-left">{option.label}</span>
                  {status?.includes(option.value as any) && (
                    <span className="text-blue-500 text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold block text-zinc-200">
              Quick Filters
            </Label>
            
            <button
              onClick={() => setOnlyBatched(!onlyBatched)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                onlyBatched
                  ? 'bg-zinc-800 border-2 border-blue-500'
                  : 'bg-zinc-950 border-2 border-transparent hover:bg-zinc-800'
              }`}
            >
              <span className="text-lg">📦</span>
              <span className="text-sm flex-1 text-left">Batched Only</span>
              {onlyBatched && <span className="text-blue-500 text-xs">✓</span>}
            </button>

            <button
              onClick={() => setOnlyMultiStep(!onlyMultiStep)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                onlyMultiStep
                  ? 'bg-zinc-800 border-2 border-blue-500'
                  : 'bg-zinc-950 border-2 border-transparent hover:bg-zinc-800'
              }`}
            >
              <span className="text-lg">🔗</span>
              <span className="text-sm flex-1 text-left">Multi-Step Only</span>
              {onlyMultiStep && <span className="text-blue-500 text-xs">✓</span>}
            </button>
          </div>

          {/* Active Filters Summary */}
          {activeFilterCount > 0 && (
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <p className="text-xs text-zinc-400 mb-2">Active Filters</p>
              <div className="flex flex-wrap gap-2">
                {instructionTypes && instructionTypes.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 text-xs bg-zinc-800 rounded-full flex items-center gap-1"
                  >
                    {type}
                    <button
                      onClick={() => toggleInstructionType(type)}
                      className="hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {categories && categories.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 text-xs bg-zinc-800 rounded-full flex items-center gap-1"
                  >
                    {type}
                    <button
                      onClick={() => toggleCategory(type)}
                      className="hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {onlyBatched && (
                  <span className="px-2 py-1 text-xs bg-zinc-800 rounded-full flex items-center gap-1">
                    Batched Only
                    <button
                      onClick={() => setOnlyBatched(false)}
                      className="hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {onlyMultiStep && (
                  <span className="px-2 py-1 text-xs bg-zinc-800 rounded-full flex items-center gap-1">
                    Multi-Step Only
                    <button
                      onClick={() => setOnlyMultiStep(false)}
                      className="hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
