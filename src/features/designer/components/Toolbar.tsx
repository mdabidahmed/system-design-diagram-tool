import { useEffect, useRef, useState } from "react";
import { useReactFlow, useViewport } from "@xyflow/react";
import { cx } from "@/utils/cx";
import { useDesigner } from "../hooks/DesignerContext";
import styles from "./Toolbar.module.css";

function useClickOutside(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);
  return ref;
}

export function Toolbar() {
  const {
    title,
    setTitle,
    undo,
    redo,
    canUndo,
    canRedo,
    saveCurrent,
    newDiagram,
    loadDiagram,
    removeDiagram,
    savedList,
    exportPNG,
    exportJSON,
  } = useDesigner();
  const reactFlow = useReactFlow();
  const { zoom } = useViewport();
  const [exportOpen, setExportOpen] = useState(false);
  const [filesOpen, setFilesOpen] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const exportRef = useClickOutside(() => setExportOpen(false));
  const filesRef = useClickOutside(() => setFilesOpen(false));

  const handleSave = () => {
    saveCurrent();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1600);
  };

  return (
    <header className={styles.bar}>
      <input
        className={styles.titleInput}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Diagram title"
      />

      <div className={styles.menuWrap} ref={filesRef}>
        <button className={styles.menuBtn} onClick={() => setFilesOpen((o) => !o)}>
          My Diagrams ▾
        </button>
        {filesOpen && (
          <div className={styles.menu}>
            <button
              className={styles.menuItem}
              onClick={() => {
                newDiagram();
                reactFlow.setViewport({ x: 0, y: 0, zoom: 1 });
                setFilesOpen(false);
              }}
            >
              + New diagram
            </button>
            <div className={styles.menuDivider} />
            {savedList.length === 0 && <div className={styles.menuEmpty}>No saved diagrams yet.</div>}
            {savedList.map((d) => (
              <button
                key={d.id}
                className={styles.menuItem}
                onClick={() => {
                  loadDiagram(d.id);
                  requestAnimationFrame(() => reactFlow.fitView({ padding: 0.2, maxZoom: 1.25 }));
                  setFilesOpen(false);
                }}
              >
                <span>
                  {d.name}
                  <br />
                  <span className={styles.menuItemMeta}>{new Date(d.updatedAt).toLocaleString()}</span>
                </span>
                <span
                  className={styles.menuItemDelete}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDiagram(d.id);
                  }}
                >
                  ✕
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.spacer} />

      <button className={styles.iconBtn} onClick={undo} disabled={!canUndo} title="Undo">
        ↺
      </button>
      <button className={styles.iconBtn} onClick={redo} disabled={!canRedo} title="Redo">
        ↻
      </button>

      <div className={styles.divider} />

      <div className={styles.zoomGroup}>
        <button className={styles.iconBtn} style={{ border: "none" }} onClick={() => reactFlow.zoomOut()} title="Zoom out">
          −
        </button>
        <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
        <button className={styles.iconBtn} style={{ border: "none" }} onClick={() => reactFlow.zoomIn()} title="Zoom in">
          +
        </button>
      </div>
      <button
        className={styles.iconBtn}
        onClick={() => reactFlow.fitView({ padding: 0.2, maxZoom: 1.25 })}
        title="Fit to screen"
      >
        ⤢
      </button>

      <div className={styles.divider} />

      <div className={styles.menuWrap} ref={exportRef}>
        <button className={styles.menuBtn} onClick={() => setExportOpen((o) => !o)}>
          Export ▾
        </button>
        {exportOpen && (
          <div className={styles.menu}>
            <button
              className={styles.menuItem}
              onClick={() => {
                const wrapper = document.querySelector<HTMLElement>(".react-flow");
                if (wrapper) exportPNG(wrapper);
                setExportOpen(false);
              }}
            >
              Download as PNG
            </button>
            <button
              className={styles.menuItem}
              onClick={() => {
                exportJSON();
                setExportOpen(false);
              }}
            >
              Download as JSON
            </button>
          </div>
        )}
      </div>

      <button className={cx(styles.saveBtn)} onClick={handleSave}>
        {justSaved ? "Saved ✓" : "Save"}
      </button>
    </header>
  );
}
