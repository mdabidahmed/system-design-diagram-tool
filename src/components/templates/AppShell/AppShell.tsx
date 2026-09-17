import { Outlet } from "react-router-dom";
import { TopNav } from "@/components/organisms/TopNav";
import styles from "./AppShell.module.css";

export function AppShell() {
  return (
    <div className={styles.shell}>
      <TopNav />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
