import { useState } from 'react';
import { HiOutlineCheck, HiOutlineTrash } from 'react-icons/hi';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import styles from './TaskCard.module.css';

const NEXT_STATUS = {
  pending:       'in-progress',
  'in-progress': 'completed',
  completed:     'pending',
};

// Duree (ms) avant annulation de la confirmation de suppression
const CONFIRM_TIMEOUT_MS = 3000;

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleAdvanceStatus() {
    setBusy(true);
    try {
      await onUpdate(task.id, { status: NEXT_STATUS[task.status] });
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), CONFIRM_TIMEOUT_MS);
      return;
    }
    setBusy(true);
    try {
      await onDelete(task.id);
    } finally {
      setBusy(false);
    }
  }

  const createdAt = new Date(task.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className={`glass-card ${styles.card} animate-fade-in`}>
      <div className={styles.header}>
        <div className={styles.badges}>
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
        <time className={styles.date} dateTime={task.createdAt}>
          {createdAt}
        </time>
      </div>

      <h3 className={styles.title}>{task.title}</h3>

      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}

      <div className={styles.actions}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={handleAdvanceStatus}
          disabled={busy}
          title="Avancer le statut"
          aria-label={`Avancer le statut de "${task.title}"`}
        >
          <HiOutlineCheck />
          Avancer
        </button>
        <button
          className={`btn btn-sm ${confirming ? 'btn-danger' : 'btn-secondary'}`}
          onClick={handleDelete}
          disabled={busy}
          aria-label={confirming ? 'Confirmer la suppression' : `Supprimer "${task.title}"`}
        >
          <HiOutlineTrash />
          {confirming ? 'Confirmer ?' : 'Supprimer'}
        </button>
      </div>
    </article>
  );
}
