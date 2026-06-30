/**
 * Generates daily puzzles with par 3–6 using common English words.
 * Run: node scripts/generateYearPuzzles.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const MIN_PAR = 3
const MAX_PAR = 6
const TARGET_TOTAL = 365

function loadWordSet(paths) {
  const set = new Set()
  for (const rel of paths) {
    const text = readFileSync(join(root, rel), 'utf8')
    for (const line of text.split('\n')) {
      const word = line.trim().toLowerCase()
      if (/^[a-z]{4,7}$/.test(word)) set.add(word)
    }
  }
  return set
}

function loadCommonWords(dict) {
  const cached = join(root, 'public/common-words.txt')
  const text = readFileSync(cached, 'utf8')

  const common = new Set()
  for (const line of text.split('\n')) {
    const word = line.trim().toLowerCase()
    if (/^[a-z]{4,7}$/.test(word) && dict.has(word)) common.add(word)
  }
  return common
}

function neighbors(word, dict) {
  const out = []
  for (let i = 0; i < word.length; i++) {
    const deleted = word.slice(0, i) + word.slice(i + 1)
    if (dict.has(deleted)) out.push(deleted)
  }
  for (let i = 0; i <= word.length; i++) {
    for (let code = 97; code <= 122; code++) {
      const letter = String.fromCharCode(code)
      const inserted = word.slice(0, i) + letter + word.slice(i)
      if (dict.has(inserted)) out.push(inserted)
    }
  }
  return out
}

function findPath(start, target, dict, minPar, maxPar) {
  const queue = [[start]]
  const visited = new Set([start])

  while (queue.length > 0) {
    const path = queue.shift()
    const word = path[path.length - 1]
    const par = path.length - 1

    if (word === target && par >= minPar) return path

    if (par >= maxPar) continue

    for (const next of neighbors(word, dict)) {
      if (visited.has(next)) continue
      visited.add(next)
      queue.push([...path, next])
    }
  }

  return null
}

function findPuzzleFromStart(start, dict, common, usedPairs, usedStarts) {
  const queue = [[start]]
  const visited = new Set([start])
  const candidates = []

  while (queue.length > 0) {
    const path = queue.shift()
    const word = path[path.length - 1]
    const par = path.length - 1

    if (
      par >= MIN_PAR &&
      par <= MAX_PAR &&
      word !== start &&
      common.has(word)
    ) {
      const pairKey = `${start}|${word}`
      if (!usedPairs.has(pairKey)) {
        candidates.push({ path: [...path], par })
      }
    }

    if (par >= MAX_PAR) continue

    for (const next of neighbors(word, dict)) {
      if (visited.has(next)) continue
      visited.add(next)
      queue.push([...path, next])
    }
  }

  if (candidates.length === 0) return null

  candidates.sort((a, b) => {
    const parDiff = Math.abs(a.par - 4.5) - Math.abs(b.par - 4.5)
    if (parDiff !== 0) return parDiff
    return a.path[a.path.length - 1].localeCompare(b.path[b.path.length - 1])
  })

  for (const candidate of candidates) {
    const target = candidate.path[candidate.path.length - 1]
    const pairKey = `${start}|${target}`
    if (usedPairs.has(pairKey)) continue
    if (usedStarts.has(start) && candidates.length > 1) continue
    return candidate
  }

  return candidates[0] ?? null
}

function titleCase(word) {
  return word.charAt(0) + word.slice(1).toLowerCase()
}

function puzzleTitle(start, target) {
  return `${titleCase(start)} ${titleCase(target)}`
}

function validatePath(path, dict) {
  if (path.length - 1 < MIN_PAR) return false
  for (const word of path) {
    if (!dict.has(word.toLowerCase())) return false
  }
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i]
    const b = path[i + 1]
    if (!neighbors(a, dict).includes(b)) return false
  }
  return true
}

function parseCuratedPuzzles() {
  const src = readFileSync(join(root, 'src/data/curatedPuzzles.ts'), 'utf8')
  const pairs = [...src.matchAll(/startWord: '([^']+)',\s*\n\s*targetWord: '([^']+)'/g)]
  return pairs.map(([, start, target]) => ({
    start: start.toLowerCase(),
    target: target.toLowerCase(),
  }))
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

function formatPuzzle(puzzle, index) {
  const path = puzzle.path.map((w) => w.toUpperCase())
  const lines = [
    '  {',
    `    title: '${puzzle.title.replace(/'/g, "\\'")}',`,
    `    startWord: '${path[0]}',`,
    `    targetWord: '${path[path.length - 1]}',`,
    `    solutionPath: [`,
    ...path.map((w) => `      '${w}',`),
    '    ],',
    '  },',
  ]
  return lines.join('\n')
}

function main() {
  const dict = loadWordSet(['public/words.txt', 'public/word-supplements.txt'])
  const common = loadCommonWords(dict)
  const curated = parseCuratedPuzzles()

  const usedPairs = new Set(curated.map((p) => `${p.start}|${p.target}`))
  const usedStarts = new Set(curated.map((p) => p.start))
  const generated = []

  const startWords = shuffle([...common])

  for (const start of startWords) {
    if (curated.length + generated.length >= TARGET_TOTAL) break
    if (usedStarts.has(start)) continue

    const result = findPuzzleFromStart(start, dict, common, usedPairs, usedStarts)
    if (!result) continue

    const target = result.path[result.path.length - 1]
    const pairKey = `${start}|${target}`
    if (usedPairs.has(pairKey)) continue
    if (!validatePath(result.path, dict)) continue

    usedPairs.add(pairKey)
    usedStarts.add(start)

    generated.push({
      title: puzzleTitle(start, target),
      path: result.path,
      par: result.par,
    })
  }

  if (curated.length + generated.length < TARGET_TOTAL) {
    // Second pass: allow re-used starts, new targets only
    for (const start of shuffle([...common])) {
      if (curated.length + generated.length >= TARGET_TOTAL) break
      const result = findPuzzleFromStart(start, dict, common, usedPairs, new Set())
      if (!result) continue
      const target = result.path[result.path.length - 1]
      const pairKey = `${start}|${target}`
      if (usedPairs.has(pairKey)) continue
      if (!validatePath(result.path, dict)) continue
      usedPairs.add(pairKey)
      generated.push({
        title: puzzleTitle(start, target),
        path: result.path,
        par: result.par,
      })
    }
  }

  const total = curated.length + generated.length
  if (total < TARGET_TOTAL) {
    console.error(`Only generated ${total} puzzles (need ${TARGET_TOTAL}).`)
    process.exit(1)
  }

  const header = `/** Auto-generated puzzles — do not edit by hand; run scripts/generateYearPuzzles.mjs */
export const GENERATED_PUZZLES = [
`

  const body = generated.map((p, i) => formatPuzzle(p, i)).join('\n')
  const footer = `]
`

  writeFileSync(join(root, 'src/data/generatedPuzzles.ts'), header + body + footer)

  const pars = generated.map((p) => p.par)
  console.log(`Generated ${generated.length} puzzles (${total} total with curated).`)
  console.log(`Par range: ${Math.min(...pars)}–${Math.max(...pars)}`)
}

main()
