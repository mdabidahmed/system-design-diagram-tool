import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import styles from "./TopNav.module.css";

export function TopNav() {
  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandMark}>SD</span>
          <span className={styles.brandText}>
            System Design <strong>Diagram Tool</strong>
          </span>
        </Link>

        <div className={styles.actions}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
