import type { Edge, Node } from "@xyflow/react";

export type ShapeKind =
  | "rectangle"
  | "roundedRectangle"
  | "circle"
  | "diamond"
  | "hexagon"
  | "cylinder"
  | "cloud"
  | "device"
  | "browser"
  | "queue"
  | "dnsGlobe"
  | "lbShield"
  | "redisMark"
  | "cdnMark"
  | "webServersMark"
  | "serverMark"
  | "text"
  | "container";

export type StrokeStyle = "solid" | "dashed";
export type TextAlign = "left" | "center" | "right";

export interface DesignerNodeData extends Record<string, unknown> {
  label: string;
  shapeKind: ShapeKind;
  icon?: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  cornerRadius: number;
  fontSize: number;
  fontWeight: number;
  textColor: string;
  textAlign: TextAlign;
  showLabel: boolean;
  /** Shared id linking a free-standing arrow's two anchor endpoints, so
   * deleting one removes its partner too instead of leaving a stray dot. */
  pairId?: string;
}

export type LineStyle = "bezier" | "straight" | "step";

export interface DesignerEdgeData extends Record<string, unknown> {
  label?: string;
  stroke: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  animated: boolean;
  lineStyle: LineStyle;
}

export type DesignerNode = Node<DesignerNodeData>;
export type DesignerEdge = Edge<DesignerEdgeData>;

export interface PaletteItem {
  type: string;
  label: string;
  category: "General" | "Infrastructure" | "Advanced";
  icon?: string;
  shapeKind: ShapeKind;
  defaultWidth: number;
  defaultHeight: number;
  defaults?: Partial<DesignerNodeData>;
}

export interface SavedDiagram {
  id: string;
  name: string;
  updatedAt: number;
  nodes: DesignerNode[];
  edges: DesignerEdge[];
}
