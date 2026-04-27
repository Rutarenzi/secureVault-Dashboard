import { useRef, useState, useCallback } from 'react'
import { useVaultStore } from './hooks/useVaultStore'
import { useKeyboard } from './hooks/useKeyboard'
import { getPath } from './utils/fileUtils'

import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import MainPanel from './components/MainPanel'
import PropertiesPanel from './components/PropertiesPanel'
import ContextMenu from './components/ContextMenu'
import ToastContainer from './components/Toast'

import styles from './App.module.css'

export default function App() {
  const searchInputRef = useRef(null)
  const [contextMenu, setContextMenu] = useState(null)

  const {
    data,
    nodeMap,
    parentMap,
    expanded,
    selectedId,
    focusedId,
    searchQuery,
    starredIds,
    recentIds,
    toasts,
    searchMatches,
    visibleNodes,
    toggleExpand,
    expandAll,
    collapseAll,
    selectNode,
    setFocusedId,
    setSearchQuery,
    toggleStar,
    showToast,
    dismissToast,
  } = useVaultStore()

  // Keyboard navigation
  useKeyboard({
    visibleNodes,
    focusedId,
    setFocusedId,
    expanded,
    toggleExpand,
    selectNode,
    nodeMap,
    parentMap,
    searchInputRef,
  })

  // Copy path to clipboard
  const handleCopyPath = useCallback((id) => {
    const path = '/' + getPath(id, nodeMap, parentMap).map(n => n.name).join('/')
    navigator.clipboard?.writeText(path).catch(() => {})
    showToast('Path copied to clipboard', '📋')
  }, [nodeMap, parentMap, showToast])

  // Download (demo)
  const handleDownload = useCallback((node) => {
    showToast(`Download queued: ${node.name}`, '⬇️')
  }, [showToast])

  // Context menu builder
  const handleContextMenu = useCallback((e, node) => {
    e.preventDefault()

    // Clamp to viewport
    const x = Math.min(e.clientX, window.innerWidth - 180)
    const y = Math.min(e.clientY, window.innerHeight - 200)

    const isFolder = node.type === 'folder'
    const isStarred = starredIds.has(node.id)

    const items = isFolder
      ? [
          {
            icon: expanded.has(node.id) ? '📂' : '📁',
            label: expanded.has(node.id) ? 'Collapse' : 'Expand',
            action: () => toggleExpand(node.id),
          },
          {
            icon: '⭐',
            label: isStarred ? 'Unstar' : 'Star',
            action: () => {
              toggleStar(node.id)
              showToast(isStarred ? 'Unstarred' : 'Starred', '⭐')
            },
          },
          { sep: true },
          {
            icon: '📋',
            label: 'Copy Path',
            action: () => handleCopyPath(node.id),
          },
        ]
      : [
          {
            icon: '👁️',
            label: 'View Properties',
            action: () => selectNode(node.id),
          },
          {
            icon: '⭐',
            label: isStarred ? 'Unstar' : 'Star',
            action: () => {
              toggleStar(node.id)
              showToast(isStarred ? 'Unstarred' : 'Starred', '⭐')
            },
          },
          { sep: true },
          {
            icon: '📋',
            label: 'Copy Path',
            action: () => handleCopyPath(node.id),
          },
          {
            icon: '⬇️',
            label: 'Download',
            action: () => handleDownload(node),
          },
          { sep: true },
          {
            icon: '🗑️',
            label: 'Delete',
            danger: true,
            action: () => showToast('Delete: demo only — no data modified', '🗑️'),
          },
        ]

    setContextMenu({ x, y, items })
  }, [expanded, starredIds, toggleExpand, toggleStar, selectNode, handleCopyPath, handleDownload, showToast])

  return (
    <div className={styles.app}>
      {/* Top navigation bar */}
      <TopBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchMatches={searchMatches}
        expandAll={expandAll}
        collapseAll={collapseAll}
        searchInputRef={searchInputRef}
      />

      {/* Left sidebar: recursive file tree */}
      <Sidebar
        data={data}
        expanded={expanded}
        selectedId={selectedId}
        focusedId={focusedId}
        searchQuery={searchQuery}
        searchMatches={searchMatches}
        starredIds={starredIds}
        nodeMap={nodeMap}
        onToggleExpand={toggleExpand}
        onSelect={selectNode}
        onFocus={setFocusedId}
        onContextMenu={handleContextMenu}
      />

      {/* Main content: grid view of current folder */}
      <MainPanel
        selectedId={selectedId}
        nodeMap={nodeMap}
        parentMap={parentMap}
        onSelect={selectNode}
        onContextMenu={handleContextMenu}
      />

      {/* Right panel: file properties */}
      <PropertiesPanel
        selectedId={selectedId}
        nodeMap={nodeMap}
        parentMap={parentMap}
        starredIds={starredIds}
        recentIds={recentIds}
        onToggleStar={toggleStar}
        onSelect={selectNode}
        onCopyPath={handleCopyPath}
        onDownload={handleDownload}
      />

      {/* Right-click context menu */}
      {contextMenu && (
        <ContextMenu
          menu={contextMenu}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
