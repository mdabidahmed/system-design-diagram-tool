import type { DesignerEdgeData, DesignerNodeData, PaletteItem } from "../types";

export const DEFAULT_NODE_DATA: DesignerNodeData = {
  label: "Component",
  shapeKind: "roundedRectangle",
  fill: "#eef2ff",
  stroke: "#4a63f0",
  strokeWidth: 2,
  strokeStyle: "solid",
  cornerRadius: 14,
  fontSize: 13,
  fontWeight: 700,
  textColor: "#131a2e",
  textAlign: "center",
  showLabel: true,
};

export const DEFAULT_EDGE_DATA: DesignerEdgeData = {
  label: "",
  stroke: "#4a63f0",
  strokeWidth: 2,
  strokeStyle: "solid",
  animated: false,
  lineStyle: "bezier",
};

// These shapes render their label below the shape, directly on the canvas
// background — which flips light/dark with the app theme. Every other
// shape's label sits on its own (theme-independent) light fill, where a
// fixed dark ink is always safe. Label-below text needs to track the theme
// instead, or it goes near-invisible against a dark canvas.
const LABEL_BELOW_KINDS = new Set([
  "device",
  "browser",
  "queue",
  "lbShield",
  "redisMark",
  "cdnMark",
  "webServersMark",
  "serverMark",
]);

export function buildNodeData(item: PaletteItem): DesignerNodeData {
  return {
    ...DEFAULT_NODE_DATA,
    label: item.label,
    shapeKind: item.shapeKind,
    icon: item.icon,
    ...(item.shapeKind === "container"
      ? { fill: "rgba(74, 99, 240, 0.04)", stroke: "#8b93b8", strokeStyle: "dashed" as const }
      : {}),
    ...(LABEL_BELOW_KINDS.has(item.shapeKind) ? { textColor: "var(--ink)" } : {}),
    ...item.defaults,
  };
}
