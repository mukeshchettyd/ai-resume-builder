/* ================================================================
   ATS Score v2 — Deterministic scoring engine (0–100)
   ================================================================
   Scoring rules:
   +10   Name provided
   +10   Email provided
   +10   Summary > 50 characters
   +15   At least 1 experience entry with bullets
   +10   At least 1 education entry
   +10   At least 5 skills added
   +10   At least 1 project added
   +5    Phone provided
   +5    LinkedIn provided
   +5    GitHub provided
   +10   Summary contains action verbs (built, led, designed, etc.)
   ================================================================ */

const ACTION_VERBS = [
    'built', 'led', 'designed', 'improved', 'developed',
    'managed', 'implemented', 'created', 'optimized', 'spearheaded',
    'increased', 'reduced', 'collaborated', 'delivered'
]

function hasBullets(text) {
    if (!text) return false
    // Matches common bullet patterns: -, •, *, or multi-line content
    return text.includes('\n') || /^[•\-*]/.test(text.trim()) || /[•\-*]/.test(text)
}

function getSkillsCount(skills) {
    if (!skills) return 0
    if (typeof skills === 'string') {
        return skills.split(',').map(s => s.trim()).filter(Boolean).length
    }
    return (
        (skills.technical?.length || 0) +
        (skills.soft?.length || 0) +
        (skills.tools?.length || 0)
    )
}

export function computeATSScore(data) {
    let score = 0
    const breakdown = []

    // 1. Name (+10)
    if (data.personal.name?.trim()) {
        score += 10
        breakdown.push({ label: 'Full name provided', earned: 10, max: 10 })
    } else {
        breakdown.push({ label: 'Full name provided', earned: 0, max: 10 })
    }

    // 2. Email (+10)
    if (data.personal.email?.trim()) {
        score += 10
        breakdown.push({ label: 'Email address provided', earned: 10, max: 10 })
    } else {
        breakdown.push({ label: 'Email address provided', earned: 0, max: 10 })
    }

    // 3. Summary length (+10)
    if (data.summary?.length > 50) {
        score += 10
        breakdown.push({ label: 'Summary length (> 50 chars)', earned: 10, max: 10 })
    } else {
        breakdown.push({ label: 'Summary length (> 50 chars)', earned: 0, max: 10 })
    }

    // 4. Experience w/ bullets (+15)
    const hasExpWithBullets = data.experience.some(exp => hasBullets(exp.description))
    if (hasExpWithBullets) {
        score += 15
        breakdown.push({ label: 'Experience with bullet points', earned: 15, max: 15 })
    } else {
        breakdown.push({ label: 'Experience with bullet points', earned: 0, max: 15 })
    }

    // 5. Education (+10)
    if (data.education.length > 0) {
        score += 10
        breakdown.push({ label: 'Education entry added', earned: 10, max: 10 })
    } else {
        breakdown.push({ label: 'Education entry added', earned: 0, max: 10 })
    }

    // 6. Skills (+10)
    if (getSkillsCount(data.skills) >= 5) {
        score += 10
        breakdown.push({ label: 'At least 5 skills added', earned: 10, max: 10 })
    } else {
        breakdown.push({ label: 'At least 5 skills added', earned: 0, max: 10 })
    }

    // 7. Projects (+10)
    if (data.projects.length > 0) {
        score += 10
        breakdown.push({ label: 'Project entry added', earned: 10, max: 10 })
    } else {
        breakdown.push({ label: 'Project entry added', earned: 0, max: 10 })
    }

    // 8. Phone (+5)
    if (data.personal.phone?.trim()) {
        score += 5
        breakdown.push({ label: 'Phone number provided', earned: 5, max: 5 })
    } else {
        breakdown.push({ label: 'Phone number provided', earned: 0, max: 5 })
    }

    // 9. LinkedIn (+5)
    if (data.links.linkedin?.trim()) {
        score += 5
        breakdown.push({ label: 'LinkedIn link provided', earned: 5, max: 5 })
    } else {
        breakdown.push({ label: 'LinkedIn link provided', earned: 0, max: 5 })
    }

    // 10. GitHub (+5)
    if (data.links.github?.trim()) {
        score += 5
        breakdown.push({ label: 'GitHub link provided', earned: 5, max: 5 })
    } else {
        breakdown.push({ label: 'GitHub link provided', earned: 0, max: 5 })
    }

    // 11. Action Verbs (+10)
    const summaryLower = (data.summary || '').toLowerCase()
    const hasActionVerb = ACTION_VERBS.some(verb => summaryLower.includes(verb))
    if (hasActionVerb) {
        score += 10
        breakdown.push({ label: 'Summary uses action verbs', earned: 10, max: 10 })
    } else {
        breakdown.push({ label: 'Summary uses action verbs', earned: 0, max: 10 })
    }

    return {
        score: Math.min(score, 100),
        breakdown,
        maxPossible: 100,
    }
}

export function generateImprovements(data) {
    const items = []

    if (!data.personal.name) items.push('Add your full name (+10 pts)')
    if (!data.personal.email) items.push('Add your email address (+10 pts)')
    if (!data.summary || data.summary.length <= 50) items.push('Write a summary of at least 50 characters (+10 pts)')

    const summaryLower = (data.summary || '').toLowerCase()
    if (!ACTION_VERBS.some(verb => summaryLower.includes(verb))) {
        items.push('Use at least one action verb in your summary (e.g., built, led) (+10 pts)')
    }

    if (!data.experience.some(exp => hasBullets(exp.description))) {
        items.push('Use bullet points in your experience descriptions (+15 pts)')
    }

    if (data.education.length === 0) items.push('Add your education details (+10 pts)')
    if (getSkillsCount(data.skills) < 5) items.push('Add at least 5 skills to your profile (+10 pts)')
    if (data.projects.length === 0) items.push('Include at least one personal project (+10 pts)')

    if (!data.personal.phone) items.push('Add your phone number (+5 pts)')
    if (!data.links.linkedin) items.push('Link your LinkedIn profile (+5 pts)')
    if (!data.links.github) items.push('Link your GitHub profile (+5 pts)')

    return items
}

export const generateSuggestions = generateImprovements
