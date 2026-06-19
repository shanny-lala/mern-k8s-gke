import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.copy}>
          {year} - Projet academique GCP / Kubernetes / MERN
        </p>
        <div className={styles.badges}>
          <span className={styles.badge}>React</span>
          <span className={styles.badge}>Node.js</span>
          <span className={styles.badge}>MongoDB</span>
          <span className={styles.badge}>Kubernetes</span>
          <span className={styles.badge}>Docker</span>
        </div>
      </div>
    </footer>
  );
}
