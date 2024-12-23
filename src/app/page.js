import Image from "next/image";
import styles from "./page.module.css";
import Task from "./Task";

export default function Home() {
  return (
    <div className={styles.page}>
      <Task />
    </div>
  );
}
