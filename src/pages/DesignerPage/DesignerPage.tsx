import { ReactFlowProvider } from "@xyflow/react";
import { DesignerProvider } from "@/features/designer/hooks/DesignerContext";
import { Toolbar } from "@/features/designer/components/Toolbar";
import { Palette } from "@/features/designer/components/Palette";
import { PropertiesPanel } from "@/features/designer/components/PropertiesPanel";
import { DesignerCanvas } from "@/features/designer/DesignerCanvas";
import styles from "./DesignerPage.module.css";

export function DesignerPage() {
  return (
    <ReactFlowProvider>
      <DesignerProvider>
        <div className={styles.page}>
          <Toolbar />
          <div className={styles.body}>
            <Palette />
            <DesignerCanvas />
            <PropertiesPanel />
          </div>
        </div>
      </DesignerProvider>
    </ReactFlowProvider>
  );
}
