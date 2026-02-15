import { useState, useCallback, useMemo } from 'react'
import ResumePreview from '../components/ResumePreview'
import TemplateTabs from '../components/TemplateTabs'
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

function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
            const parsed = JSON.parse(raw)
            // Migration for old skills string format
            if (typeof parsed.skills === 'string') {
                parsed.skills = {
                    technical: parsed.skills.split(',').map(s => s.trim()).filter(Boolean),
                    soft: [],
                    tools: []
                }
            }
            // Ensure categorical structure exists
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
    try {
        return localStorage.getItem(TEMPLATE_KEY) || 'classic'
    } catch { return 'classic' }
}

function saveTemplate(tpl) {
    localStorage.setItem(TEMPLATE_KEY, tpl)
}

/* ================================================================
   SCORE LABEL HELPER
   ================================================================ */
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
    const [isSuggesting, setIsSuggesting] = useState(false)
    const [expandedProjects, setExpandedProjects] = useState({})

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

    // ---- ATS Score (computed live) ----
    const atsResult = useMemo(() => computeATSScore(data), [data])
    const improvements = useMemo(() => generateImprovements(data), [data])
    const scoreLabel = getScoreLabel(atsResult.score)

    // ---- Personal ----
    const setPersonal = (field, value) => {
        update(prev => ({
            ...prev,
            personal: { ...prev.personal, [field]: value }
        }))
    }

    // ---- Summary ----
    const setSummary = (value) => {
        update(prev => ({ ...prev, summary: value }))
    }

    // ---- Education ----
    const addEducation = () => {
        update(prev => ({
            ...prev,
            education: [...prev.education, {
                id: generateId('edu'),
                institution: '',
                degree: '',
                startDate: '',
                endDate: '',
                description: '',
            }]
        }))
    }

    const updateEducation = (id, field, value) => {
        update(prev => ({
            ...prev,
            education: prev.education.map(e =>
                e.id === id ? { ...e, [field]: value } : e
            )
        }))
    }

    const removeEducation = (id) => {
        update(prev => ({
            ...prev,
            education: prev.education.filter(e => e.id !== id)
        }))
    }

    // ---- Experience ----
    const addExperience = () => {
        update(prev => ({
            ...prev,
            experience: [...prev.experience, {
                id: generateId('exp'),
                company: '',
                role: '',
                startDate: '',
                endDate: '',
                description: '',
            }]
        }))
    }

    const updateExperience = (id, field, value) => {
        update(prev => ({
            ...prev,
            experience: prev.experience.map(e =>
                e.id === id ? { ...e, [field]: value } : e
            )
        }))
    }

    const removeExperience = (id) => {
        update(prev => ({
            ...prev,
            experience: prev.experience.filter(e => e.id !== id)
        }))
    }

    // ---- Projects ----
    const addProject = () => {
        const newId = generateId('proj')
        update(prev => ({
            ...prev,
            projects: [...prev.projects, {
                id: newId,
                title: '',
                description: '',
                techStack: [],
                liveUrl: '',
                githubUrl: '',
            }]
        }))
        setExpandedProjects(prev => ({ ...prev, [newId]: true }))
    }

    const updateProject = (id, field, value) => {
        update(prev => ({
            ...prev,
            projects: prev.projects.map(p =>
                p.id === id ? { ...p, [field]: value } : p
            )
        }))
    }

    const removeProject = (id) => {
        update(prev => ({
            ...prev,
            projects: prev.projects.filter(p => p.id !== id)
        }))
    }

    const toggleProject = (id) => {
        setExpandedProjects(prev => ({ ...prev, [id]: !prev[id] }))
    }

    // ---- Skills ----
    const setCategorySkills = (category, skills) => {
        update(prev => ({
            ...prev,
            skills: { ...prev.skills, [category]: skills }
        }))
    }

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

    // ---- Links ----
    const setLink = (key, value) => {
        update(prev => ({
            ...prev,
            links: { ...prev.links, [key]: value }
        }))
    }

    // ---- Load Sample Data ----
    const loadSample = () => {
        update(SAMPLE_DATA)
    }

    // ---- Clear Data ----
    const clearData = () => {
        update(EMPTY_STATE)
    }

    return (
        <div className="builder-layout" id="builder-page">
            <div className="builder-form-panel" id="builder-form">
                <div className="builder-form-inner">
                    <div className="builder-header">
                        <h1 className="builder-title">Resume Builder</h1>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-secondary btn-sm" onClick={loadSample} id="btn-load-sample">
                                Load Sample Data
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={clearData} id="btn-clear">
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* ---- Section 1: Personal Info ---- */}
                    <div className="form-section">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Personal Information</h3>
                            <span className="form-section-num">1</span>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="input-label">Full Name</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    placeholder="John Doe"
                                    value={data.personal.name}
                                    onChange={e => setPersonal('name', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="input-label">Email</label>
                                <input
                                    className="input-field"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={data.personal.email}
                                    onChange={e => setPersonal('email', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="input-label">Phone</label>
                                <input
                                    className="input-field"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={data.personal.phone}
                                    onChange={e => setPersonal('phone', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="input-label">Location</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    placeholder="Bengaluru, India"
                                    value={data.personal.location}
                                    onChange={e => setPersonal('location', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ---- Section 2: Summary ---- */}
                    <div className="form-section">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Professional Summary</h3>
                            <span className="form-section-num">2</span>
                        </div>
                        <div className="form-group">
                            <label className="input-label">Summary</label>
                            <textarea
                                className="input-field"
                                placeholder="A brief professional summary..."
                                value={data.summary}
                                onChange={e => setSummary(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* ---- Section 3: Education ---- */}
                    <div className="form-section">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Education</h3>
                            <span className="form-section-num">3</span>
                        </div>
                        {data.education.map((entry, idx) => (
                            <div className="entry-card" key={entry.id}>
                                <div className="entry-card-header">
                                    <span className="entry-card-num">Education {idx + 1}</span>
                                    <button className="entry-remove-btn" onClick={() => removeEducation(entry.id)}>✕ Remove</button>
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Institution</label>
                                    <input className="input-field" placeholder="University" value={entry.institution} onChange={e => updateEducation(entry.id, 'institution', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Degree</label>
                                    <input className="input-field" placeholder="B.Tech" value={entry.degree} onChange={e => updateEducation(entry.id, 'degree', e.target.value)} />
                                </div>
                                <div className="form-row">
                                    <div className="form-group"><label className="input-label">Start</label><input className="input-field" value={entry.startDate} onChange={e => updateEducation(entry.id, 'startDate', e.target.value)} /></div>
                                    <div className="form-group"><label className="input-label">End</label><input className="input-field" value={entry.endDate} onChange={e => updateEducation(entry.id, 'endDate', e.target.value)} /></div>
                                </div>
                            </div>
                        ))}
                        <button className="add-entry-btn" onClick={addEducation}>+ Add Education</button>
                    </div>

                    {/* ---- Section 4: Experience ---- */}
                    <div className="form-section">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Experience</h3>
                            <span className="form-section-num">4</span>
                        </div>
                        {data.experience.map((entry, idx) => (
                            <div className="entry-card" key={entry.id}>
                                <div className="entry-card-header">
                                    <span className="entry-card-num">Experience {idx + 1}</span>
                                    <button className="entry-remove-btn" onClick={() => removeExperience(entry.id)}>✕ Remove</button>
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Company</label>
                                    <input className="input-field" placeholder="Company" value={entry.company} onChange={e => updateExperience(entry.id, 'company', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Role</label>
                                    <input className="input-field" placeholder="Role" value={entry.role} onChange={e => updateExperience(entry.id, 'role', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Description</label>
                                    <textarea className="input-field" value={entry.description} onChange={e => updateExperience(entry.id, 'description', e.target.value)} rows={3} />
                                    <BulletGuidance text={entry.description} />
                                </div>
                            </div>
                        ))}
                        <button className="add-entry-btn" onClick={addExperience}>+ Add Experience</button>
                    </div>

                    {/* ---- Section 5: Projects (NEW) ---- */}
                    <div className="form-section" id="section-projects">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Projects</h3>
                            <span className="form-section-num">5</span>
                        </div>
                        {data.projects.map((entry, idx) => (
                            <div className={`accordion-entry ${expandedProjects[entry.id] ? 'accordion-entry--expanded' : ''}`} key={entry.id}>
                                <div className="accordion-header" onClick={() => toggleProject(entry.id)}>
                                    <span className="accordion-title">{entry.title || `Project ${idx + 1}`}</span>
                                    <div className="accordion-controls">
                                        <button className="entry-remove-btn" onClick={(e) => { e.stopPropagation(); removeProject(entry.id) }}>✕</button>
                                        <span className="accordion-icon">{expandedProjects[entry.id] ? '−' : '+'}</span>
                                    </div>
                                </div>
                                {expandedProjects[entry.id] && (
                                    <div className="accordion-content">
                                        <div className="form-group">
                                            <label className="input-label">Project Title</label>
                                            <input className="input-field" value={entry.title} onChange={e => updateProject(entry.id, 'title', e.target.value)} placeholder="E-commerce App" />
                                        </div>
                                        <div className="form-group">
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <label className="input-label">Description</label>
                                                <span className={`char-counter ${entry.description?.length > 200 ? 'char-counter--error' : ''}`}>
                                                    {entry.description?.length || 0}/200
                                                </span>
                                            </div>
                                            <textarea
                                                className="input-field"
                                                value={entry.description}
                                                onChange={e => updateProject(entry.id, 'description', e.target.value)}
                                                rows={3}
                                                placeholder="A brief overview..."
                                            />
                                            <BulletGuidance text={entry.description} />
                                        </div>
                                        <div className="form-group">
                                            <label className="input-label">Tech Stack</label>
                                            <TagInput tags={entry.techStack} onChange={tags => updateProject(entry.id, 'techStack', tags)} placeholder="React, Node.js..." />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="input-label">Live URL</label>
                                                <input className="input-field" value={entry.liveUrl} onChange={e => updateProject(entry.id, 'liveUrl', e.target.value)} placeholder="https://..." />
                                            </div>
                                            <div className="form-group">
                                                <label className="input-label">GitHub URL</label>
                                                <input className="input-field" value={entry.githubUrl} onChange={e => updateProject(entry.id, 'githubUrl', e.target.value)} placeholder="https://github..." />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button className="add-entry-btn" onClick={addProject}>+ Add Project</button>
                    </div>

                    {/* ---- Section 6: Skills (NEW) ---- */}
                    <div className="form-section" id="section-skills">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Skills</h3>
                            <span className="form-section-num">6</span>
                            <button
                                className={`btn-suggest ${isSuggesting ? 'btn-suggest--loading' : ''}`}
                                onClick={suggestSkills}
                                disabled={isSuggesting}
                            >
                                {isSuggesting ? 'Thinking...' : '✨ Suggest Skills'}
                            </button>
                        </div>

                        <div className="skill-category-group">
                            <div className="form-group">
                                <label className="input-label">Technical Skills ({data.skills.technical?.length || 0})</label>
                                <TagInput
                                    tags={data.skills.technical}
                                    onChange={tags => setCategorySkills('technical', tags)}
                                    placeholder="Add technical skills..."
                                />
                            </div>
                            <div className="form-group">
                                <label className="input-label">Soft Skills ({data.skills.soft?.length || 0})</label>
                                <TagInput
                                    tags={data.skills.soft}
                                    onChange={tags => setCategorySkills('soft', tags)}
                                    placeholder="Add soft skills..."
                                />
                            </div>
                            <div className="form-group">
                                <label className="input-label">Tools & Technologies ({data.skills.tools?.length || 0})</label>
                                <TagInput
                                    tags={data.skills.tools}
                                    onChange={tags => setCategorySkills('tools', tags)}
                                    placeholder="Add tools & technologies..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* ---- Section 7: Links ---- */}
                    <div className="form-section">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Links</h3>
                            <span className="form-section-num">7</span>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="input-label">GitHub</label>
                                <input className="input-field" type="url" value={data.links.github} onChange={e => setLink('github', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="input-label">LinkedIn</label>
                                <input className="input-field" type="url" value={data.links.linkedin} onChange={e => setLink('linkedin', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="builder-preview-panel">
                <div className="ats-score-card">
                    <div className="ats-score-header">
                        <span className="ats-score-label">ATS Readiness Score</span>
                        <span className={`ats-score-status ${scoreLabel.className}`}>{scoreLabel.text}</span>
                    </div>
                    <div className="ats-meter">
                        <div className="ats-meter-track">
                            <div className="ats-meter-fill" style={{ width: `${(atsResult.score / atsResult.maxPossible) * 100}%` }}></div>
                        </div>
                        <div className="ats-meter-value">
                            <span className="ats-meter-number">{atsResult.score}</span>
                            <span className="ats-meter-max">/ {atsResult.maxPossible}</span>
                        </div>
                    </div>
                    <div className="ats-breakdown">
                        {atsResult.breakdown.map((item, i) => (
                            <div className="ats-breakdown-row" key={i}>
                                <span className={`ats-breakdown-dot ${item.earned > 0 ? 'ats-breakdown-dot--earned' : ''}`}>{item.earned > 0 ? '✓' : '○'}</span>
                                <span className="ats-breakdown-label">{item.label}</span>
                                <span className={`ats-breakdown-pts ${item.earned > 0 ? 'ats-breakdown-pts--earned' : ''}`}>+{item.earned}</span>
                            </div>
                        ))}
                    </div>
                    {improvements.length > 0 && (
                        <div className="ats-improvements">
                            <span className="ats-improvements-title">Top 3 Improvements</span>
                            <ul className="ats-improvements-list">
                                {improvements.map((s, i) => <li className="ats-improvement-item" key={i}>{s}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
                <TemplateTabs selected={template} onSelect={handleTemplateChange} />
                <div className="preview-panel-header">
                    <span className="preview-panel-title">Live Preview</span>
                    <span className="preview-panel-badge">Real-time</span>
                </div>
                <ResumePreview data={data} template={template} />
            </div>
        </div>
    )
}

export default Builder
