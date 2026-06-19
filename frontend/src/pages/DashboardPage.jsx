import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineRefresh } from 'react-icons/hi';
import { HiOutlineServerStack } from 'react-icons/hi2';
import TaskStats from '../components/tasks/TaskStats';
import TaskCard from '../components/tasks/TaskCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useTaskContext } from '../context/TaskContext';
import { healthApi } from '../services/api';
import styles from './DashboardPage.module.css';

// Nombre de taches recentes affichees sur le dashboard
const DASHBOARD_TASK_LIMIT = 6;

function ArchNode({ label, color, top, left }) {
  const nodeStyle = {
    position: 'absolute',
    top,
    left,
    transform: 'translate(-50%, -50%)',
    padding: '6px 16px',
    background: 'rgba(30, 41, 59, 0.9)',
    border: `1px solid ${color}`,
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    color,
    whiteSpace: 'nowrap',
    boxShadow: '0 0 12px rgba(0,0,0,0.3)',
  };
  return <div style={nodeStyle}>{label}</div>;
}

export default function DashboardPage() {
  const {
    tasks = [],
    stats,
    loading,
    error,
    fetchTasks,
    fetchStats,
    updateTask,
    deleteTask,
  } = useTaskContext();

  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    fetchTasks({ limit: DASHBOARD_TASK_LIMIT });
    fetchStats();
  }, [fetchTasks, fetchStats]);

  useEffect(() => {
    healthApi
      .check()
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  const recentTasks = tasks.slice(0, DASHBOARD_TASK_LIMIT);

  return (
    <main className={styles.page}>
      <div className="container">
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span
                className={`${styles.statusDot} ${
                  apiStatus === 'online' ? styles.dotOnline : styles.dotOffline
                }`}
              />
              API{' '}
              {apiStatus === 'online'
                ? 'en ligne'
                : apiStatus === 'offline'
                ? 'hors ligne'
                : 'vérification...'}
            </div>
            <h1 className={styles.heroTitle}>Tableau de Bord</h1>
            <p className={styles.heroSubtitle}>
              Application MERN déployée sur Kubernetes avec autoscaling horizontal.
              Gestion de tâches distribuée, haute disponibilité et optimisation des coûts.
            </p>
            <div className={styles.heroActions}>
              <Link to="/tasks" className="btn btn-primary btn-lg" id="dashboard-go-tasks">
                Gérer les tâches
                <HiOutlineArrowRight />
              </Link>
              <Link to="/about" className="btn btn-secondary btn-lg" id="dashboard-go-about">
                Architecture
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <ArchNode label="Frontend" color="var(--color-accent-primary)" top="10%" left="50%" />
              <ArchNode label="Backend 1" color="var(--color-accent-secondary)" top="50%" left="15%" />
              <ArchNode label="Backend 2" color="var(--color-accent-secondary)" top="50%" left="75%" />
              <ArchNode label="MongoDB" color="var(--color-accent-green)" top="82%" left="50%" />
              <svg
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                viewBox="0 0 300 240"
                aria-hidden="true"
              >
                <line x1="150" y1="40" x2="55" y2="120" stroke="rgba(14,165,233,0.25)" strokeWidth="1.5" strokeDasharray="4 3" />
                <line x1="150" y1="40" x2="235" y2="120" stroke="rgba(14,165,233,0.25)" strokeWidth="1.5" strokeDasharray="4 3" />
                <line x1="55" y1="120" x2="150" y2="195" stroke="rgba(16,185,129,0.25)" strokeWidth="1.5" strokeDasharray="4 3" />
                <line x1="235" y1="120" x2="150" y2="195" stroke="rgba(16,185,129,0.25)" strokeWidth="1.5" strokeDasharray="4 3" />
              </svg>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Statistiques</h2>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                fetchTasks({ limit: DASHBOARD_TASK_LIMIT });
                fetchStats();
              }}
              id="dashboard-refresh"
              title="Actualiser"
            >
              <HiOutlineRefresh />
              Actualiser
            </button>
          </div>
          <TaskStats stats={stats} />
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tâches récentes</h2>
            <Link to="/tasks" className="btn btn-secondary btn-sm" id="dashboard-see-all">
              Voir tout
              <HiOutlineArrowRight />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <p className={styles.errorText}>{error}</p>
          ) : recentTasks.length === 0 ? (
            <div className={styles.emptyState}>
              <HiOutlineServerStack className={styles.emptyIcon} />
              <p>Aucune tâche. Commencez par en créer une.</p>
              <Link to="/tasks" className="btn btn-primary">
                Créer une tâche
              </Link>
            </div>
          ) : (
            <div className={styles.taskGrid}>
              {recentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
