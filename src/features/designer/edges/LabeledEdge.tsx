import { useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  type EdgeProps,
} from "@xyflow/react";
import { cx } from "@/utils/cx";
import { useDesigner } from "../hooks/DesignerContext";
import type { DesignerEdge } from "../types";
import styles from "./LabeledEdge.module.css";

export function LabeledEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  selected,
}: EdgeProps<DesignerEdge>) {
  const { updateEdgeData, commitHistory } = useDesigner();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data?.label ?? "");

  const pathArgs = { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition };
  const [edgePath, labelX, labelY] =
    data?.lineStyle === "straight"
      ? getStraightPath(pathArgs)
      : data?.lineStyle === "step"
        ? getSmoothStepPath({ ...pathArgs, borderRadius: 8 })
        : getBezierPath(pathArgs);

  const stroke = data?.stroke ?? "#4a63f0";
  const strokeWidth = data?.strokeWidth ?? 2;
  const dashArray = data?.strokeStyle === "dashed" ? "6 5" : undefined;

  const commitLabel = () => {
    setEditing(false);
    if (draft !== data?.label) {
      updateEdgeData(id, { label: draft });
      commitHistory();
    }
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? "#2f47d8" : stroke,
          strokeWidth: selected ? strokeWidth + 1 : strokeWidth,
          strokeDasharray: dashArray,
          animation: data?.animated ? "sda-edge-dash 0.6s linear infinite" : undefined,
        }}
      />
      <EdgeLabelRenderer>
        <div
          className={cx(styles.labelWrap, "nodrag", "nopan")}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            opacity: editing || data?.label ? 1 : 0,
          }}
        >
          {editing ? (
            <input
              autoFocus
              className={styles.labelInput}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitLabel}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitLabel();
                if (e.key === "Escape") setEditing(false);
              }}
            />
          ) : (
            <span
              onDoubleClick={() => {
                setDraft(data?.label ?? "");
                setEditing(true);
              }}
            >
              {data?.label || "label"}
            </span>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
