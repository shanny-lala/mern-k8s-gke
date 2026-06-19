import { useState } from 'react';
import { HiOutlinePlus, HiOutlineX } from 'react-icons/hi';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import TaskStats from '../components/tasks/TaskStats';
import { useTasks } from '../hooks/useTasks';
import styles from './TasksPage.module.css';

export default function TasksPage() {
  const {
    tasks,
    stats,
    pagination,
    loading,
    error,
    filters,
    applyFilter,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useTasks();

  const [showForm, setShowForm] = useState(false);

  async function onSubmit(data) {
    await handleCreate(data);
    setShowForm(false);
  }

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Gestion des Tâches</h1>
            <p className={styles.pageSubtitle}>
              Créez, filtrez et gérez vos tâches. Les données sont persistées dans MongoDB.
            </p>
          </div>
          <button
            className={`btn btn-primary ${showForm ? 'btn-secondary' : ''}`}
            onClick={() => setShowForm((v) => !v)}
            id="toggle-task-form"
          >
            {showForm ? (
              <>
                <HiOutlineX /> Fermer
              </>
            ) : (
              <>
                <HiOutlinePlus /> Nouvelle tâche
              </>
            )}
          </button>
        </div>

        {showForm && (
          <div className={`${styles.formWrapper} animate-fade-in`}>
            <TaskForm onSubmit={onSubmit} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {stats && (
          <div className={styles.statsWrapper}>
            <TaskStats stats={stats} />
          </div>
        )}

        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          filters={filters}
          pagination={pagination}
          onFilterChange={applyFilter}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
