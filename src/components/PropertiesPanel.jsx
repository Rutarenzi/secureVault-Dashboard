import { getFileIcon, getFileType, getExtension, getPath } from '../utils/fileUtils'
import styles from './PropertiesPanel.module.css'

function PropRow({ label, value, className }) {
  return (
    <div className={styles.propRow}>
      <span className={styles.propLabel}>{label}</span>
      <span className={`${styles.propValue} ${className || ''}`}>{value}</span>
    </div>
  )
}

export default function PropertiesPanel({
  selectedId,
  nodeMap,
  parentMap,
  starredIds,
  recentIds,
  onToggleStar,
  onSelect,
  onCopyPath,
  onDownload,
}) {
  const node = selectedId ? nodeMap[selectedId] : null
  const isStarred = node ? starredIds.has(node.id) : false

  return (
    <aside className={styles.panel} aria-label="File properties">
      <div className={styles.header}>
        <span className={styles.title}>Properties</span>
        {node && (
          <button
            className={`${styles.starBtn} ${isStarred ? styles.starred : ''}`}
            onClick={() => onToggleStar(node.id)}
            aria-label={isStarred ? 'Unstar' : 'Star this item'}
            title={isStarred ? 'Unstar' : 'Star'}
          >
            {isStarred ? '★' : '☆'}
          </button>
        )}
      </div>

      <div className={styles.scroll}>
        {!node ? (
          <>
            <div className={styles.noSelection} aria-label="No file selected">
              <p className={styles.noSelText}>Select a file or folder to view its properties</p>
            </div>

            {recentIds.length > 0 && (
              <div className={styles.recents}>
                <span className={styles.recentsLabel}>Recently Viewed</span>
                {recentIds.map(id => {
                  const n = nodeMap[id]
                  if (!n) return null
                  return (
                    <button
                      key={id}
                      className={styles.recentItem}
                      onClick={() => onSelect(id)}
                      title={n.name}
                    >
                      <span className={styles.recentIcon} aria-hidden="true">
                        {getFileIcon(n.name, n.type)}
                      </span>
                      <span className={styles.recentName}>{n.name}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          <>
            {/* File icon */}
            <span className={styles.bigIcon} aria-hidden="true">
              {isStarred ? '⭐' : getFileIcon(node.name, node.type)}
            </span>

            {/* Name */}
            <p className={styles.nodeName}>{node.name}</p>

            {/* Type badge */}
            <span className={`${styles.badge} ${node.type === 'file' ? styles.fileBadge : styles.folderBadge}`}>
              {node.type === 'file' ? '📄 FILE' : '📁 FOLDER'}
            </span>

            <div className={styles.divider} />

            {/* Properties */}
            <PropRow label="Name" value={node.name} />
            <PropRow
              label="Type"
              value={node.type === 'file' ? getFileType(node.name) : 'Directory'}
              className={styles.accentVal}
            />
            {node.type === 'file' && node.size && (
              <PropRow label="Size" value={node.size} />
            )}
            {node.type === 'file' && (
              <PropRow label="Extension" value={`.${getExtension(node.name)}`} className={styles.dimVal} />
            )}
            {node.type === 'folder' && (
              <PropRow
                label="Items"
                value={`${node.children?.length ?? 0} direct item${node.children?.length !== 1 ? 's' : ''}`}
              />
            )}
            <PropRow
              label="Depth"
              value={`Level ${getPath(node.id, nodeMap, parentMap).length}`}
              className={styles.dimVal}
            />
            <PropRow label="ID" value={node.id} className={styles.dimVal} />

            <div className={styles.divider} />

            {/* Full path */}
            <div className={styles.propRow}>
              <span className={styles.propLabel}>Full Path</span>
              <code className={styles.pathChain}>
                /{getPath(node.id, nodeMap, parentMap).map(n => n.name).join('/')}
              </code>
            </div>

            <div className={styles.divider} />

            {/* Tags */}
            <div className={styles.propRow}>
              <span className={styles.propLabel}>Tags</span>
              <div className={styles.tagRow}>
                {isStarred && <span className={styles.tag}>⭐ starred</span>}
                <span className={styles.tag}>{node.type}</span>
                {node.type === 'file' && <span className={styles.tag}>.{getExtension(node.name)}</span>}
                {getPath(node.id, nodeMap, parentMap).length === 1 && <span className={styles.tag}>root</span>}
              </div>
            </div>

            <div className={styles.divider} />

            {/* Action buttons */}
            <div className={styles.actions}>
              <button
                className={styles.actionBtn}
                onClick={() => onCopyPath(node.id)}
              >
                📋 Copy Path
              </button>
              {node.type === 'file' && (
                <button
                  className={`${styles.actionBtn} ${styles.actionBtnGreen}`}
                  onClick={() => onDownload(node)}
                >
                  ⬇ Download
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
