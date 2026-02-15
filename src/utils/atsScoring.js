/* ================================================================
   ATS Score v1 — Deterministic scoring engine (0–100)
   ================================================================
   Scoring rules:
   +15   summary 40–120 words
   +10   ≥ 2 projects
   +10   ≥ 1 experience entry
   +10   ≥ 8 skills
   +10   GitHub or LinkedIn link exists
   +15   any experience/project bullet contains a number (%, X, k, etc.)
   +10   education section has complete fields
   Cap at 100.
   ================================================================ */

function wordCount(text) {
    if (!text) return 0
    return text.trim().split(/\s+/).filter(Boolean).length
}

const NUMBER_PATTERN = /\d+[\s]?[%xXkK+]|\d{2,}|#\d/

function hasMetrics(text) {
    if (!text) return false
    return NUMBER_PATTERN.test(text)
}

export function computeATSScore(data) {
    let score = 0
    const breakdown = []

    // 1. Summary length: 40–120 words → +15
    const summaryWords = wordCount(data.summary)
    if (summaryWords >= 40 && summaryWords <= 120) {
        score += 15
        breakdown.push({ label: 'Summary length (40–120 words)', earned: 15, max: 15 })
    } else {
        breakdown.push({ label: 'Summary length (40–120 words)', earned: 0, max: 15 })
    }

    // 2. ≥ 2 projects → +10
    if (data.projects.length >= 2) {
        score += 10
        breakdown.push({ label: 'At least 2 projects', earned: 10, max: 10 })
    } else {
        breakdown.push({ label: 'At least 2 projects', earned: 0, max: 10 })
    }

    // 3. ≥ 1 experience → +10
    if (data.experience.length >= 1) {
        score += 10
        breakdown.push({ label: 'At least 1 experience entry', earned: 10, max: 10 })
    } else {
        breakdown.push({ label: 'At least 1 experience entry', earned: 0, max: 10 })
    }

    // 4. ≥ 8 skills → +10
    const skillList = data.skills
        ? data.skills.split(',').map(s => s.trim()).filter(Boolean)
        : []
    if (skillList.length >= 8) {
        score += 10
        breakdown.push({ label: 'Skills list has 8+ items', earned: 10, max: 10 })
    } else {
        breakdown.push({ label: 'Skills list has 8+ items', earned: 0, max: 10 })
    }

    // 5. GitHub or LinkedIn link → +10
    if (data.links.github || data.links.linkedin) {
        score += 10
        breakdown.push({ label: 'GitHub or LinkedIn link', earned: 10, max: 10 })
    } else {
        breakdown.push({ label: 'GitHub or LinkedIn link', earned: 0, max: 10 })
    }

    // 6. Measurable impact (numbers in experience/project bullets) → +15
    const allBullets = [
        ...data.experience.map(e => e.description),
        ...data.projects.map(p => p.description),
    ]
    const hasNumbers = allBullets.some(hasMetrics)
    if (hasNumbers) {
        score += 15
        breakdown.push({ label: 'Measurable impact (numbers in bullets)', earned: 15, max: 15 })
    } else {
        breakdown.push({ label: 'Measurable impact (numbers in bullets)', earned: 0, max: 15 })
    }

    // 7. Education completeness → +10
    const hasCompleteEdu = data.education.some(
        e => e.institution && e.degree && e.startDate && e.endDate
    )
    if (hasCompleteEdu) {
        score += 10
        breakdown.push({ label: 'Complete education entry', earned: 10, max: 10 })
    } else {
        breakdown.push({ label: 'Complete education entry', earned: 0, max: 10 })
    }

    // Max total possible: 15+10+10+10+10+15+10 = 80... but spec says cap at 100
    // The rules as stated sum to 80 max, so score will naturally be ≤ 80
    // We still cap at 100 per spec in case rules are adjusted later
    return {
        score: Math.min(score, 100),
        breakdown,
        maxPossible: 80,
    }
}

/* ================================================================
   Top 3 Improvements — max 3 actionable items
   ================================================================ */
export function generateImprovements(data) {
    const items = []

    // If <2 projects → suggest adding project
    if (data.projects.length < 2) {
        items.push('Add at least 2 projects to strengthen your profile.')
    }

    // If no numbers in bullets → suggest measurable impact
    const allBullets = [
        ...data.experience.map(e => e.description),
        ...data.projects.map(p => p.description),
    ]
    if (!allBullets.some(hasMetrics)) {
        items.push('Add measurable impact (numbers like %, 50K+, 3x) in your bullets.')
    }

    // If summary <40 words → suggest expanding
    const summaryWords = wordCount(data.summary)
    if (summaryWords < 40) {
        items.push('Expand your summary to 40–120 words for better ATS performance.')
    }

    // If skills <8 → suggest expanding
    const skillList = data.skills
        ? data.skills.split(',').map(s => s.trim()).filter(Boolean)
        : []
    if (skillList.length < 8) {
        items.push('Add more skills — target at least 8 for stronger keyword matching.')
    }

    // If no experience → suggest adding internship/project work
    if (data.experience.length < 1) {
        items.push('Add an internship or work experience entry.')
    }

    // Return max 3
    return items.slice(0, 3)
}

// Keep backward compat alias
export const generateSuggestions = generateImprovements
