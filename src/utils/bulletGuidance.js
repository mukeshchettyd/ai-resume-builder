/* ================================================================
   Bullet Discipline — Inline guidance for Experience / Project bullets
   ================================================================
   Non-blocking. Guidance only.
   ================================================================ */

const ACTION_VERBS = [
    'built', 'developed', 'designed', 'implemented', 'led', 'improved',
    'created', 'optimized', 'automated', 'managed', 'launched', 'deployed',
    'integrated', 'architected', 'refactored', 'reduced', 'increased',
    'streamlined', 'engineered', 'delivered', 'maintained', 'migrated',
    'analyzed', 'configured', 'established', 'scaled', 'resolved',
    'coordinated', 'executed', 'mentored', 'pioneered', 'spearheaded',
    'wrote', 'tested', 'debugged', 'shipped', 'contributed',
]

const NUMBER_PATTERN = /\d+[\s]?[%xXkK+]|\d{2,}|#\d/

/**
 * Analyze a description text and return bullet-level guidance.
 * Returns an array of { line, suggestions[] } objects.
 */
export function analyzeBullets(text) {
    if (!text || !text.trim()) return []

    const lines = text.split('\n').filter(l => l.trim())
    return lines.map(line => {
        const suggestions = []
        const trimmed = line.trim()
        const firstWord = trimmed.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '')

        if (firstWord && !ACTION_VERBS.includes(firstWord)) {
            suggestions.push('Start with a strong action verb.')
        }

        if (!NUMBER_PATTERN.test(trimmed)) {
            suggestions.push('Add measurable impact (numbers).')
        }

        return { line: trimmed, suggestions }
    })
}

/**
 * Check if a full description has any bullet issues.
 * Returns true if there are suggestions to show.
 */
export function hasBulletIssues(text) {
    const analysis = analyzeBullets(text)
    return analysis.some(b => b.suggestions.length > 0)
}
