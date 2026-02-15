import { useState, useCallback, useMemo } from 'react'
import ResumePreview from '../components/ResumePreview'
import TemplatePicker from '../components/TemplatePicker'
import ColorPicker from '../components/ColorPicker'
import BulletGuidance from '../components/BulletGuidance'
import TagInput from '../components/TagInput'
import SAMPLE_DATA from '../data/sampleData'
import { computeATSScore, generateImprovements } from '../utils/atsScoring'

/* ================================================================
   EMPTY STATE
   ================================================================ */
const EMPTY_STATE = {
    personal: { name: '', email: '', phone: '', location: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: { technical: [], soft: [], tools: [] },
    links: { github: '', linkedin: '' },
}

let entryId = 100

function generateId(prefix) {
    return `${prefix}-${++entryId}`
}

/* ================================================================
   STORAGE
   ================================================================ */
const STORAGE_KEY = 'resumeBuilderData'
const TEMPLATE_KEY = 'resumeBuilderTemplate'
const COLOR_KEY = 'resumeBuilderColor'

function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
            const parsed = JSON.parse(raw)
            if (typeof parsed.skills === 'string') {
                parsed.skills = {
                    technical: parsed.skills.split(',').map(s => s.trim()).filter(Boolean),
                    soft: [],
                    tools: []
                }
            }
            if (!parsed.skills) parsed.skills = EMPTY_STATE.skills
            return parsed
        }
    } catch { /* ignore */ }
    return EMPTY_STATE
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function loadTemplate() {
    return localStorage.getItem(TEMPLATE_KEY) || 'classic'
}

function saveTemplate(tpl) {
    localStorage.setItem(TEMPLATE_KEY, tpl)
}

function loadColor() {
    return localStorage.getItem(COLOR_KEY) || 'hsl(168, 60%, 40%)'
}

function saveColor(color) {
    localStorage.setItem(COLOR_KEY, color)
}

function getScoreLabel(score) {
    if (score >= 70) return { text: 'Strong', className: 'ats-label--strong' }
    if (score >= 40) return { text: 'Fair', className: 'ats-label--fair' }
    return { text: 'Needs Work', className: 'ats-label--weak' }
}

/* ================================================================
   BUILDER PAGE
   ================================================================ */
