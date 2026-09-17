import { useMemo, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { PALETTE, PALETTE_CATEGORIES } from "../data/paletteData";
import { Icon } from "../icons/icons";
import { useDesigner } from "../hooks/DesignerContext";
import styles from "./Palette.module.css";

export const DND_MIME = "application/sda-designer-item";

export function Palette() {
  const [query, setQuery] = useState("");
  const { addNodeAt, addFreeArrow } = useDesigner();
  const reactFlow = useReactFlow();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PALETTE;
    return PALETTE.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  const handleClickAdd = (item: (typeof PALETTE)[number]) => {
    const center = reactFlow.screenToFlowPosition({
      x: window.innerWidth / 2 - 260,
      y: window.innerHeight / 2,
    });
    if (item.type === "arrow") {
      addFreeArrow({ x: center.x - 70, y: center.y });
      return;
    }
    const jitter = () => (Math.random() - 0.5) * 40;
    addNodeAt(item, {
      x: center.x - item.defaultWidth / 2 + jitter(),
      y: center.y - item.defaultHeight / 2 + jitter(),
    });
  };

  return (
    <aside className={styles.panel}>
      <input
        className={styles.search}
        placeholder="Search components…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {PALETTE_CATEGORIES.map((category) => {
        const items = filtered.filter((i) => i.category === category);
        if (items.length === 0) return null;
        return (
          <div key={category}>
            <div className={styles.category}>{category}</div>
            <div className={styles.grid}>
              {items.map((item) => (
                <div
                  key={item.type}
                  className={styles.item}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(DND_MIME, JSON.stringify(item));
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onClick={() => handleClickAdd(item)}
                  title={`Drag onto the canvas, or click to add — ${item.label}`}
                >
                  <span className={styles.itemIcon}>
                    {item.icon ? <Icon name={item.icon} /> : <ShapePreview kind={item.type} />}
                  </span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <p className={styles.hint}>
        Drag a component onto the canvas, or click it to drop it in the middle. Use{" "}
        <strong>Arrow</strong> for a free-standing connector, or drag from a shape's edge (the
        small dots) to connect two shapes directly. Double-click any label to rename it.
      </p>
    </aside>
  );
}

function ShapePreview({ kind }: { kind: string }) {
  const common = { width: "1em", height: "1em", viewBox: "0 0 24 24" };
  switch (kind) {
    case "rectangle":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "roundedRectangle":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "circle":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "diamond":
      return (
        <svg {...common}>
          <polygon points="12,3 21,12 12,21 3,12" fill="none" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "hexagon":
      return (
        <svg {...common}>
          <polygon points="7,3 17,3 21,12 17,21 7,21 3,12" fill="none" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h15M13 6l6 6-6 6" />
        </svg>
      );
    case "text":
      return (
        <svg {...common}>
          <text x="12" y="17" textAnchor="middle" fontSize="15" fontWeight="700" fill="currentColor">
            T
          </text>
        </svg>
      );
    case "container":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 2.2" />
        </svg>
      );
    case "mobile":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7.5" y="2.5" width="9" height="19" rx="2.2" />
          <circle cx="12" cy="18" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "browser":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2.5" y="4" width="19" height="13" rx="1.8" />
          <path d="M10.3 19.8h3.4M8 22h8" />
        </svg>
      );
    case "queue":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
          <polygon points="2,6 16,6 21,12 16,18 2,18" />
          <rect x="5" y="9" width="4.5" height="6" rx="0.6" strokeWidth="1.2" />
          <path d="M5 9.8l2.25 2 2.25-2" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}
