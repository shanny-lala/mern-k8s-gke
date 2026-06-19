import { createContext, useContext, useReducer, useCallback } from 'react';
import { taskApi } from '../services/api';

const TaskContext = createContext(null);

const initialState = {
  tasks: [],
  stats: null,
  pagination: null,
  loading: false,
  error: null,
};

function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: null };

    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'SET_TASKS':
      return {
        ...state,
        loading: false,
        tasks: Array.isArray(action.payload.data) ? action.payload.data : [],
        pagination: action.payload.pagination || null,
      };

    case 'SET_STATS':
      return { ...state, stats: action.payload };

    case 'ADD_TASK': {
      const currentTasks = Array.isArray(state.tasks) ? state.tasks : [];
      return { ...state, tasks: [action.payload, ...currentTasks] };
    }

    case 'UPDATE_TASK': {
      const currentTasks = Array.isArray(state.tasks) ? state.tasks : [];
      return {
        ...state,
        tasks: currentTasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    }

    case 'REMOVE_TASK': {
      const currentTasks = Array.isArray(state.tasks) ? state.tasks : [];
      return {
        ...state,
        tasks: currentTasks.filter((t) => t.id !== action.payload),
      };
    }

    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const result = await taskApi.getAll(params);
      dispatch({ type: 'SET_TASKS', payload: result });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const result = await taskApi.getStats();
      dispatch({ type: 'SET_STATS', payload: result.data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const createTask = useCallback(async (data) => {
    const result = await taskApi.create(data);
    dispatch({ type: 'ADD_TASK', payload: result.data });
    return result.data;
  }, []);

  const updateTask = useCallback(async (id, data) => {
    const result = await taskApi.update(id, data);
    dispatch({ type: 'UPDATE_TASK', payload: result.data });
    return result.data;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await taskApi.remove(id);
    dispatch({ type: 'REMOVE_TASK', payload: id });
  }, []);

  const value = {
    ...state,
    fetchTasks,
    fetchStats,
    createTask,
    updateTask,
    deleteTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used inside TaskProvider');
  }
  return context;
}
