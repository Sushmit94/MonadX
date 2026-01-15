// Zustand store for graph state management
import { create } from 'zustand';
import { GraphNode } from '../lib/cronos/types';

interface GraphState {
  selectedNode: GraphNode | null;
  hoveredNode: GraphNode | null;
  highlightedNodes: Set<string>;
  zoomLevel: number;
  isPanMode: boolean;
  
  setSelectedNode: (node: GraphNode | null) => void;
  setHoveredNode: (node: GraphNode | null) => void;
  setHighlightedNodes: (nodeIds: Set<string>) => void;
  setZoomLevel: (level: number) => void;
  togglePanMode: () => void;
  reset: () => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  selectedNode: null,
  hoveredNode: null,
  highlightedNodes: new Set(),
  zoomLevel: 1,
  isPanMode: false,

  setSelectedNode: (node) => set({ selectedNode: node }),
  setHoveredNode: (node) => set({ hoveredNode: node }),
  setHighlightedNodes: (nodeIds) => set({ highlightedNodes: nodeIds }),
  setZoomLevel: (level) => set({ zoomLevel: level }),
  togglePanMode: () => set((state) => ({ isPanMode: !state.isPanMode })),
  reset: () => set({
    selectedNode: null,
    hoveredNode: null,
    highlightedNodes: new Set(),
    zoomLevel: 1,
    isPanMode: false,
  }),
}));
