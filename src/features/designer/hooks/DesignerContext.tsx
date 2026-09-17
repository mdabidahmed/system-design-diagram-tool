import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  getNodesBounds,
  getViewportForBounds,
  MarkerType,
  type Connection,
  type EdgeChange,
  type EdgeMarker,
  type NodeChange,
} from "@xyflow/react";
import { toPng } from "html-to-image";
import { useHistory } from "./useHistory";
import { DEFAULT_EDGE_DATA, DEFAULT_NODE_DATA, buildNodeData } from "../data/defaults";
import { deleteDiagram, getDiagram, listDiagrams, saveDiagram } from "../data/storage";
import type {
  DesignerEdge,
  DesignerEdgeData,
  DesignerNode,
  DesignerNodeData,
  PaletteItem,
  SavedDiagram,
} from "../types";

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function buildMarker(color: string): EdgeMarker {
  return { type: MarkerType.ArrowClosed, color, width: 20, height: 20 };
}

function seedNodes(): DesignerNode[] {
  return [];
}

interface DesignerContextValue {
  nodes: DesignerNode[];
  edges: DesignerEdge[];
  onNodesChange: (changes: NodeChange<DesignerNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<DesignerEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeDragStop: () => void;

  selectedNode: DesignerNode | null;
  selectedEdge: DesignerEdge | null;

  addNodeAt: (item: PaletteItem, position: { x: number; y: number }) => void;
  addFreeArrow: (position: { x: number; y: number }) => void;
  updateNodeData: (id: string, patch: Partial<DesignerNodeData>) => void;
  updateNodeGeometry: (
    id: string,
    patch: { x?: number; y?: number; width?: number; height?: number },
  ) => void;
  updateEdgeData: (id: string, patch: Partial<DesignerEdgeData>) => void;
  deleteElement: (id: string, kind: "node" | "edge") => void;
  duplicateNode: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  commitHistory: () => void;
  onResizeEnd: () => void;

  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  title: string;
  setTitle: (title: string) => void;

  savedList: SavedDiagram[];
  saveCurrent: () => void;
  newDiagram: () => void;
  loadDiagram: (id: string) => void;
  removeDiagram: (id: string) => void;

  exportPNG: (wrapper: HTMLElement) => Promise<void>;
  exportJSON: () => void;
}

const DesignerContext = createContext<DesignerContextValue | null>(null);

export function DesignerProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<DesignerNode[]>(seedNodes);
  const [edges, setEdges] = useState<DesignerEdge[]>([]);
  const [title, setTitle] = useState("Untitled Diagram");
  const [diagramId, setDiagramId] = useState(() => uid("diagram"));
  const [savedList, setSavedList] = useState<SavedDiagram[]>(() => listDiagrams());
  const history = useHistory();
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  nodesRef.current = nodes;
  edgesRef.current = edges;

  const commitHistory = useCallback(() => {
    history.commit({ nodes: nodesRef.current, edges: edgesRef.current });
  }, [history]);

