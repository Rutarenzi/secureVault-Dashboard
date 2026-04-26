import { useMemo } from 'react'
import { getFileIcon, getPath } from '../utils/fileUtils'
import styles from './MainPanel.module.css'

function Breadcrumb({ node, nodeMap, parentMap, onSelect }) {
  if (!node) return <span className={styles.crumb}>/ vault root</span>
  const path = getPath(node.id, nodeMap, parentMap)
  return (
    <nav className={styles.breadcrumb} aria-label="Folder path">
      {path.map((n, i) => {
        const isLast = i === path.length - 1
        return (
          <span key={n.id} className={styles.crumbGroup}>
            {i > 0 && <span className={styles.sep} aria-hidden="true">/</span>}
            <button
              className={`${styles.crumb} ${isLast ? styles.crumbCurrent : ''}`}
              onClick={() => onSelect(n.id)}
              aria-current={isLast ? 'page' : undefined}
            >
              {n.name}
            </button>
          </span>
        )
      })}
    </nav>
  )
}

function GridCard({ node, isSelected, onSelect, onContextMenu }) {
  const icon = getFileIcon(node.name, node.type)
  const childCount = node.type === 'folder' ? (node.children?.length ?? 0) : null

  return (
    <article
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
      onClick={() => onSelect(node.id)}
      onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, node) }}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      aria-label={`${node.type === 'folder' ? 'Folder' : 'File'}: ${node.name}`}
      onKeyDown={e => { if (e.key === 'Enter') onSelect(node.id) }}
    >
      <span className={styles.cardIcon} aria-hidden="true">{icon}</span>
      <span className={styles.cardName}>{node.name}</span>
      <span className={styles.cardMeta}>
        {node.type === 'folder'
          ? `${childCount} item${childCount !== 1 ? 's' : ''}`
          : node.size || '—'
        }
      </span>
    </article>
  )
}

export default function MainPanel({
  selectedId,
  nodeMap,
  parentMap,
  onSelect,
  onContextMenu,
}) {
  const selectedNode = selectedId ? nodeMap[selectedId] : null

  // Determine which folder to show in grid
  const folderNode = useMemo(() => {
    if (!selectedNode) return null
    if (selectedNode.type === 'folder') return selectedNode
    const pid = parentMap[selectedNode.id]
    return pid ? nodeMap[pid] : null
  }, [selectedNode, nodeMap, parentMap])

  const folders = folderNode?.children?.filter(n => n.type === 'folder') ?? []
  const files = folderNode?.children?.filter(n => n.type === 'file') ?? []

  return (
    <main className={styles.panel} aria-label="File browser">
      {/* Breadcrumb */}
      <div className={styles.breadcrumbBar}>
        <Breadcrumb
          node={folderNode}
          nodeMap={nodeMap}
          parentMap={parentMap}
          onSelect={onSelect}
        />
      </div>

      <div className={styles.content}>
        {!folderNode ? (
          <div className={styles.welcome} aria-label="Welcome state">
            <span className={styles.welcomeIcon} aria-hidden="true">🔐</span>
            <p className={styles.welcomeText}>Select a file or folder to explore</p>
            <p className={styles.welcomeSub}>Use keyboard ↑↓ to navigate or click the tree</p>
          </div>
        ) : (
          <>
            {folders.length > 0 && (
              <section className={styles.section} aria-label="Folders">
                <h2 className={styles.sectionLabel}>Folders ({folders.length})</h2>
                <div className={styles.grid}>
                  {folders.map(n => (
                    <GridCard
                      key={n.id}
                      node={n}
                      isSelected={selectedId === n.id}
                      onSelect={onSelect}
                      onContextMenu={onContextMenu}
                    />
                  ))}
                </div>
              </section>
            )}

            {files.length > 0 && (
              <section className={styles.section} aria-label="Files">
                <h2 className={styles.sectionLabel}>Files ({files.length})</h2>
                <div className={styles.grid}>
                  {files.map(n => (
                    <GridCard
                      key={n.id}
                      node={n}
                      isSelected={selectedId === n.id}
                      onSelect={onSelect}
                      onContextMenu={onContextMenu}
                    />
                  ))}
                </div>
              </section>
            )}

            {folders.length === 0 && files.length === 0 && (
              <div className={styles.welcome}>
                <span className={styles.welcomeIcon} aria-hidden="true">📭</span>
                <p className={styles.welcomeText}>This folder is empty</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
