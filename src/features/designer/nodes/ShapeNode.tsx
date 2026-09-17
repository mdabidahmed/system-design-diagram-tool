import { useId, useState } from "react";
import { Handle, NodeResizer, Position, type NodeProps } from "@xyflow/react";
import { cx } from "@/utils/cx";
import { Icon } from "../icons/icons";
import { useDesigner } from "../hooks/DesignerContext";
import type { DesignerNode } from "../types";
import loadBalancerIcon from "@/assets/load-balancer.svg";
import redisIcon from "@/assets/Redis.svg";
import cdnIcon from "@/assets/cdn.svg";
import webServersIcon from "@/assets/web-server.svg";
import serverIcon from "@/assets/server.svg";
import styles from "./ShapeNode.module.css";

const HANDLE_POSITIONS = [
  { id: "top", position: Position.Top },
  { id: "right", position: Position.Right },
  { id: "bottom", position: Position.Bottom },
  { id: "left", position: Position.Left },
];

function ShapeBackground({ node, clipId }: { node: DesignerNode["data"]; clipId: string }) {
  const { shapeKind, fill, stroke, strokeWidth, strokeStyle, cornerRadius } = node;
  const dashArray = strokeStyle === "dashed" ? "6 5" : undefined;

  if (shapeKind === "text") return null;

  if (shapeKind === "rectangle" || shapeKind === "roundedRectangle" || shapeKind === "container") {
    return (
      <div
        className={styles.shapeLayer}
        style={{
          background: fill,
          border: `${strokeWidth}px ${strokeStyle} ${stroke}`,
          borderRadius: shapeKind === "container" ? 16 : cornerRadius,
        }}
      />
    );
  }

  if (shapeKind === "circle") {
    return (
      <div
        className={styles.shapeLayer}
        style={{
          background: fill,
          border: `${strokeWidth}px ${strokeStyle} ${stroke}`,
          borderRadius: "50%",
        }}
      />
    );
  }

  if (shapeKind === "diamond") {
    return (
      <svg className={styles.shapeLayer} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon
          points="50,2 98,50 50,98 2,50"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }

  if (shapeKind === "hexagon") {
    return (
      <svg className={styles.shapeLayer} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon
          points="22,3 78,3 98,50 78,97 22,97 2,50"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }

  if (shapeKind === "cylinder") {
    return (
      <svg className={styles.shapeLayer} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M2,10 L2,90 A50,9 0 0 0 98,90 L98,10 A50,9 0 0 0 2,10 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          vectorEffect="non-scaling-stroke"
        />
        <ellipse cx="50" cy="10" rx="48" ry="9" fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
      </svg>
    );
  }

  if (shapeKind === "cloud") {
    // Unlike the polygon shapes above, a cloud's silhouette reads as broken
    // once stretched non-uniformly (flattened bumps, clipped lobes) — scale
    // it proportionally and center it instead of forcing it to fill the box.
    return (
      <svg className={styles.shapeLayer} width="100%" height="100%" viewBox="0 0 56 44" preserveAspectRatio="xMidYMid meet">
        <path
          d="M20 44c-11 0-20-8-20-19 0-9 6-16 15-18 3-9 12-15 22-13 8 1 14 7 16 14 8 1 14 8 14 16 0 10-9 20-20 20z"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }

  if (shapeKind === "device") {
    return (
      <div
        className={styles.shapeLayer}
        style={{
          background: fill,
          border: `${strokeWidth}px ${strokeStyle} ${stroke}`,
          borderRadius: Math.min(cornerRadius + 8, 28),
        }}
      >
        <span className={styles.deviceDot} style={{ background: stroke }} />
      </div>
    );
  }

  if (shapeKind === "queue") {
    const envelopeStroke = strokeWidth * 0.8;
    return (
      <svg className={styles.shapeLayer} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon
          points="2,10 66,10 94,50 66,90 2,90"
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {[8, 29, 50].map((ox) => (
          <g key={ox} transform={`translate(${ox},39)`}>
            <rect
              x="0"
              y="0"
              width="14"
              height="22"
              rx="1.5"
              fill={fill}
              stroke={stroke}
              strokeWidth={envelopeStroke}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M0 2l7 6 7-6"
              fill="none"
              stroke={stroke}
              strokeWidth={envelopeStroke}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
      </svg>
    );
  }

  if (shapeKind === "dnsGlobe") {
    const gridStroke = strokeWidth * 0.65;
    return (
      <svg className={styles.shapeLayer} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <clipPath id={clipId}>
            <circle cx="50" cy="50" r="48" />
          </clipPath>
        </defs>
        <circle cx="50" cy="50" r="48" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dashArray} vectorEffect="non-scaling-stroke" />
        <g clipPath={`url(#${clipId})`} fill="none" stroke={stroke} strokeWidth={gridStroke} vectorEffect="non-scaling-stroke">
          <ellipse cx="50" cy="50" rx="18" ry="48" />
          <line x1="2" y1="50" x2="98" y2="50" />
          <line x1="6" y1="28" x2="94" y2="28" />
          <line x1="6" y1="72" x2="94" y2="72" />
        </g>
      </svg>
    );
  }

  if (shapeKind === "lbShield") {
    return (
      <div className={styles.shapeLayer}>
        <img src={loadBalancerIcon} alt="" className={styles.fitImage} draggable={false} />
      </div>
    );
  }

  if (shapeKind === "redisMark") {
    return (
      <div className={styles.shapeLayer}>
        <img src={redisIcon} alt="" className={styles.fitImage} draggable={false} />
      </div>
    );
  }

  if (shapeKind === "cdnMark") {
    return (
      <div className={styles.shapeLayer}>
        <img src={cdnIcon} alt="" className={styles.fitImage} draggable={false} />
      </div>
    );
  }

  if (shapeKind === "webServersMark") {
    return (
      <div className={styles.shapeLayer}>
        <img src={webServersIcon} alt="" className={styles.fitImage} draggable={false} />
      </div>
    );
  }

  if (shapeKind === "serverMark") {
    return (
      <div className={styles.shapeLayer}>
        <img src={serverIcon} alt="" className={styles.fitImage} draggable={false} />
      </div>
    );
  }

  if (shapeKind === "browser") {
    return (
      <div className={styles.shapeLayer}>
        <div
          className={styles.browserScreen}
          style={{
            background: fill,
            border: `${strokeWidth}px ${strokeStyle} ${stroke}`,
            borderRadius: cornerRadius,
          }}
        >
          <div className={styles.browserTopBar} style={{ background: stroke, opacity: 0.35 }} />
        </div>
        <span className={styles.browserNeck} style={{ background: stroke, opacity: 0.55 }} />
        <span className={styles.browserBase} style={{ background: stroke, opacity: 0.55 }} />
      </div>
    );
  }

  return null;
}

export function ShapeNode({ id, data, selected }: NodeProps<DesignerNode>) {
  const { updateNodeData, commitHistory, onResizeEnd } = useDesigner();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data.label);
  const clipId = `dns-clip-${useId()}`;

  const commitLabel = () => {
    setEditing(false);
    if (draft !== data.label) {
      updateNodeData(id, { label: draft });
      commitHistory();
    }
  };

  const startEditing = () => {
    setDraft(data.label);
    setEditing(true);
  };

  const isContainer = data.shapeKind === "container";
  const isDnsBadge = data.shapeKind === "dnsGlobe";
  const isLabelBelow =
    data.shapeKind === "device" ||
    data.shapeKind === "browser" ||
    data.shapeKind === "queue" ||
    data.shapeKind === "lbShield" ||
    data.shapeKind === "redisMark" ||
    data.shapeKind === "cdnMark" ||
    data.shapeKind === "webServersMark" ||
    data.shapeKind === "serverMark";
  const isText = data.shapeKind === "text";

  const labelStyle = {
    fontSize: data.fontSize,
    fontWeight: data.fontWeight,
    color: data.textColor,
    textAlign: data.textAlign,
  } as const;

  return (
    <div className={cx(styles.wrapper, selected && styles.selected)}>
      <NodeResizer
        isVisible={selected}
        minWidth={isText ? 60 : 48}
        minHeight={isText ? 24 : 36}
        onResizeEnd={onResizeEnd}
        lineStyle={{ borderColor: "#4a63f0" }}
        handleStyle={{ width: 8, height: 8, borderRadius: 2, background: "#4a63f0" }}
      />

      {HANDLE_POSITIONS.map((h) => (
        <Handle
          key={h.id}
          id={h.id}
          type="source"
          position={h.position}
          className={styles.handle}
        />
      ))}

      <ShapeBackground node={data} clipId={clipId} />

      {isDnsBadge ? (
        <div className={styles.contentLayer}>
          {data.showLabel && (
            <div className={styles.dnsBadge} style={{ color: data.textColor }} onDoubleClick={startEditing}>
              {editing ? (
                <input
                  autoFocus
                  className={cx(styles.labelInput, "nodrag", "nopan")}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={commitLabel}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitLabel();
                    if (e.key === "Escape") setEditing(false);
                  }}
                  style={{ fontSize: 12.5, fontWeight: 700 }}
                />
              ) : (
                <span className={styles.label} style={{ fontSize: 12.5, fontWeight: 700 }}>
                  {data.label}
                </span>
              )}
            </div>
          )}
        </div>
      ) : isContainer ? (
        <div
          className={styles.containerBadge}
          style={{ background: "var(--dg-node-fill, #eef2ff)", color: data.textColor }}
          onDoubleClick={startEditing}
        >
          {data.icon && <Icon name={data.icon} className={styles.containerBadgeIcon} />}
          {editing ? (
            <input
              autoFocus
              className={cx(styles.labelInput, "nodrag", "nopan")}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitLabel}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitLabel();
                if (e.key === "Escape") setEditing(false);
              }}
              style={{ fontSize: 12.5, fontWeight: 700 }}
            />
          ) : (
            <span className={styles.label} style={{ fontSize: 12.5, fontWeight: 700 }}>
              {data.label}
            </span>
          )}
        </div>
      ) : (
        <div className={isLabelBelow ? styles.deviceLabelLayer : styles.contentLayer}>
          {!isLabelBelow && data.icon && <Icon name={data.icon} className={styles.icon} />}
          {data.showLabel &&
            (editing ? (
              <input
                autoFocus
                className={cx(styles.labelInput, "nodrag", "nopan")}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commitLabel}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitLabel();
                  if (e.key === "Escape") setEditing(false);
                }}
                style={labelStyle}
              />
            ) : (
              <span className={styles.label} style={labelStyle} onDoubleClick={startEditing}>
                {data.label}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}
