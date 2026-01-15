'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, Activity, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFilterStore } from '@/stores/filterStore';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { useAgents } from '@/lib/hooks/useAgents';

interface SearchBarProps {
  onSelectTransaction?: (txHash: string) => void;
}

export default function SearchBar({ onSelectTransaction }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { setSearchQuery } = useFilterStore();
  
  // Fetch all transactions and agents
  const { transactions } = useTransactions({ limit: 1000 });
  const { agents } = useAgents();

  // Filter results based on query
  const filteredTransactions = query.length >= 2 
    ? transactions.filter(tx => 
        tx.txHash.toLowerCase().includes(query.toLowerCase()) ||
        tx.agentName?.toLowerCase().includes(query.toLowerCase()) ||
        tx.instructionType.toLowerCase().includes(query.toLowerCase()) ||
        tx.metadata?.description?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const filteredAgents = query.length >= 2
    ? agents.filter(agent =>
        agent.name.toLowerCase().includes(query.toLowerCase()) ||
        agent.address.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  // Apply search to filter store
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, setSearchQuery]);

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery('');
    setShowResults(false);
    setSearchQuery('');
  };

  const handleSelectTransaction = (txHash: string) => {
    const tx = transactions.find(t => t.txHash === txHash);
    setQuery(tx?.agentName || formatAddress(txHash));
    setShowResults(false);
    if (onSelectTransaction) {
      onSelectTransaction(txHash);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          type="text"
          placeholder="Search transactions, agents, or addresses..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(e.target.value.length >= 2);
          }}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          className="pl-10 pr-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-zinc-500 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {filteredTransactions.length === 0 && filteredAgents.length === 0 ? (
            <div className="py-8 text-center text-zinc-500">
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try searching by transaction hash, agent name, or address</p>
            </div>
          ) : (
            <div className="py-2">
              {/* Agents Section */}
              {filteredAgents.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs text-zinc-500 uppercase tracking-wide flex items-center gap-2">
                    <Bot className="h-3 w-3" />
                    AI Agents ({filteredAgents.length})
                  </div>
                  {filteredAgents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => {
                        setQuery(agent.name);
                        setShowResults(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-zinc-800 transition-colors flex items-start gap-3"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-green-500/20 rounded flex items-center justify-center">
                        <Bot className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{agent.name}</p>
                        <p className="text-xs text-zinc-500 mt-0.5 font-mono">{formatAddress(agent.address)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-zinc-500">
                            {agent.totalTransactions} txs
                          </span>
                          <span className="text-xs text-zinc-500">•</span>
                          <span className="text-xs text-zinc-500">
                            {parseFloat(agent.totalVolume).toFixed(2)} CRO
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Transactions Section */}
              {filteredTransactions.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs text-zinc-500 uppercase tracking-wide flex items-center gap-2">
                    <Activity className="h-3 w-3" />
                    Transactions ({filteredTransactions.length})
                  </div>
                  {filteredTransactions.map((tx) => (
                    <button
                      key={tx.txHash}
                      onClick={() => handleSelectTransaction(tx.txHash)}
                      className="w-full px-4 py-3 text-left hover:bg-zinc-800 transition-colors flex items-start gap-3"
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded flex items-center justify-center ${
                        tx.status === 'success' ? 'bg-green-500/20' :
                        tx.status === 'failed' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                      }`}>
                        <Activity className={`h-5 w-5 ${
                          tx.status === 'success' ? 'text-green-400' :
                          tx.status === 'failed' ? 'text-red-400' : 'text-yellow-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">
                            {tx.instructionType.replace(/_/g, ' ')}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded capitalize ${
                            tx.status === 'success' ? 'bg-green-500/20 text-green-400' :
                            tx.status === 'failed' ? 'bg-red-500/20 text-red-400' : 
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5 font-mono">{formatAddress(tx.txHash)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-zinc-500">{tx.agentName}</span>
                          <span className="text-xs text-zinc-500">•</span>
                          <span className="text-xs text-zinc-500">
                            {parseFloat(tx.value).toFixed(4)} CRO
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
