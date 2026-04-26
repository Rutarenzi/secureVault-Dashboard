// === File icon & type utilities ===

export function getExtension(name) {
  const m = name.match(/\.([^.]+)$/)
  return m ? m[1].toLowerCase() : ''
}

export function getFileIcon(name, type) {
  if (type === 'folder') return '📁'
  const ext = getExtension(name)
  const map = {
    pdf:       '📄',
    png:       '🖼️',
    jpg:       '🖼️',
    jpeg:      '🖼️',
    svg:       '🎨',
    docx:      '📝',
    doc:       '📝',
    xlsx:      '📊',
    xls:       '📊',
    txt:       '📋',
    log:       '📋',
    yaml:      '⚙️',
    yml:       '⚙️',
    json:      '🗂️',
    ttf:       '🔤',
    otf:       '🔤',
    gitignore: '🔧',
    md:        '📖',
    js:        '📜',
    jsx:       '📜',
    ts:        '📜',
    tsx:       '📜',
    css:       '🎨',
    html:      '🌐',
  }
  return map[ext] || '📄'
}

export function getFileType(name) {
  const ext = getExtension(name)
  const map = {
    pdf:       'PDF Document',
    png:       'PNG Image',
    jpg:       'JPEG Image',
    jpeg:      'JPEG Image',
    svg:       'SVG Vector',
    docx:      'Word Document',
    doc:       'Word Document',
    xlsx:      'Excel Spreadsheet',
    xls:       'Excel Spreadsheet',
    txt:       'Plain Text',
    log:       'Log File',
    yaml:      'YAML Config',
    yml:       'YAML Config',
    json:      'JSON Data',
    ttf:       'TrueType Font',
    otf:       'OpenType Font',
    gitignore: 'Git Config',
    md:        'Markdown',
    js:        'JavaScript',
    jsx:       'React Component',
    ts:        'TypeScript',
    tsx:       'React TypeScript',
    css:       'Stylesheet',
    html:      'HTML Document',
  }
  return map[ext] || (ext ? ext.toUpperCase() + ' File' : 'Unknown File')
}

// Build flat id→node map and id→parentId map from tree data
export function buildMaps(nodes, nodeMap = {}, parentMap = {}, parentId = null) {
  for (const n of nodes) {
    nodeMap[n.id] = n
    parentMap[n.id] = parentId
    if (n.children) buildMaps(n.children, nodeMap, parentMap, n.id)
  }
  return { nodeMap, parentMap }
}

// Get ancestry path from root to node
export function getPath(id, nodeMap, parentMap) {
  const parts = []
  let cur = id
  while (cur) {
    parts.unshift(nodeMap[cur])
    cur = parentMap[cur]
  }
  return parts
}

// Recursive search — returns set of matching ids + ancestors
export function computeSearchMatches(nodes, query, expanded) {
  const q = query.toLowerCase()
  const matches = new Set()

  function walk(nodes) {
    let anyChildHit = false
    for (const n of nodes) {
      const selfHit = n.name.toLowerCase().includes(q)
      let childHit = false
      if (n.children?.length) childHit = walk(n.children)
      if (selfHit || childHit) {
        matches.add(n.id)
        if (childHit) expanded.add(n.id)
        anyChildHit = true
      }
    }
    return anyChildHit
  }

  walk(nodes)
  return matches
}

// Flatten visible tree nodes for keyboard navigation
export function flattenVisible(nodes, expanded, searchMatches, searchQuery) {
  const result = []
  function walk(nodes, depth) {
    for (const n of nodes) {
      if (searchQuery && !searchMatches.has(n.id)) continue
      result.push({ ...n, depth })
      if (n.type === 'folder' && expanded.has(n.id) && n.children?.length) {
        walk(n.children, depth + 1)
      }
    }
  }
  walk(nodes, 0)
  return result
}

// Highlight search match in a string
export function highlightText(text, query) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    text.slice(0, idx) +
    `%%HL_START%%${text.slice(idx, idx + query.length)}%%HL_END%%` +
    text.slice(idx + query.length)
  )
}
