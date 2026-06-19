import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ size = 'md', label = 'Chargement...' }) {
  const sizeClass = styles[`size-${size}`] || styles['size-md'];
  return (
    <div className={styles.wrapper} role="status" aria-label={label}>
      <span className={`${styles.spinner} ${sizeClass}`} />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
