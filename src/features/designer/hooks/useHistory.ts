import { useCallback, useRef, useState } from "react";
import type { DesignerEdge, DesignerNode } from "../types";

interface Snapshot {
  nodes: DesignerNode[];
  edges: DesignerEdge[];
}

const MAX_HISTORY = 60;

/**
 * Undo/redo over full {nodes, edges} snapshots. Callers push a snapshot
 * after each *committed* user action (drag stop, connect, delete, property
 * edit blur) rather than on every intermediate change, so dragging a node
 * doesn't spam the stack with one entry per pixel.
 */
export function useHistory() {
  const undoStack = useRef<Snapshot[]>([]);
  const redoStack = useRef<Snapshot[]>([]);
  // Only used to force a re-render so canUndo/canRedo stay in sync with the UI.
  const [, forceTick] = useState(0);

  const commit = useCallback((snapshot: Snapshot) => {
    undoStack.current.push({
      nodes: snapshot.nodes.map((n) => ({ ...n, data: { ...n.data } })),
      edges: snapshot.edges.map((e) => ({ ...e, data: { ...e.data } })),
    });
    if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
    redoStack.current = [];
    forceTick((t) => t + 1);
  }, []);

  const undo = useCallback((current: Snapshot): Snapshot | null => {
    const previous = undoStack.current.pop();
    if (!previous) return null;
    redoStack.current.push({
      nodes: current.nodes.map((n) => ({ ...n, data: { ...n.data } })),
      edges: current.edges.map((e) => ({ ...e, data: { ...e.data } })),
    });
    forceTick((t) => t + 1);
    return previous;
  }, []);

  const redo = useCallback((current: Snapshot): Snapshot | null => {
    const next = redoStack.current.pop();
    if (!next) return null;
    undoStack.current.push({
      nodes: current.nodes.map((n) => ({ ...n, data: { ...n.data } })),
      edges: current.edges.map((e) => ({ ...e, data: { ...e.data } })),
    });
    forceTick((t) => t + 1);
    return next;
  }, []);

  const reset = useCallback(() => {
    undoStack.current = [];
    redoStack.current = [];
    forceTick((t) => t + 1);
  }, []);

  return {
    commit,
    undo,
    redo,
    reset,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,
  };
}
