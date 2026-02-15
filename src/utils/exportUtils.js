/* ================================================================
   Resume Export Utilities
   - Plain-text resume generator
   - Clipboard copy
   - Validation warnings
   ================================================================ */

/**
 * Generate a clean plain-text version of the resume.
 */
export function generatePlainText(data) {
    const lines = []

    // Name
    if (data.personal.name) {
        lines.push(data.personal.name)
    }

    // Contact
    const contact = [data.personal.email, data.personal.phone, data.personal.location]
        .filter(Boolean)
        .join(' | ')
    if (contact) {
        lines.push(contact)
    }

    if (lines.length > 0) lines.push('')

    // Summary
    if (data.summary) {
        lines.push('SUMMARY')
        lines.push('-'.repeat(40))
        lines.push(data.summary)
        lines.push('')
    }

    // Education
    if (data.education.length > 0) {
        lines.push('EDUCATION')
        lines.push('-'.repeat(40))
        data.education.forEach(entry => {
            const dateRange = [entry.startDate, entry.endDate].filter(Boolean).join(' — ')
            lines.push(`${entry.institution || 'Institution'}${dateRange ? '  |  ' + dateRange : ''}`)
            if (entry.degree) lines.push(entry.degree)
            if (entry.description) lines.push(entry.description)
            lines.push('')
        })
    }

    // Experience
    if (data.experience.length > 0) {
        lines.push('EXPERIENCE')
        lines.push('-'.repeat(40))
        data.experience.forEach(entry => {
            const title = [entry.role, entry.company].filter(Boolean).join(' — ')
            const dateRange = [entry.startDate, entry.endDate].filter(Boolean).join(' — ')
            lines.push(`${title || 'Role'}${dateRange ? '  |  ' + dateRange : ''}`)
            if (entry.description) lines.push(entry.description)
            lines.push('')
        })
    }

    // Projects
    if (data.projects.length > 0) {
        lines.push('PROJECTS')
        lines.push('-'.repeat(40))
        data.projects.forEach(entry => {
            lines.push(`${entry.name || 'Project'}${entry.tech ? '  |  ' + entry.tech : ''}`)
            if (entry.description) lines.push(entry.description)
            lines.push('')
        })
    }

    // Skills
    const skillList = data.skills
        ? data.skills.split(',').map(s => s.trim()).filter(Boolean)
        : []
    if (skillList.length > 0) {
        lines.push('SKILLS')
        lines.push('-'.repeat(40))
        lines.push(skillList.join(', '))
        lines.push('')
    }

    // Links
    if (data.links.github || data.links.linkedin) {
        lines.push('LINKS')
        lines.push('-'.repeat(40))
        if (data.links.github) lines.push(`GitHub: ${data.links.github}`)
        if (data.links.linkedin) lines.push(`LinkedIn: ${data.links.linkedin}`)
        lines.push('')
    }

    return lines.join('\n').trim()
}

/**
 * Copy text to clipboard. Returns a promise.
 */
export async function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
        return true
    }
    // Fallback for older browsers
    const el = document.createElement('textarea')
    el.value = text
    el.style.position = 'fixed'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    return true
}

/**
 * Check resume completeness for export validation.
 * Returns warning messages (empty array if all good).
 */
export function getExportWarnings(data) {
    const warnings = []

    if (!data.personal.name) {
        warnings.push('Name is missing.')
    }

    if (data.projects.length === 0 && data.experience.length === 0) {
        warnings.push('No projects or experience entries added.')
    }

    return warnings
}
