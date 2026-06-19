import styles from './TaskStats.module.css';

function StatCard({ label, value, colorVar, id }) {
  return (
    <div className={`glass-card ${styles.statCard}`} id={id}>
      <span className={styles.statValue} style={{ color: `var(${colorVar})` }}>
        {value ?? '--'}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

export default function TaskStats({ stats }) {
  if (!stats) return null;

  const completionRate =
    stats.total > 0
      ? Math.round((stats.byStatus.completed / stats.total) * 100)
      : 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        <StatCard
          id="stat-total"
          label="Total"
          value={stats.total}
          colorVar="--color-accent-primary"
        />
        <StatCard
          id="stat-pending"
          label="En attente"
          value={stats.byStatus.pending}
          colorVar="--color-accent-amber"
        />
        <StatCard
          id="stat-in-progress"
          label="En cours"
          value={stats.byStatus['in-progress']}
          colorVar="--color-accent-secondary"
        />
        <StatCard
          id="stat-completed"
          label="Terminées"
          value={stats.byStatus.completed}
          colorVar="--color-accent-green"
        />
        <StatCard
          id="stat-high-priority"
          label="Priorité élevée"
          value={stats.byPriority.high}
          colorVar="--color-accent-red"
        />
        <StatCard
          id="stat-completion-rate"
          label="Taux d'achèvement"
          value={`${completionRate}%`}
          colorVar="--color-accent-purple"
        />
      </div>
    </div>
  );
}