function Builder() {
    const [data, setData] = useState(() => loadData())
    const [template, setTemplate] = useState(() => loadTemplate())
    const [accentColor, setAccentColor] = useState(() => loadColor())
    const [isSuggesting, setIsSuggesting] = useState(false)
    const [expandedProjects, setExpandedProjects] = useState({})
    const [toast, setToast] = useState('')

    const update = useCallback((updater) => {
        setData(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater
            saveData(next)
            return next
        })
    }, [])

    const handleTemplateChange = (tpl) => {
        setTemplate(tpl)
        saveTemplate(tpl)
    }

    const handleColorChange = (color) => {
        setAccentColor(color)
        saveColor(color)
    }

    const handleDownload = () => {
        setToast('PDF export ready! Check your downloads.')
        window.print()
        setTimeout(() => setToast(''), 4000)
    }

    // ---- ATS Score ----
    const atsResult = useMemo(() => computeATSScore(data), [data])
    const improvements = useMemo(() => generateImprovements(data), [data])

    const getScoreDisplay = (score) => {
        if (score >= 71) return { text: 'Strong Resume', color: 'green' }
        if (score >= 41) return { text: 'Getting There', color: 'amber' }
        return { text: 'Needs Work', color: 'red' }
    }

    const scoreInfo = getScoreDisplay(atsResult.score)
    const circleCircumference = 2 * Math.PI * 40
    const dashOffset = circleCircumference - (atsResult.score / 100) * circleCircumference

    // ---- Handlers ----
    const setPersonal = (field, value) => update(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }))
    const setSummary = (value) => update(prev => ({ ...prev, summary: value }))
    const addEducation = () => update(prev => ({ ...prev, education: [...prev.education, { id: generateId('edu'), institution: '', degree: '', startDate: '', endDate: '', description: '' }] }))
    const updateEducation = (id, field, value) => update(prev => ({ ...prev, education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e) }))
    const removeEducation = (id) => update(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }))
    const addExperience = () => update(prev => ({ ...prev, experience: [...prev.experience, { id: generateId('exp'), company: '', role: '', startDate: '', endDate: '', description: '' }] }))
    const updateExperience = (id, field, value) => update(prev => ({ ...prev, experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e) }))
    const removeExperience = (id) => update(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }))
    const addProject = () => {
        const id = generateId('proj')
        update(prev => ({ ...prev, projects: [...prev.projects, { id, title: '', description: '', techStack: [], liveUrl: '', githubUrl: '' }] }))
        setExpandedProjects(prev => ({ ...prev, [id]: true }))
    }
    const updateProject = (id, field, value) => update(prev => ({ ...prev, projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p) }))
    const removeProject = (id) => update(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }))
    const toggleProject = (id) => setExpandedProjects(prev => ({ ...prev, [id]: !prev[id] }))
    const setCategorySkills = (cat, skills) => update(prev => ({ ...prev, skills: { ...prev.skills, [cat]: skills } }))
    const setLink = (key, value) => update(prev => ({ ...prev, links: { ...prev.links, [key]: value } }))

    const suggestSkills = () => {
        setIsSuggesting(true)
        setTimeout(() => {
            update(prev => ({
                ...prev,
                skills: {
                    technical: [...new Set([...prev.skills.technical, "TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"])],
                    soft: [...new Set([...prev.skills.soft, "Team Leadership", "Problem Solving"])],
                    tools: [...new Set([...prev.skills.tools, "Git", "Docker", "AWS"])]
                }
            }))
            setIsSuggesting(false)
        }, 1000)
    }

    return (
        <div className="builder-layout" id="builder-page">
            <div className="builder-form-panel" id="builder-form">
                <div className="builder-form-inner">
                    <div className="builder-header">
                        <h1 className="builder-title">Resume Builder</h1>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => update(SAMPLE_DATA)}>Load Sample</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => update(EMPTY_STATE)}>Clear</button>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Personal Information</h3>
                            <span className="form-section-num">1</span>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="input-label">Full Name</label><input className="input-field" value={data.personal.name} onChange={e => setPersonal('name', e.target.value)} /></div>
                            <div className="form-group"><label className="input-label">Email</label><input className="input-field" value={data.personal.email} onChange={e => setPersonal('email', e.target.value)} /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="input-label">Phone</label><input className="input-field" value={data.personal.phone} onChange={e => setPersonal('phone', e.target.value)} /></div>
                            <div className="form-group"><label className="input-label">Location</label><input className="input-field" value={data.personal.location} onChange={e => setPersonal('location', e.target.value)} /></div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Professional Summary</h3>
                            <span className="form-section-num">2</span>
                        </div>
                        <textarea className="input-field" value={data.summary} onChange={e => setSummary(e.target.value)} rows={4} placeholder="Brief summary..." />
                    </div>

                    <div className="form-section">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Education</h3>
                            <span className="form-section-num">3</span>
                        </div>
                        {data.education.map((entry, idx) => (
                            <div className="entry-card" key={entry.id}>
                                <div className="entry-card-header">
                                    <span className="entry-card-num"># {idx + 1}</span>
                                    <button className="entry-remove-btn" onClick={() => removeEducation(entry.id)}>✕ Remove</button>
                                </div>
                                <div className="form-group"><label className="input-label">Institution</label><input className="input-field" value={entry.institution} onChange={e => updateEducation(entry.id, 'institution', e.target.value)} /></div>
                                <div className="form-group"><label className="input-label">Degree</label><input className="input-field" value={entry.degree} onChange={e => updateEducation(entry.id, 'degree', e.target.value)} /></div>
                                <div className="form-row">
                                    <div className="form-group"><label className="input-label">Start</label><input className="input-field" value={entry.startDate} onChange={e => updateEducation(entry.id, 'startDate', e.target.value)} /></div>
                                    <div className="form-group"><label className="input-label">End</label><input className="input-field" value={entry.endDate} onChange={e => updateEducation(entry.id, 'endDate', e.target.value)} /></div>
                                </div>
                            </div>
                        ))}
                        <button className="add-entry-btn" onClick={addEducation}>+ Add Education</button>
                    </div>

                    <div className="form-section">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Experience</h3>
                            <span className="form-section-num">4</span>
                        </div>
                        {data.experience.map((entry, idx) => (
                            <div className="entry-card" key={entry.id}>
                                <div className="entry-card-header">
                                    <span className="entry-card-num"># {idx + 1}</span>
                                    <button className="entry-remove-btn" onClick={() => removeExperience(entry.id)}>✕ Remove</button>
                                </div>
                                <div className="form-group"><label className="input-label">Company</label><input className="input-field" value={entry.company} onChange={e => updateExperience(entry.id, 'company', e.target.value)} /></div>
                                <div className="form-group"><label className="input-label">Role</label><input className="input-field" value={entry.role} onChange={e => updateExperience(entry.id, 'role', e.target.value)} /></div>
                                <div className="form-group">
                                    <label className="input-label">Description</label>
                                    <textarea className="input-field" value={entry.description} onChange={e => updateExperience(entry.id, 'description', e.target.value)} rows={3} />
                                    <BulletGuidance text={entry.description} />
                                </div>
                            </div>
                        ))}
                        <button className="add-entry-btn" onClick={addExperience}>+ Add Experience</button>
                    </div>

                    <div className="form-section">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Projects</h3>
                            <span className="form-section-num">5</span>
                        </div>
                        {data.projects.map((entry, idx) => (
                            <div className={`accordion-entry ${expandedProjects[entry.id] ? 'accordion-entry--expanded' : ''}`} key={entry.id}>
                                <div className="accordion-header" onClick={() => toggleProject(entry.id)}>
                                    <span className="accordion-title">{entry.title || `Project ${idx + 1}`}</span>
                                    <button className="entry-remove-btn" onClick={(e) => { e.stopPropagation(); removeProject(entry.id) }}>✕</button>
                                </div>
                                {expandedProjects[entry.id] && (
                                    <div className="accordion-content">
                                        <div className="form-group"><label className="input-label">Title</label><input className="input-field" value={entry.title} onChange={e => updateProject(entry.id, 'title', e.target.value)} /></div>
                                        <div className="form-group"><label className="input-label">Description</label><textarea className="input-field" value={entry.description} onChange={e => updateProject(entry.id, 'description', e.target.value)} rows={3} /></div>
                                        <div className="form-group"><label className="input-label">Tech Stack</label><TagInput tags={entry.techStack} onChange={tags => updateProject(entry.id, 'techStack', tags)} /></div>
                                        <div className="form-row">
                                            <div className="form-group"><label className="input-label">Live URL</label><input className="input-field" value={entry.liveUrl} onChange={e => updateProject(entry.id, 'liveUrl', e.target.value)} /></div>
                                            <div className="form-group"><label className="input-label">GitHub URL</label><input className="input-field" value={entry.githubUrl} onChange={e => updateProject(entry.id, 'githubUrl', e.target.value)} /></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button className="add-entry-btn" onClick={addProject}>+ Add Project</button>
                    </div>

                    <div className="form-section">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Skills</h3>
                            <span className="form-section-num">6</span>
                            <button className="btn-suggest" onClick={suggestSkills} disabled={isSuggesting}>{isSuggesting ? '...' : '✨ Suggest'}</button>
                        </div>
                        <div className="form-group"><label className="input-label">Technical</label><TagInput tags={data.skills.technical} onChange={tags => setCategorySkills('technical', tags)} /></div>
                        <div className="form-group"><label className="input-label">Soft Skills</label><TagInput tags={data.skills.soft} onChange={tags => setCategorySkills('soft', tags)} /></div>
                        <div className="form-group"><label className="input-label">Tools</label><TagInput tags={data.skills.tools} onChange={tags => setCategorySkills('tools', tags)} /></div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Links</h3>
                            <span className="form-section-num">7</span>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label className="input-label">GitHub</label><input className="input-field" value={data.links.github} onChange={e => setLink('github', e.target.value)} /></div>
                            <div className="form-group"><label className="input-label">LinkedIn</label><input className="input-field" value={data.links.linkedin} onChange={e => setLink('linkedin', e.target.value)} /></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="builder-preview-panel">
                <div className="picker-container">
                    <TemplatePicker selected={template} onSelect={handleTemplateChange} accentColor={accentColor} />
                    <ColorPicker selected={accentColor} onSelect={handleColorChange} />
                </div>

                <div className="ats-score-card">
                    <div className="ats-circular-box">
                        <div className="circular-score">
                            <svg className="circular-score-svg" viewBox="0 0 100 100">
                                <circle className="circular-score-bg" cx="50" cy="50" r="40" />
                                <circle
                                    className={`circular-score-fill score-${scoreInfo.color}`}
                                    cx="50" cy="50" r="40"
                                    strokeDasharray={circleCircumference}
                                    strokeDashoffset={dashOffset}
                                />
                            </svg>
                            <div className="circular-score-text">
                                <span className={`score-num score-${scoreInfo.color}`}>{atsResult.score}</span>
                                <span className="score-total">/100</span>
                            </div>
                        </div>
                        <span className={`ats-status-badge badge-${scoreInfo.color}`}>{scoreInfo.text}</span>
                    </div>

                    {improvements.length > 0 && (
                        <div className="ats-improvements">
                            <span className="ats-improvements-title">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                Suggestions to improve
                            </span>
                            <ul className="ats-improvements-list">
                                {improvements.map((s, i) => <li className="ats-improvement-item" key={i}>{s}</li>)}
                            </ul>
                        </div>
                    )}

                    <button className="btn btn-primary btn-full" style={{ marginTop: '24px', backgroundColor: accentColor, color: '#fff', border: 'none' }} onClick={handleDownload}>
                        Download Professional PDF
                    </button>
                </div>

                <div className="preview-panel-header">
                    <span className="preview-panel-title">Live Preview</span>
                    <span className="preview-panel-badge">Real-time</span>
                </div>

                <ResumePreview data={data} template={template} accentColor={accentColor} />

                {toast && (
                    <div className="toast-notification">
                        <span className="toast-icon">✓</span>
                        {toast}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Builder
