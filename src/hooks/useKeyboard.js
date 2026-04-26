import { useEffect } from 'react'

export function useKeyboard({
  visibleNodes,
  focusedId,
  setFocusedId,
  expanded,
  toggleExpand,
  selectNode,
  nodeMap,
  parentMap,
  searchInputRef,
}) {
  useEffect(() => {
    function onKeyDown(e) {
      // '/' focuses search
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault()
        searchInputRef.current?.focus()
        return
      }

      if (e.key === 'Escape') {
        searchInputRef.current?.blur()
        return
      }

      // Skip if typing in search
      if (document.activeElement === searchInputRef.current) return

      const idx = visibleNodes.findIndex(n => n.id === focusedId)

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = visibleNodes[idx + 1]
        if (next) {
          setFocusedId(next.id)
          document.getElementById('tree-row-' + next.id)?.focus()
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = visibleNodes[idx - 1]
        if (prev) {
          setFocusedId(prev.id)
          document.getElementById('tree-row-' + prev.id)?.focus()
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        const node = nodeMap[focusedId]
        if (node?.type === 'folder' && !expanded.has(focusedId)) {
          toggleExpand(focusedId)
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        const node = nodeMap[focusedId]
        if (node?.type === 'folder' && expanded.has(focusedId)) {
          toggleExpand(focusedId)
        } else {
          const pid = parentMap[focusedId]
          if (pid) {
            setFocusedId(pid)
            document.getElementById('tree-row-' + pid)?.focus()
          }
        }
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (focusedId) {
          selectNode(focusedId)
          const node = nodeMap[focusedId]
          if (node?.type === 'folder') toggleExpand(focusedId)
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [visibleNodes, focusedId, expanded, nodeMap, parentMap, setFocusedId, toggleExpand, selectNode, searchInputRef])
}
