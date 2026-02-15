/* ================================================================
   ResumePreview — Live Preview Component
   Renders the structured resume from form data.
   Used in both Builder (side panel) and Preview page (full page).
   ================================================================ */

function ResumePreview({ data }) {
    const { personal, summary, education, experience, projects, skills, links } = data

    const skillList = skills
        ? skills.split(',').map(s => s.trim()).filter(Boolean)
        : []

    const hasContent =
        personal.name || personal.email || summary ||
        education.length > 0 || experience.length > 0 ||
        projects.length > 0 || skillList.length > 0

    return (
        <div className="resume-shell" id="resume-preview">
            {/* ---- Header ---- */}
            <div className="resume-header">
                <h2 className="resume-name">
                    {personal.name || <span className="resume-empty-text">Your Name</span>}
                </h2>
                <div className="resume-contact">
                    {personal.email && <span>{personal.email}</span>}
                    {personal.email && personal.phone && <span className="resume-contact-divider"></span>}
                    {personal.phone && <span>{personal.phone}</span>}
                    {(personal.email || personal.phone) && personal.location && <span className="resume-contact-divider"></span>}
                    {personal.location && <span>{personal.location}</span>}
                    {!personal.email && !personal.phone && !personal.location && (
                        <span className="resume-empty-text">email · phone · location</span>
                    )}
                </div>
            </div>

            {/* ---- Summary ---- */}
            {(summary || !hasContent) && (
                <div className="resume-section">
                    <h3 className="resume-section-title">Professional Summary</h3>
                    {summary
                        ? <p className="resume-summary">{summary}</p>
                        : <p className="resume-empty-text">A brief professional summary will appear here...</p>
                    }
                </div>
            )}

            {/* ---- Education ---- */}
            {(education.length > 0 || !hasContent) && (
                <div className="resume-section">
                    <h3 className="resume-section-title">Education</h3>
                    {education.length > 0 ? education.map(entry => (
                        <div className="resume-entry" key={entry.id}>
                            <div className="resume-entry-header">
                                <span className="resume-entry-title">{entry.institution || 'Institution'}</span>
                                <span className="resume-entry-date">
                                    {entry.startDate}{entry.startDate && entry.endDate ? ' — ' : ''}{entry.endDate}
                                </span>
                            </div>
                            {entry.degree && <div className="resume-entry-subtitle">{entry.degree}</div>}
                            {entry.description && <div className="resume-entry-desc">{entry.description}</div>}
                        </div>
                    )) : (
                        <p className="resume-empty-text">Education entries will appear here...</p>
                    )}
                </div>
            )}

            {/* ---- Experience ---- */}
            {(experience.length > 0 || !hasContent) && (
                <div className="resume-section">
                    <h3 className="resume-section-title">Experience</h3>
                    {experience.length > 0 ? experience.map(entry => (
                        <div className="resume-entry" key={entry.id}>
                            <div className="resume-entry-header">
                                <span className="resume-entry-title">{entry.role || 'Role'}{entry.company ? ` — ${entry.company}` : ''}</span>
                                <span className="resume-entry-date">
                                    {entry.startDate}{entry.startDate && entry.endDate ? ' — ' : ''}{entry.endDate}
                                </span>
                            </div>
                            {entry.description && <div className="resume-entry-desc">{entry.description}</div>}
                        </div>
                    )) : (
                        <p className="resume-empty-text">Work experience entries will appear here...</p>
                    )}
                </div>
            )}

            {/* ---- Projects ---- */}
            {(projects.length > 0 || !hasContent) && (
                <div className="resume-section">
                    <h3 className="resume-section-title">Projects</h3>
                    {projects.length > 0 ? projects.map(entry => (
                        <div className="resume-entry" key={entry.id}>
                            <div className="resume-entry-header">
                                <span className="resume-entry-title">{entry.name || 'Project Name'}</span>
                                {entry.tech && <span className="resume-entry-date">{entry.tech}</span>}
                            </div>
                            {entry.description && <div className="resume-entry-desc">{entry.description}</div>}
                        </div>
                    )) : (
                        <p className="resume-empty-text">Project entries will appear here...</p>
                    )}
                </div>
            )}

            {/* ---- Skills ---- */}
            {(skillList.length > 0 || !hasContent) && (
                <div className="resume-section">
                    <h3 className="resume-section-title">Skills</h3>
                    {skillList.length > 0 ? (
                        <div className="resume-skills">
                            {skillList.map((skill, i) => (
                                <span className="resume-skill-tag" key={i}>{skill}</span>
                            ))}
                        </div>
                    ) : (
                        <p className="resume-empty-text">Skills will appear here as tags...</p>
                    )}
                </div>
            )}

            {/* ---- Links ---- */}
            {(links.github || links.linkedin || !hasContent) && (
                <div className="resume-section">
                    <h3 className="resume-section-title">Links</h3>
                    {(links.github || links.linkedin) ? (
                        <div className="resume-links">
                            {links.github && <a href={links.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
                            {links.linkedin && <a href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                        </div>
                    ) : (
                        <p className="resume-empty-text">GitHub and LinkedIn links will appear here...</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default ResumePreview
