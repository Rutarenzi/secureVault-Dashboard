import { useState, useCallback, useMemo } from 'react'
import data from '../data.json'
import { buildMaps, computeSearchMatches, flattenVisible } from '../utils/fileUtils'

const { nodeMap, parentMap } = buildMaps(data)

export function useVaultStore() {
  const [expanded, setExpanded] = useState(
    () => new Set(['root_1', 'root_2', 'root_3', 'root_4'])
  )
  const [selectedId, setSelectedId] = useState(null)
  const [focusedId, setFocusedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [starredIds, setStarredIds] = useState(new Set())
  const [recentIds, setRecentIds] = useState([])
  const [toasts, setToasts] = useState([])

  // Computed: search matches
  const searchMatches = useMemo(() => {
    if (!searchQuery) return new Set()
    const exp = new Set(expanded)
    const matches = computeSearchMatches(data, searchQuery, exp)
    if (matches.size) setExpanded(exp)
    return matches
  }, [searchQuery]) // eslint-disable-line

  // Computed: flat visible list for keyboard nav
  const visibleNodes = useMemo(
    () => flattenVisible(data, expanded, searchMatches, searchQuery),
    [expanded, searchMatches, searchQuery]
  )

  const toggleExpand = useCallback((id) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const expandAll = useCallback(() => {
    const all = new Set()
    function walk(nodes) {
      for (const n of nodes) {
        if (n.type === 'folder') {
          all.add(n.id)
          if (n.children) walk(n.children)
        }
      }
    }
    walk(data)
    setExpanded(all)
  }, [])

  const collapseAll = useCallback(() => setExpanded(new Set()), [])

  const selectNode = useCallback((id) => {
    setSelectedId(id)
    setFocusedId(id)
    setRecentIds(prev => {
      const next = [id, ...prev.filter(r => r !== id)]
      return next.slice(0, 8)
    })
  }, [])

  const toggleStar = useCallback((id) => {
    setStarredIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const showToast = useCallback((msg, icon = 'ℹ️') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg, icon }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return {
    // raw data
    data,
    nodeMap,
    parentMap,
    // state
    expanded,
    selectedId,
    focusedId,
    searchQuery,
    starredIds,
    recentIds,
    toasts,
    searchMatches,
    visibleNodes,
    // actions
    toggleExpand,
    expandAll,
    collapseAll,
    selectNode,
    setFocusedId,
    setSearchQuery,
    toggleStar,
    showToast,
    dismissToast,
  }
}
