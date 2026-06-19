import { useState } from 'react';
import { HiOutlinePlus, HiOutlineX } from 'react-icons/hi';
import styles from './TaskForm.module.css';

const DEFAULT_FORM = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
};

// Constantes pour eviter les valeurs magiques
const TITLE_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 1000;
const DESCRIPTION_ROWS = 3;

export default function TaskForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(form);
      setForm(DEFAULT_FORM);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={`glass-card ${styles.form}`} onSubmit={handleSubmit} noValidate>
      <div className={styles.formHeader}>
        <h3 className={styles.formTitle}>Nouvelle Tâche</h3>
        {onCancel && (
          <button
            type="button"
            className={`btn btn-secondary btn-sm ${styles.closeBtn}`}
            onClick={onCancel}
            aria-label="Fermer le formulaire"
          >
            <HiOutlineX />
          </button>
        )}
      </div>

      {error && (
        <div className={styles.errorMsg} role="alert">
          {error}
        </div>
      )}

      <div className={styles.fields}>
        <div className="form-group">
          <label htmlFor="task-title" className="form-label">
            Titre <span className={styles.required}>*</span>
          </label>
          <input
            id="task-title"
            name="title"
            type="text"
            className="input"
            placeholder="Titre de la tâche"
            value={form.title}
            onChange={handleChange}
            required
            maxLength={TITLE_MAX_LENGTH}
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-description" className="form-label">
            Description
          </label>
          <textarea
            id="task-description"
            name="description"
            className={`input ${styles.textarea}`}
            placeholder="Description optionnelle"
            value={form.description}
            onChange={handleChange}
            maxLength={DESCRIPTION_MAX_LENGTH}
            rows={DESCRIPTION_ROWS}
          />
        </div>

        <div className={styles.row}>
          <div className="form-group">
            <label htmlFor="task-status" className="form-label">
              Statut
            </label>
            <select
              id="task-status"
              name="status"
              className="input select"
              value={form.status}
              onChange={handleChange}
            >
              <option value="pending">En attente</option>
              <option value="in-progress">En cours</option>
              <option value="completed">Terminé</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="task-priority" className="form-label">
              Priorité
            </label>
            <select
              id="task-priority"
              name="priority"
              className="input select"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="low">Faible</option>
              <option value="medium">Moyen</option>
              <option value="high">Élevé</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.formActions}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || !form.title.trim()}
          id="task-form-submit"
        >
          <HiOutlinePlus />
          {submitting ? 'Ajout en cours...' : 'Ajouter la tâche'}
        </button>
      </div>
    </form>
  );
}
