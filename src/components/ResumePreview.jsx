/* ================================================================
   ResumePreview — Live Preview Component
   Renders the structured resume from form data.
   Supports 3 templates: classic, modern, minimal.
   Empty sections are hidden — only populated sections render.
   ================================================================ */

function ResumePreview({ data, template = 'classic', accentColor = 'hsl(168, 60%, 40%)' }) {
    const { personal, summary, education, experience, projects, skills, links } = data

    const hasAnyContact = personal.email || personal.phone || personal.location
    const shellClass = `resume-shell resume-tpl--${template}`

    // Helper for rendering skills
    const renderSkills = () => {
        if (!skills) return null
        if (typeof skills === 'string') {
            return (
                <div className="resume-skills">
                    {skills.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => <span className="resume-skill-tag" key={i}>{s}</span>)}
                </div>
            )
        }
        return (
            <div className="resume-skills-grouped">
                {skills.technical?.length > 0 && (
                    <div className="resume-skill-group">
                        <span className="resume-skill-group-label">Technical</span>
                        <div className="resume-skills">
                            {skills.technical.map((s, i) => <span className="resume-skill-tag" key={i}>{s}</span>)}
                        </div>
                    </div>
                )}
                {skills.soft?.length > 0 && (
                    <div className="resume-skill-group">
                        <span className="resume-skill-group-label">Soft Skills</span>
                        <div className="resume-skills">
                            {skills.soft.map((s, i) => <span className="resume-skill-tag" key={i}>{s}</span>)}
                        </div>
                    </div>
                )}
                {skills.tools?.length > 0 && (
                    <div className="resume-skill-group">
                        <span className="resume-skill-group-label">Tools</span>
                        <div className="resume-skills">
                            {skills.tools.map((s, i) => <span className="resume-skill-tag" key={i}>{s}</span>)}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const personalHeader = (
        <div className="resume-header">
            <h2 className="resume-name">{personal.name || <span className="resume-empty-text">Your Name</span>}</h2>
            <div className="resume-contact">
                {personal.email && <span>{personal.email}</span>}
                {personal.email && personal.phone && <span className="resume-contact-divider"></span>}
                {personal.phone && <span>{personal.phone}</span>}
                {(personal.email || personal.phone) && personal.location && <span className="resume-contact-divider"></span>}
                {personal.location && <span>{personal.location}</span>}
                {!hasAnyContact && <span className="resume-empty-text">email · phone · location</span>}
            </div>
        </div>
    )

    const mainContent = (
        <>
            {summary && (
                <div className="resume-section">
                    <h3 className="resume-section-title">Summary</h3>
                    <p className="resume-summary" style={{ fontStyle: template === 'classic' ? 'italic' : 'normal' }}>{summary}</p>
                </div>
            )}
            {experience.length > 0 && (
                <div className="resume-section">
                    <h3 className="resume-section-title">Experience</h3>
                    {experience.map(entry => (
                        <div className="resume-entry" key={entry.id}>
                            <div className="resume-entry-header">
                                <span className="resume-entry-title">{entry.role || 'Role'}{entry.company ? ` — ${entry.company}` : ''}</span>
                                <span className="resume-entry-date">{entry.startDate}{entry.startDate && entry.endDate ? ' — ' : ''}{entry.endDate}</span>
                            </div>
                            {entry.description && <p className="resume-entry-desc">{entry.description}</p>}
                        </div>
                    ))}
                </div>
            )}
            {projects.length > 0 && (
                <div className="resume-section">
                    <h3 className="resume-section-title">Projects</h3>
                    {projects.map(entry => (
                        <div className="resume-entry" key={entry.id}>
                            <div className="resume-entry-header">
                                <span className="resume-entry-title">{entry.title || 'Project Name'}</span>
                                <div className="resume-entry-links">
                                    {entry.githubUrl && <a href={entry.githubUrl} className="resume-link-icon" title="GitHub"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg></a>}
                                    {entry.liveUrl && <a href={entry.liveUrl} className="resume-link-icon" title="Live"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>}
                                </div>
                            </div>
                            {entry.description && <p className="resume-entry-desc">{entry.description}</p>}
                            {entry.techStack?.length > 0 && (
                                <div className="resume-tech-stack">
                                    {entry.techStack.map((tech, i) => <span key={i} className="resume-skill-tag resume-skill-tag--small">{tech}</span>)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {education.length > 0 && (
                <div className="resume-section">
                    <h3 className="resume-section-title">Education</h3>
                    {education.map(entry => (
                        <div className="resume-entry" key={entry.id}>
                            <div className="resume-entry-header">
                                <span className="resume-entry-title">{entry.institution || 'Institution'}</span>
                                <span className="resume-entry-date">{entry.startDate}{entry.startDate && entry.endDate ? ' — ' : ''}{entry.endDate}</span>
                            </div>
                            {entry.degree && <div className="resume-entry-subtitle">{entry.degree}</div>}
                            {entry.description && <div className="resume-entry-desc">{entry.description}</div>}
                        </div>
                    ))}
                </div>
            )}
        </>
    )

    if (template === 'modern') {
        return (
            <div className={shellClass} style={{ '--accent-color': accentColor }}>
                <aside className="resume-modern-sidebar">
                    <h2 className="resume-name">{personal.name || 'Your Name'}</h2>
                    <div className="resume-contact">
                        {personal.email && <span>{personal.email}</span>}
                        {personal.phone && <span>{personal.phone}</span>}
                        {personal.location && <span>{personal.location}</span>}
                    </div>
                    <div className="resume-section">
                        <h3 className="resume-section-title">Skills</h3>
                        {renderSkills()}
                    </div>
                    {(links.github || links.linkedin) && (
                        <div className="resume-section">
                            <h3 className="resume-section-title">Links</h3>
                            <div className="resume-links" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                                {links.github && <a href={links.github} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>GitHub</a>}
                                {links.linkedin && <a href={links.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>LinkedIn</a>}
                            </div>
                        </div>
                    )}
                </aside>
                <main className="resume-modern-main">
                    {mainContent}
                </main>
            </div>
        )
    }

    return (
        <div className={shellClass} id="resume-preview" style={{ '--accent-color': accentColor }}>
            {personalHeader}
            {mainContent}
            <div className="resume-section">
                <h3 className="resume-section-title">Skills</h3>
                {renderSkills()}
            </div>
            {(links.github || links.linkedin) && (
                <div className="resume-section">
                    <h3 className="resume-section-title">Links</h3>
                    <div className="resume-links">
                        {links.github && <a href={links.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
                        {links.linkedin && <a href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ResumePreview
