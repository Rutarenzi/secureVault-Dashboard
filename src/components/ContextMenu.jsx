import { useEffect, useRef } from 'react'
import styles from './ContextMenu.module.css'

export default function ContextMenu({ menu, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    function handleEsc(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  if (!menu) return null

  return (
    <div
      ref={ref}
      className={styles.menu}
      style={{ left: menu.x, top: menu.y }}
      role="menu"
      aria-label="Context menu"
    >
      {menu.items.map((item, i) =>
        item.sep ? (
          <div key={i} className={styles.sep} role="separator" />
        ) : (
          <button
            key={i}
            className={`${styles.item} ${item.danger ? styles.danger : ''}`}
            role="menuitem"
            onClick={() => { item.action(); onClose() }}
          >
            <span className={styles.itemIcon} aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        )
      )}
    </div>
  )
}
