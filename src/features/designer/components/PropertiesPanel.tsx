import { cx } from "@/utils/cx";
import { useDesigner } from "../hooks/DesignerContext";
import type { LineStyle, ShapeKind, StrokeStyle, TextAlign } from "../types";
import styles from "./PropertiesPanel.module.css";

const SHAPE_OPTIONS: { value: ShapeKind; label: string }[] = [
  { value: "rectangle", label: "Rectangle" },
  { value: "roundedRectangle", label: "Rounded rectangle" },
  { value: "circle", label: "Circle" },
  { value: "diamond", label: "Diamond" },
  { value: "hexagon", label: "Hexagon" },
  { value: "cylinder", label: "Cylinder (DB)" },
  { value: "cloud", label: "Cloud" },
  { value: "device", label: "Device (phone)" },
  { value: "browser", label: "Device (browser)" },
  { value: "queue", label: "Queue (pointer)" },
  { value: "dnsGlobe", label: "DNS (globe)" },
  { value: "lbShield", label: "Load balancer (shield)" },
  { value: "redisMark", label: "Redis mark" },
  { value: "cdnMark", label: "CDN mark" },
  { value: "webServersMark", label: "Web servers (cluster)" },
  { value: "serverMark", label: "Server" },
  { value: "text", label: "Text" },
  { value: "container", label: "Dashed container" },
];

