let wordSet: Set<string> | null = null
let loadPromise: Promise<Set<string>> | null = null

function parseWordList(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim().toLowerCase())
    .filter((word) => word && !word.startsWith('#'))
}

async function fetchWordList(path: string): Promise<string[]> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Failed to load dictionary: ${path}`)
  const text = await res.text()
  return parseWordList(text)
}

export async function loadDictionary(): Promise<Set<string>> {
  if (wordSet) return wordSet
  if (loadPromise) return loadPromise

  loadPromise = Promise.all([
    fetchWordList('/words.txt'),
    fetchWordList('/word-supplements.txt').catch(() => []),
  ]).then(([baseWords, supplementWords]) => {
    wordSet = new Set([...baseWords, ...supplementWords])
    return wordSet
  })

  return loadPromise
}

export function isValidWord(word: string, dictionary: Set<string>): boolean {
  return dictionary.has(word.toLowerCase())
}

export function getValidDeletionIndices(
  word: string,
  dictionary: Set<string>,
): number[] {
  const indices: number[] = []
  for (let i = 0; i < word.length; i += 1) {
    const candidate = word.slice(0, i) + word.slice(i + 1)
    if (isValidWord(candidate, dictionary)) indices.push(i)
  }
  return indices
}

/** Returns all valid single-letter insertions for a word */
export function getValidInsertions(
  word: string,
  dictionary: Set<string>,
): { index: number; letter: string }[] {
  const results: { index: number; letter: string }[] = []
  const lower = word.toLowerCase()

  for (let index = 0; index <= word.length; index += 1) {
    for (let code = 97; code <= 122; code += 1) {
      const letter = String.fromCharCode(code)
      const candidate = lower.slice(0, index) + letter + lower.slice(index)
      if (dictionary.has(candidate)) {
        results.push({ index, letter })
      }
    }
  }

  return results
}

export function hasValidMoves(word: string, dictionary: Set<string>): boolean {
  if (getValidDeletionIndices(word, dictionary).length > 0) return true
  return getValidInsertions(word, dictionary).length > 0
}
