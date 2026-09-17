import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cx } from "@/utils/cx";
import type { DesignerNode } from "../types";
import styles from "./AnchorNode.module.css";

/**
 * The two draggable endpoints of a free-standing arrow. Each is just a small
 * dot — no shape, no label, no resize. Moving one drags that end of the
 * arrow; React Flow re-routes the connected edge automatically since the
 * edge's source/target point at these node ids.
 */
export function AnchorNode({ selected }: NodeProps<DesignerNode>) {
  return (
    <div className={cx(styles.dot, selected && styles.selected)}>
      <Handle id="center" type="source" position={Position.Top} className={styles.handle} />
    </div>
  );
}
