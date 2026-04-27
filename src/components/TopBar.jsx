import { useRef } from 'react'
import styles from './TopBar.module.css'

export default function TopBar({
  searchQuery,
  setSearchQuery,
  searchMatches,
  expandAll,
  collapseAll,
  searchInputRef,
}) {
  const matchCount = searchMatches.size

  return (
    <header className={styles.topbar} role="banner">
      {/* Brand */}
      <div className={styles.brand}>
        <span className={styles.brandName}>SecureVault</span>
      </div>

      <div className={styles.divider} />

      {/* Search */}
      <div className={styles.searchWrap} role="search">
        <span className={styles.searchIcon} aria-hidden="true">⌕</span>
        <input
          ref={searchInputRef}
          className={styles.searchInput}
          type="text"
          placeholder="Search vault… (press /)"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          aria-label="Search files and folders"
          autoComplete="off"
          spellCheck={false}
        />
        {searchQuery && (
          <button
            className={styles.clearBtn}
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >✕</button>
        )}
        {searchQuery && (
          <span className={styles.matchBadge} aria-live="polite">
            {matchCount} match{matchCount !== 1 ? 'es' : ''}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <div className={styles.divider} />
        <button className={styles.actionBtn} onClick={collapseAll} title="Collapse all folders">
          ⊖ Collapse All
        </button>
        <button className={styles.actionBtn} onClick={expandAll} title="Expand all folders">
          ⊕ Expand All
        </button>
      </div>
    </header>
  )
}
