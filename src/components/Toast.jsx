import styles from './Toast.module.css'

export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite" aria-label="Notifications">
      {toasts.map(t => (
        <div key={t.id} className={styles.toast}>
          <span className={styles.icon} aria-hidden="true">{t.icon}</span>
          <span className={styles.msg}>{t.msg}</span>
          <button className={styles.close} onClick={() => onDismiss(t.id)} aria-label="Dismiss">✕</button>
        </div>
      ))}
    </div>
  )
}
