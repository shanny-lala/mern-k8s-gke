import { useEffect, useState, useCallback } from 'react';
import { useTaskContext } from '../context/TaskContext';

export function useTasks(initialFilters = {}) {
  const {
    tasks,
    stats,
    pagination,
    loading,
    error,
    fetchTasks,
    fetchStats,
    createTask,
    updateTask,
    deleteTask,
  } = useTaskContext();

  const [filters, setFilters] = useState(initialFilters);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchTasks(filters);
  }, [fetchTasks, filters]);

  const applyFilter = useCallback((newFilters) => {
    setFilters((prev) => {
      // Si c'est un changement de page explicite, on conserve la page demandee.
      // Si c'est un changement de filtre (statut, priorite...), on revient a la page 1.
      const isPageNavigation = 'page' in newFilters && Object.keys(newFilters).length === 1;
      return {
        ...prev,
        ...newFilters,
        page: isPageNavigation ? newFilters.page : 1,
      };
    });
  }, []);

  const handleCreate = useCallback(
    async (data) => {
      setFormError(null);
      try {
        const task = await createTask(data);
        await fetchStats();
        return task;
      } catch (err) {
        setFormError(err.message);
        throw err;
      }
    },
    [createTask, fetchStats]
  );

  const handleUpdate = useCallback(
    async (id, data) => {
      setFormError(null);
      try {
        const task = await updateTask(id, data);
        await fetchStats();
        return task;
      } catch (err) {
        setFormError(err.message);
        throw err;
      }
    },
    [updateTask, fetchStats]
  );

  const handleDelete = useCallback(
    async (id) => {
      try {
        await deleteTask(id);
        await fetchStats();
      } catch (err) {
        setFormError(err.message);
        throw err;
      }
    },
    [deleteTask, fetchStats]
  );

  return {
    tasks,
    stats,
    pagination,
    loading,
    error,
    filters,
    formError,
    applyFilter,
    handleCreate,
    handleUpdate,
    handleDelete,
    refresh: () => fetchTasks(filters),
  };
}