  const onNodesChange = useCallback((changes: NodeChange<DesignerNode>[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange<DesignerEdge>[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "labeled",
            data: { ...DEFAULT_EDGE_DATA },
            markerEnd: buildMarker(DEFAULT_EDGE_DATA.stroke),
          },
          eds,
        ),
      );
      // addEdge is synchronous but setEdges is async; commit on next tick.
      requestAnimationFrame(() => commitHistory());
    },
    [commitHistory],
  );

  const onNodeDragStop = useCallback(() => {
    commitHistory();
  }, [commitHistory]);

  const onResizeEnd = useCallback(() => {
    commitHistory();
  }, [commitHistory]);

  const addNodeAt = useCallback(
    (item: PaletteItem, position: { x: number; y: number }) => {
      const newNode: DesignerNode = {
        id: uid("node"),
        type: "shape",
        position,
        data: buildNodeData(item),
        style: { width: item.defaultWidth, height: item.defaultHeight },
        width: item.defaultWidth,
        height: item.defaultHeight,
        ...(item.shapeKind === "container" ? { zIndex: -1 } : {}),
      };
      setNodes((nds) => [...nds, newNode]);
      requestAnimationFrame(() => commitHistory());
    },
    [commitHistory],
  );

  const addFreeArrow = useCallback(
    (position: { x: number; y: number }) => {
      const startId = uid("anchor");
      const endId = uid("anchor");
      const pairId = uid("arrow");
      const anchorSize = 14;
      const startNode: DesignerNode = {
        id: startId,
        type: "anchor",
        position,
        data: { ...DEFAULT_NODE_DATA, pairId },
        width: anchorSize,
        height: anchorSize,
        style: { width: anchorSize, height: anchorSize },
      };
      const endNode: DesignerNode = {
        id: endId,
        type: "anchor",
        position: { x: position.x + 140, y: position.y },
        data: { ...DEFAULT_NODE_DATA, pairId },
        width: anchorSize,
        height: anchorSize,
        style: { width: anchorSize, height: anchorSize },
      };
      const edge: DesignerEdge = {
        id: uid("edge"),
        source: startId,
        target: endId,
        sourceHandle: "center",
        targetHandle: "center",
        type: "labeled",
        data: { ...DEFAULT_EDGE_DATA },
        markerEnd: buildMarker(DEFAULT_EDGE_DATA.stroke),
      };
      setNodes((nds) => [...nds, startNode, endNode]);
      setEdges((eds) => [...eds, edge]);
      requestAnimationFrame(() => commitHistory());
    },
    [commitHistory],
  );

  const updateNodeData = useCallback((id: string, patch: Partial<DesignerNodeData>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)),
    );
  }, []);

  const updateNodeGeometry = useCallback(
    (id: string, patch: { x?: number; y?: number; width?: number; height?: number }) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== id) return n;
          const position = {
            x: patch.x ?? n.position.x,
            y: patch.y ?? n.position.y,
          };
          const width = patch.width ?? n.width ?? 160;
          const height = patch.height ?? n.height ?? 80;
          return { ...n, position, width, height, style: { ...n.style, width, height } };
        }),
      );
    },
    [],
  );

  const updateEdgeData = useCallback((id: string, patch: Partial<DesignerEdgeData>) => {
    setEdges((eds) =>
      eds.map((e) => {
        if (e.id !== id) return e;
        const nextData = { ...(e.data as DesignerEdgeData), ...patch };
        return {
          ...e,
          data: nextData,
          markerEnd: patch.stroke ? buildMarker(patch.stroke) : e.markerEnd,
        };
      }),
    );
  }, []);

  const deleteElement = useCallback(
    (id: string, kind: "node" | "edge") => {
      if (kind === "node") {
        const target = nodesRef.current.find((n) => n.id === id);
        const pairId = target?.data.pairId;
        const idsToRemove = pairId
          ? new Set(nodesRef.current.filter((n) => n.data.pairId === pairId).map((n) => n.id))
          : new Set([id]);
        setNodes((nds) => nds.filter((n) => !idsToRemove.has(n.id)));
        setEdges((eds) => eds.filter((e) => !idsToRemove.has(e.source) && !idsToRemove.has(e.target)));
      } else {
        setEdges((eds) => eds.filter((e) => e.id !== id));
      }
      requestAnimationFrame(() => commitHistory());
    },
    [commitHistory],
  );

  const duplicateNode = useCallback(
    (id: string) => {
      setNodes((nds) => {
        const source = nds.find((n) => n.id === id);
        if (!source) return nds;
        const clone: DesignerNode = {
          ...source,
          id: uid("node"),
          position: { x: source.position.x + 30, y: source.position.y + 30 },
          data: { ...source.data },
          selected: false,
        };
        return [...nds.map((n) => ({ ...n, selected: false })), { ...clone, selected: true }];
      });
      requestAnimationFrame(() => commitHistory());
    },
    [commitHistory],
  );

  const bringToFront = useCallback((id: string) => {
    setNodes((nds) => {
      const maxZ = Math.max(0, ...nds.map((n) => n.zIndex ?? 0));
      return nds.map((n) => (n.id === id ? { ...n, zIndex: maxZ + 1 } : n));
    });
  }, []);

  const sendToBack = useCallback((id: string) => {
    setNodes((nds) => {
      const minZ = Math.min(0, ...nds.map((n) => n.zIndex ?? 0));
      return nds.map((n) => (n.id === id ? { ...n, zIndex: minZ - 1 } : n));
    });
  }, []);

  const undo = useCallback(() => {
    const snapshot = history.undo({ nodes: nodesRef.current, edges: edgesRef.current });
    if (snapshot) {
      setNodes(snapshot.nodes);
      setEdges(snapshot.edges);
    }
  }, [history]);

  const redo = useCallback(() => {
    const snapshot = history.redo({ nodes: nodesRef.current, edges: edgesRef.current });
    if (snapshot) {
      setNodes(snapshot.nodes);
      setEdges(snapshot.edges);
    }
  }, [history]);

  const saveCurrent = useCallback(() => {
    const record: SavedDiagram = {
      id: diagramId,
      name: title.trim() || "Untitled Diagram",
      updatedAt: Date.now(),
      nodes: nodesRef.current,
      edges: edgesRef.current,
    };
    saveDiagram(record);
    setSavedList(listDiagrams());
  }, [diagramId, title]);

  const newDiagram = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setTitle("Untitled Diagram");
    setDiagramId(uid("diagram"));
    history.reset();
  }, [history]);

  const loadDiagram = useCallback(
    (id: string) => {
      const record = getDiagram(id);
      if (!record) return;
      setNodes(record.nodes);
      setEdges(record.edges);
      setTitle(record.name);
      setDiagramId(record.id);
      history.reset();
    },
    [history],
  );

  const removeDiagram = useCallback((id: string) => {
    deleteDiagram(id);
    setSavedList(listDiagrams());
  }, []);

  const exportPNG = useCallback(async (wrapper: HTMLElement) => {
    // Selection outlines and resize handles are editor chrome, not part of
    // the diagram — without clearing them first, whatever was selected when
    // the user hit Export gets baked into the downloaded PNG. Clear it,
    // wait a frame for the DOM to catch up, then restore it afterward so
    // the user's in-progress selection isn't lost.
    const selectedNodeIds = nodesRef.current.filter((n) => n.selected).map((n) => n.id);
    const selectedEdgeIds = edgesRef.current.filter((e) => e.selected).map((e) => e.id);
    if (selectedNodeIds.length || selectedEdgeIds.length) {
      setNodes((nds) => nds.map((n) => (n.selected ? { ...n, selected: false } : n)));
      setEdges((eds) => eds.map((e) => (e.selected ? { ...e, selected: false } : e)));
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }

    const bounds = getNodesBounds(nodesRef.current);
    const imageWidth = Math.max(400, bounds.width);
    const imageHeight = Math.max(300, bounds.height);
    // getViewportForBounds's padding argument is a *fraction* of the
    // viewport (e.g. 0.05 = 5% on each side), not a pixel value — passing a
    // fraction here means the margin scales with the export size instead of
    // staying a fixed pixel amount regardless of diagram size.
    const viewport = getViewportForBounds(bounds, imageWidth, imageHeight, 0.2, 2, 0.05);
    const viewportEl = wrapper.querySelector<HTMLElement>(".react-flow__viewport");
    if (!viewportEl) return;
    // Without an explicit pixelRatio, html-to-image falls back to
    // window.devicePixelRatio (often 1), so the exported canvas ends up the
    // same pixel size as the on-screen CSS box — soft and blocky once
    // zoomed in. Render at a higher ratio for a crisp export, capped so the
    // canvas never exceeds the browser's max canvas dimension (~16384px).
    const canvasDimensionLimit = 16384;
    const pixelRatio = Math.max(
      1,
      Math.min(3, canvasDimensionLimit / imageWidth, canvasDimensionLimit / imageHeight),
    );

    // Connection handles sit at ~45% opacity at all times (even unselected)
    // so users can always see where to drag a connector from on-canvas.
    // That's useful while editing but is editor chrome, not part of the
    // diagram — hide it for the duration of the capture only. The handle's
    // own CSS transitions `opacity`, and an actively-transitioning value
    // takes cascade priority over even !important — without disabling the
    // transition too, toPng's near-synchronous DOM read captures the
    // pre-transition (visible) value instead of the hidden target.
    const hideHandlesStyle = document.createElement("style");
    hideHandlesStyle.textContent =
      ".react-flow__handle { opacity: 0 !important; transition: none !important; }";
    document.head.appendChild(hideHandlesStyle);

    let dataUrl: string;
    try {
      dataUrl = await toPng(viewportEl, {
        backgroundColor: "#ffffff",
        width: imageWidth,
        height: imageHeight,
        pixelRatio,
        // The app's fonts load from Google Fonts; html-to-image can't read
        // cross-origin @font-face rules to inline them (CORS) and logs a
        // console error if it tries. We don't need embedded fonts in a
        // rasterized PNG, so skip that step entirely.
        skipFonts: true,
        style: {
          width: String(imageWidth),
          height: String(imageHeight),
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      });
    } finally {
      document.head.removeChild(hideHandlesStyle);
      if (selectedNodeIds.length || selectedEdgeIds.length) {
        const nodeIdSet = new Set(selectedNodeIds);
        const edgeIdSet = new Set(selectedEdgeIds);
        setNodes((nds) => nds.map((n) => (nodeIdSet.has(n.id) ? { ...n, selected: true } : n)));
        setEdges((eds) => eds.map((e) => (edgeIdSet.has(e.id) ? { ...e, selected: true } : e)));
      }
    }

    const link = document.createElement("a");
    link.download = `${title.trim() || "diagram"}.png`;
    link.href = dataUrl;
    link.click();
  }, [title]);

  const exportJSON = useCallback(() => {
    const payload = { name: title, nodes: nodesRef.current, edges: edgesRef.current };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${title.trim() || "diagram"}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [title]);

  const selectedNode = useMemo(() => nodes.find((n) => n.selected) ?? null, [nodes]);
  const selectedEdge = useMemo(() => edges.find((e) => e.selected) ?? null, [edges]);

  const value: DesignerContextValue = {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeDragStop,
    selectedNode,
    selectedEdge,
    addNodeAt,
    addFreeArrow,
    updateNodeData,
    updateNodeGeometry,
    updateEdgeData,
    deleteElement,
    duplicateNode,
    bringToFront,
    sendToBack,
    commitHistory,
    onResizeEnd,
    undo,
    redo,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    title,
    setTitle,
    savedList,
    saveCurrent,
    newDiagram,
    loadDiagram,
    removeDiagram,
    exportPNG,
    exportJSON,
  };

  return <DesignerContext.Provider value={value}>{children}</DesignerContext.Provider>;
}

export function useDesigner(): DesignerContextValue {
  const ctx = useContext(DesignerContext);
  if (!ctx) throw new Error("useDesigner must be used within a DesignerProvider");
  return ctx;
}
