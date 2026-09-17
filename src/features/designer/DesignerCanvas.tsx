import { useCallback, useRef } from "react";
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MiniMap,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "./nodes/nodeTypes";
import { edgeTypes } from "./edges/edgeTypes";
import { useDesigner } from "./hooks/DesignerContext";
import { DND_MIME } from "./components/Palette";
import type { PaletteItem } from "./types";
import styles from "./DesignerCanvas.module.css";

export function DesignerCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onNodeDragStop, addNodeAt, addFreeArrow } =
    useDesigner();
  const reactFlow = useReactFlow();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData(DND_MIME);
      if (!raw) return;
      const item: PaletteItem = JSON.parse(raw);
      const position = reactFlow.screenToFlowPosition({ x: e.clientX, y: e.clientY });
      if (item.type === "arrow") {
        addFreeArrow({ x: position.x - 70, y: position.y });
        return;
      }
      addNodeAt(item, {
        x: position.x - item.defaultWidth / 2,
        y: position.y - item.defaultHeight / 2,
      });
    },
    [addNodeAt, addFreeArrow, reactFlow],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div className={styles.canvasWrap} ref={wrapperRef} onDrop={handleDrop} onDragOver={handleDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        deleteKeyCode={["Backspace", "Delete"]}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.15}
        maxZoom={2.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1.4} color="var(--border-strong)" />
        <MiniMap pannable zoomable style={{ background: "var(--surface)" }} />
      </ReactFlow>
    </div>
  );
}