export function PropertiesPanel() {
  const {
    selectedNode,
    selectedEdge,
    updateNodeData,
    updateNodeGeometry,
    updateEdgeData,
    deleteElement,
    duplicateNode,
    bringToFront,
    sendToBack,
    commitHistory,
  } = useDesigner();

  if (selectedNode && selectedNode.type === "anchor") {
    return (
      <aside className={styles.panel}>
        <div className={styles.sectionTitle}>Arrow endpoint</div>
        <p className={styles.empty}>Drag this dot to reposition the arrow. Deleting it removes the whole arrow.</p>
        <div className={styles.section}>
          <button className={styles.deleteBtn} onClick={() => deleteElement(selectedNode.id, "node")}>
            Delete arrow
          </button>
        </div>
      </aside>
    );
  }

  if (selectedNode) {
    const data = selectedNode.data;
    const showCorner =
      data.shapeKind === "rectangle" ||
      data.shapeKind === "roundedRectangle" ||
      data.shapeKind === "device" ||
      data.shapeKind === "browser";
    return (
      <aside className={styles.panel}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>General</div>
          <div className={styles.field}>
            <label>Label</label>
            <input
              type="text"
              value={data.label}
              onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
              onBlur={commitHistory}
            />
          </div>
          <div className={styles.field}>
            <label>Shape type</label>
            <select
              value={data.shapeKind}
              onChange={(e) => {
                updateNodeData(selectedNode.id, { shapeKind: e.target.value as ShapeKind });
                commitHistory();
              }}
            >
              {SHAPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.toggleRow}>
            <span>Show label</span>
            <input
              type="checkbox"
              checked={data.showLabel}
              onChange={(e) => {
                updateNodeData(selectedNode.id, { showLabel: e.target.checked });
                commitHistory();
              }}
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Size &amp; Position</div>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label>X</label>
              <input
                type="number"
                value={Math.round(selectedNode.position.x)}
                onChange={(e) => updateNodeGeometry(selectedNode.id, { x: Number(e.target.value) })}
                onBlur={commitHistory}
              />
            </div>
            <div className={styles.field}>
              <label>Y</label>
              <input
                type="number"
                value={Math.round(selectedNode.position.y)}
                onChange={(e) => updateNodeGeometry(selectedNode.id, { y: Number(e.target.value) })}
                onBlur={commitHistory}
              />
            </div>
          </div>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label>Width</label>
              <input
                type="number"
                value={Math.round(selectedNode.width ?? 160)}
                onChange={(e) =>
                  updateNodeGeometry(selectedNode.id, { width: Math.max(20, Number(e.target.value)) })
                }
                onBlur={commitHistory}
              />
            </div>
            <div className={styles.field}>
              <label>Height</label>
              <input
                type="number"
                value={Math.round(selectedNode.height ?? 80)}
                onChange={(e) =>
                  updateNodeGeometry(selectedNode.id, { height: Math.max(20, Number(e.target.value)) })
                }
                onBlur={commitHistory}
              />
            </div>
          </div>
        </div>

        {data.shapeKind !== "text" &&
          data.shapeKind !== "lbShield" &&
          data.shapeKind !== "redisMark" &&
          data.shapeKind !== "cdnMark" &&
          data.shapeKind !== "webServersMark" &&
          data.shapeKind !== "serverMark" && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Style</div>
            <div className={styles.field}>
              <label>Fill color</label>
              <div className={styles.colorField}>
                <input
                  type="color"
                  value={toHex(data.fill)}
                  onChange={(e) => {
                    updateNodeData(selectedNode.id, { fill: e.target.value });
                    commitHistory();
                  }}
                />
                <span>{data.fill}</span>
              </div>
            </div>
            <div className={styles.field}>
              <label>Border color</label>
              <div className={styles.colorField}>
                <input
                  type="color"
                  value={toHex(data.stroke)}
                  onChange={(e) => {
                    updateNodeData(selectedNode.id, { stroke: e.target.value });
                    commitHistory();
                  }}
                />
                <span>{data.stroke}</span>
              </div>
            </div>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label>Border width</label>
                <input
                  type="number"
                  min={0}
                  value={data.strokeWidth}
                  onChange={(e) => updateNodeData(selectedNode.id, { strokeWidth: Number(e.target.value) })}
                  onBlur={commitHistory}
                />
              </div>
              <div className={styles.field}>
                <label>Border style</label>
                <select
                  value={data.strokeStyle}
                  onChange={(e) => {
                    updateNodeData(selectedNode.id, { strokeStyle: e.target.value as StrokeStyle });
                    commitHistory();
                  }}
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                </select>
              </div>
            </div>
            {showCorner && (
              <div className={styles.field}>
                <label>Corner radius</label>
                <input
                  type="number"
                  min={0}
                  value={data.cornerRadius}
                  onChange={(e) => updateNodeData(selectedNode.id, { cornerRadius: Number(e.target.value) })}
                  onBlur={commitHistory}
                />
              </div>
            )}
          </div>
        )}

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Text</div>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label>Font size</label>
              <input
                type="number"
                min={8}
                value={data.fontSize}
                onChange={(e) => updateNodeData(selectedNode.id, { fontSize: Number(e.target.value) })}
                onBlur={commitHistory}
              />
            </div>
            <div className={styles.field}>
              <label>Weight</label>
              <select
                value={data.fontWeight}
                onChange={(e) => {
                  updateNodeData(selectedNode.id, { fontWeight: Number(e.target.value) });
                  commitHistory();
                }}
              >
                <option value={400}>Normal</option>
                <option value={600}>Semibold</option>
                <option value={700}>Bold</option>
              </select>
            </div>
          </div>
          <div className={styles.field}>
            <label>Text color</label>
            <div className={styles.colorField}>
              <input
                type="color"
                value={toHex(data.textColor)}
                onChange={(e) => {
                  updateNodeData(selectedNode.id, { textColor: e.target.value });
                  commitHistory();
                }}
              />
              <span>{data.textColor}</span>
            </div>
          </div>
          <div className={styles.field}>
            <label>Align</label>
            <div className={styles.segRow}>
              {(["left", "center", "right"] as TextAlign[]).map((align) => (
                <button
                  key={align}
                  type="button"
                  className={cx(styles.segBtn, data.textAlign === align && styles.active)}
                  onClick={() => {
                    updateNodeData(selectedNode.id, { textAlign: align });
                    commitHistory();
                  }}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.actionsRow}>
            <button className={styles.actionBtn} onClick={() => duplicateNode(selectedNode.id)}>
              Duplicate
            </button>
            <button className={styles.actionBtn} onClick={() => bringToFront(selectedNode.id)}>
              To front
            </button>
          </div>
          <div className={styles.actionsRow}>
            <button className={styles.actionBtn} onClick={() => sendToBack(selectedNode.id)}>
              To back
            </button>
            <button className={styles.deleteBtn} onClick={() => deleteElement(selectedNode.id, "node")}>
              Delete
            </button>
          </div>
        </div>
      </aside>
    );
  }

  if (selectedEdge) {
    const data = selectedEdge.data ?? {
      stroke: "#4a63f0",
      strokeWidth: 2,
      strokeStyle: "solid" as StrokeStyle,
      animated: false,
      lineStyle: "bezier" as LineStyle,
    };
    return (
      <aside className={styles.panel}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Connector</div>
          <div className={styles.field}>
            <label>Label</label>
            <input
              type="text"
              value={data.label ?? ""}
              onChange={(e) => updateEdgeData(selectedEdge.id, { label: e.target.value })}
              onBlur={commitHistory}
            />
          </div>
          <div className={styles.field}>
            <label>Line style</label>
            <select
              value={data.lineStyle}
              onChange={(e) => {
                updateEdgeData(selectedEdge.id, { lineStyle: e.target.value as LineStyle });
                commitHistory();
              }}
            >
              <option value="bezier">Curved</option>
              <option value="straight">Straight</option>
              <option value="step">Step (right angles)</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Color</label>
            <div className={styles.colorField}>
              <input
                type="color"
                value={toHex(data.stroke)}
                onChange={(e) => {
                  updateEdgeData(selectedEdge.id, { stroke: e.target.value });
                  commitHistory();
                }}
              />
              <span>{data.stroke}</span>
            </div>
          </div>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label>Width</label>
              <input
                type="number"
                min={1}
                value={data.strokeWidth}
                onChange={(e) => updateEdgeData(selectedEdge.id, { strokeWidth: Number(e.target.value) })}
                onBlur={commitHistory}
              />
            </div>
            <div className={styles.field}>
              <label>Style</label>
              <select
                value={data.strokeStyle}
                onChange={(e) => {
                  updateEdgeData(selectedEdge.id, { strokeStyle: e.target.value as StrokeStyle });
                  commitHistory();
                }}
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
              </select>
            </div>
          </div>
          <div className={styles.toggleRow}>
            <span>Animated flow</span>
            <input
              type="checkbox"
              checked={data.animated}
              onChange={(e) => {
                updateEdgeData(selectedEdge.id, { animated: e.target.checked });
                commitHistory();
              }}
            />
          </div>
        </div>
        <div className={styles.section}>
          <button className={styles.deleteBtn} onClick={() => deleteElement(selectedEdge.id, "edge")}>
            Delete connector
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className={styles.panel}>
      <div className={styles.sectionTitle}>Properties</div>
      <p className={styles.empty}>
        Select a shape or connector on the canvas to edit its label, size, color, and style.
      </p>
    </aside>
  );
}

function toHex(color: string): string {
  if (color.startsWith("#") && (color.length === 7 || color.length === 4)) return color;
  return "#4a63f0";
}
