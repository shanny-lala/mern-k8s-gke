import { NavLink } from 'react-router-dom';
import { HiOutlineServerStack } from 'react-icons/hi2';
import { HiOutlineHome, HiOutlineClipboardList, HiOutlineInformationCircle } from 'react-icons/hi';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <NavLink to="/" className={styles.brand}>
          <HiOutlineServerStack className={styles.brandIcon} />
          <span className={styles.brandText}>
            MERN<span className={styles.brandAccent}> K8s</span>
          </span>
        </NavLink>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <HiOutlineHome />
            Dashboard
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <HiOutlineClipboardList />
            Tâches
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <HiOutlineInformationCircle />
            À propos
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
