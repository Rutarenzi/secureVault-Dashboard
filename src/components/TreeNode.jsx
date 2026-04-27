import { memo, useCallback } from 'react'
import { getFileIcon, highlightText } from '../utils/fileUtils'
import styles from './TreeNode.module.css'

// Renders text with search highlight spans
function HighlightedName({ text, query }) {
  if (!query) return <span>{text}</span>
  const raw = highlightText(text, query)
  const parts = raw.split(/(%%HL_START%%.*?%%HL_END%%)/g)
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('%%HL_START%%')) {
          const inner = part.replace('%%HL_START%%', '').replace('%%HL_END%%', '')
          return <mark key={i} className={styles.highlight}>{inner}</mark>
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}

const TreeNode = memo(function TreeNode({
  node,
  depth,
  expanded,
  selectedId,
  focusedId,
  searchMatches,
  searchQuery,
  starredIds,
  onToggleExpand,
  onSelect,
  onFocus,
  onContextMenu,
}) {
  const isFolder = node.type === 'folder'
  const isExpanded = expanded.has(node.id)
  const isSelected = selectedId === node.id
  const isStarred = starredIds.has(node.id)
  const isSearchMatch = searchQuery && searchMatches.has(node.id)

  // In search mode, hide nodes not in matches
  if (searchQuery && !searchMatches.has(node.id)) return null

  const icon = isStarred
    ? '⭐'
    : isFolder
    ? isExpanded ? '📂' : '📁'
    : getFileIcon(node.name, node.type)

  const handleClick = useCallback(() => {
    onFocus(node.id)
    onSelect(node.id)
    if (isFolder) onToggleExpand(node.id)
  }, [node.id, isFolder, onFocus, onSelect, onToggleExpand])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }, [handleClick])

  return (
    <div className={styles.node}>
      <div
        id={`tree-row-${node.id}`}
        className={[
          styles.row,
          isSelected ? styles.selected : '',
          isSearchMatch ? styles.searchMatch : '',
        ].join(' ')}
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={isFolder ? isExpanded : undefined}
        tabIndex={0}
        style={{ paddingLeft: `${4 + depth * 16}px` }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, node) }}
        onFocus={() => onFocus(node.id)}
      >
        {/* Expand arrow */}
        <span
          className={[
            styles.expandBtn,
            isFolder ? (isExpanded ? styles.expanded : '') : styles.leaf,
          ].join(' ')}
          aria-hidden="true"
        >
          ▶
        </span>

        {/* Icon */}
        <span className={styles.icon} aria-hidden="true">{icon}</span>

        {/* Name */}
        <span className={styles.name}>
          <HighlightedName text={node.name} query={searchQuery} />
        </span>

        {/* File size badge */}
        {!isFolder && node.size && (
          <span className={styles.size}>{node.size}</span>
        )}
      </div>

      {/* Children */}
      {isFolder && isExpanded && node.children?.length > 0 && (
        <div className={styles.children} role="group">
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
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
          ))}
        </div>
      )}
    </div>
  )
})

export default TreeNode
