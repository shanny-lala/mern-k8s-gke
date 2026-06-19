import styles from './StatusBadge.module.css';

const STATUS_CONFIG = {
  pending:       { label: 'En attente', className: styles.pending },
  'in-progress': { label: 'En cours',   className: styles.inProgress },
  completed:     { label: 'Terminé',    className: styles.completed },
};

const PRIORITY_CONFIG = {
  low:    { label: 'Faible', className: styles.low },
  medium: { label: 'Moyen',  className: styles.medium },
  high:   { label: 'Élevé',  className: styles.high },
};

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, className: '' };
  return (
    <span className={`badge ${styles.base} ${config.className}`}>
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] || { label: priority, className: '' };
  return (
    <span className={`badge ${styles.base} ${config.className}`}>
      {config.label}
    </span>
  );
}
