import type { SavedDiagram } from "../types";

const STORAGE_KEY = "sda:designer-diagrams";

function readAll(): SavedDiagram[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(diagrams: SavedDiagram[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
  } catch {
    // Storage can be full or blocked (private mode) — the in-memory diagram
    // still works, it just won't persist across reloads.
  }
}

export function listDiagrams(): SavedDiagram[] {
  return readAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function saveDiagram(diagram: SavedDiagram) {
  const all = readAll();
  const idx = all.findIndex((d) => d.id === diagram.id);
  if (idx >= 0) all[idx] = diagram;
  else all.push(diagram);
  writeAll(all);
}

export function deleteDiagram(id: string) {
  writeAll(readAll().filter((d) => d.id !== id));
}

export function getDiagram(id: string): SavedDiagram | undefined {
  return readAll().find((d) => d.id === id);
}
