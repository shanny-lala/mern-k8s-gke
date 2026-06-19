import TaskCard from './TaskCard';
import LoadingSpinner from '../common/LoadingSpinner';
import styles from './TaskList.module.css';

const STATUSES = [
  { value: '', label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'in-progress', label: 'En cours' },
  { value: 'completed', label: 'Terminés' },
];

const PRIORITIES = [
  { value: '', label: 'Toutes' },
  { value: 'high', label: 'Élevé' },
  { value: 'medium', label: 'Moyen' },
  { value: 'low', label: 'Faible' },
];

export default function TaskList({
  tasks = [],
  loading = false,
  error = null,
  filters = {},
  pagination = null,
  onFilterChange,
  onUpdate,
  onDelete,
}) {
  if (loading) return <LoadingSpinner label="Chargement des tâches..." />;

  if (error) {
    return (
      <div className={styles.errorState} role="alert">
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label htmlFor="filter-status" className={styles.filterLabel}>
            Statut
          </label>
          <select
            id="filter-status"
            className={`input select ${styles.filterSelect}`}
            value={filters?.status || ''}
            onChange={(e) => onFilterChange?.({ status: e.target.value || undefined })}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="filter-priority" className={styles.filterLabel}>
            Priorité
          </label>
          <select
            id="filter-priority"
            className={`input select ${styles.filterSelect}`}
            value={filters?.priority || ''}
            onChange={(e) => onFilterChange?.({ priority: e.target.value || undefined })}
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {pagination && (
          <p className={styles.count}>
            {pagination.total} tâche{pagination.total !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Aucune tâche trouvée</p>
          <p className={styles.emptyHint}>Créez votre première tâche via le formulaire.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className="btn btn-secondary btn-sm"
            disabled={pagination.page <= 1}
            onClick={() => onFilterChange({ page: pagination.page - 1 })}
            id="pagination-prev"
          >
            Précédent
          </button>
          <span className={styles.paginationInfo}>
            Page {pagination.page} / {pagination.totalPages}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onFilterChange({ page: pagination.page + 1 })}
            id="pagination-next"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
