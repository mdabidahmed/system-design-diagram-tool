import { Link } from "react-router-dom";
import { Button } from "@/components/atoms/Button";
import styles from "./NotFoundPage.module.css";

export function NotFoundPage() {
  return (
    <div className={`container ${styles.wrap}`}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>This page doesn't resolve.</h1>
      <p className={styles.text}>
        Like a bad DNS lookup, this route didn't return an address we recognize.
      </p>
      <Link to="/">
        <Button>Back to the diagram tool</Button>
      </Link>
    </div>
  );
}
