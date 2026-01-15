// Zustand store for filter state management
import { create } from 'zustand';
import { FilterOptions, X402InstructionType, AgentType, TransactionCategory } from '../lib/cronos/types';

interface FilterState extends FilterOptions {
  setSearchQuery: (query: string) => void;
  setInstructionTypes: (types: X402InstructionType[]) => void;
  setAgentTypes: (types: AgentType[]) => void;
  setCategories: (categories: TransactionCategory[]) => void;
  setStatus: (status: ('success' | 'failed' | 'pending')[]) => void;
  setDateRange: (range: { start: number; end: number } | undefined) => void;
  setValueRange: (min?: number, max?: number) => void;
  setAgentIds: (agentIds: string[]) => void;
  setProtocols: (protocols: string[]) => void;
  setOnlyBatched: (value: boolean) => void;
  setOnlyMultiStep: (value: boolean) => void;
  reset: () => void;
}

const initialState: FilterOptions = {
  searchQuery: '',
  instructionTypes: [],
  agentTypes: [],
  categories: [],
  status: [],
  dateRange: undefined,
  minValue: undefined,
  maxValue: undefined,
  agentIds: [],
  protocols: [],
  onlyBatched: false,
  onlyMultiStep: false,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setInstructionTypes: (types) => set({ instructionTypes: types }),
  setAgentTypes: (types) => set({ agentTypes: types }),
  setCategories: (categories) => set({ categories }),
  setStatus: (status) => set({ status }),
  setDateRange: (range) => set({ dateRange: range }),
  setValueRange: (min, max) => set({ minValue: min, maxValue: max }),
  setAgentIds: (agentIds) => set({ agentIds }),
  setProtocols: (protocols) => set({ protocols }),
  setOnlyBatched: (value) => set({ onlyBatched: value }),
  setOnlyMultiStep: (value) => set({ onlyMultiStep: value }),
  reset: () => set(initialState),
}));
