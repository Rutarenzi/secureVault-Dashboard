import { useCallback } from 'react'
import TreeNode from './TreeNode'
import styles from './Sidebar.module.css'

const TOTAL_STORAGE = 500
const USED_GB = 156.8
const USED_PCT = Math.round((USED_GB / TOTAL_STORAGE) * 100)

export default function Sidebar({
  data,
  expanded,
  selectedId,
  focusedId,
  searchQuery,
  searchMatches,
  starredIds,
  nodeMap,
  onToggleExpand,
  onSelect,
  onFocus,
  onContextMenu,
}) {
  const totalFiles = Object.values(nodeMap).filter(n => n.type === 'file').length
  const totalFolders = Object.values(nodeMap).filter(n => n.type === 'folder').length

  return (
    <aside className={styles.sidebar} aria-label="File tree">
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.title}>Vault Explorer</span>
        <span className={styles.stats}>{totalFolders}F · {totalFiles}f</span>
      </div>

      {/* Tree */}
      <div className={styles.treeScroll} role="tree" aria-label="File system tree">
        {data.length === 0 || (searchQuery && searchMatches.size === 0) ? (
          <div className={styles.empty}>
            <span>🔍</span>
            <span>No results found</span>
          </div>
        ) : (
          data.map(node => (
            <TreeNode
              key={node.id}
              node={node}
              depth={0}
              expanded={expanded}
              selectedId={selectedId}
              focusedId={focusedId}
              searchMatches={searchMatches}
              searchQuery={searchQuery}
              starredIds={starredIds}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
              onFocus={onFocus}
              onContextMenu={onContextMenu}
            />
          ))
        )}
      </div>

      {/* Footer: storage usage */}
      <div className={styles.footer}>
        <div className={styles.usageRow}>
          <span className={styles.usageLabel}>Storage used</span>
          <span className={styles.usageLabel}>{USED_GB} GB / {TOTAL_STORAGE} GB</span>
        </div>
        <div className={styles.usageBar} role="progressbar" aria-valuenow={USED_PCT} aria-valuemin={0} aria-valuemax={100} aria-label="Storage usage">
          <div className={styles.usageFill} style={{ width: `${USED_PCT}%` }} />
        </div>
        <span className={styles.usagePct}>{USED_PCT}% used</span>
      </div>

      {/* Keyboard hints */}
      <div className={styles.kbHints} aria-label="Keyboard shortcuts">
        {[
          ['↑↓', 'navigate'],
          ['→', 'expand'],
          ['←', 'collapse'],
          ['↵', 'select'],
          ['/', 'search'],
        ].map(([key, label]) => (
          <span key={key} className={styles.kbItem}>
            <kbd className={styles.kbd}>{key}</kbd>
            <span>{label}</span>
          </span>
        ))}
      </div>
    </aside>
  )
}
