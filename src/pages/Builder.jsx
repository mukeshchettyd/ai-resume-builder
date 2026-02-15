import { useState, useCallback } from 'react'
import ResumePreview from '../components/ResumePreview'
import SAMPLE_DATA from '../data/sampleData'

/* ================================================================
   EMPTY STATE
   ================================================================ */
const EMPTY_STATE = {
    personal: { name: '', email: '', phone: '', location: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: '',
    links: { github: '', linkedin: '' },
}

let entryId = 100

function generateId(prefix) {
    return `${prefix}-${++entryId}`
}

/* ================================================================
   STORAGE
   ================================================================ */
const STORAGE_KEY = 'aiResumeBuilderData'

function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) return JSON.parse(raw)
    } catch { /* ignore */ }
    return EMPTY_STATE
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

/* ================================================================
   BUILDER PAGE
   ================================================================ */
function Builder() {
    const [data, setData] = useState(() => loadData())

    const update = useCallback((updater) => {
        setData(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater
            saveData(next)
            return next
        })
    }, [])

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
        update(prev => ({
            ...prev,
            projects: [...prev.projects, {
                id: generateId('proj'),
                name: '',
                tech: '',
                description: '',
            }]
        }))
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

    // ---- Skills ----
    const setSkills = (value) => {
        update(prev => ({ ...prev, skills: value }))
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
            {/* ============================================
          LEFT: Form Panel
          ============================================ */}
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
                    <div className="form-section" id="section-personal">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Personal Information</h3>
                            <span className="form-section-num">1</span>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="input-label" htmlFor="input-name">Full Name</label>
                                <input
                                    className="input-field"
                                    id="input-name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={data.personal.name}
                                    onChange={e => setPersonal('name', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="input-label" htmlFor="input-email">Email</label>
                                <input
                                    className="input-field"
                                    id="input-email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={data.personal.email}
                                    onChange={e => setPersonal('email', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="input-label" htmlFor="input-phone">Phone</label>
                                <input
                                    className="input-field"
                                    id="input-phone"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={data.personal.phone}
                                    onChange={e => setPersonal('phone', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="input-label" htmlFor="input-location">Location</label>
                                <input
                                    className="input-field"
                                    id="input-location"
                                    type="text"
                                    placeholder="Bengaluru, India"
                                    value={data.personal.location}
                                    onChange={e => setPersonal('location', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ---- Section 2: Summary ---- */}
                    <div className="form-section" id="section-summary">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Professional Summary</h3>
                            <span className="form-section-num">2</span>
                        </div>
                        <div className="form-group">
                            <label className="input-label" htmlFor="input-summary">Summary</label>
                            <textarea
                                className="input-field"
                                id="input-summary"
                                placeholder="A brief professional summary highlighting your key strengths and career goals..."
                                value={data.summary}
                                onChange={e => setSummary(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* ---- Section 3: Education ---- */}
                    <div className="form-section" id="section-education">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Education</h3>
                            <span className="form-section-num">3</span>
                        </div>
                        {data.education.map((entry, idx) => (
                            <div className="entry-card" key={entry.id}>
                                <div className="entry-card-header">
                                    <span className="entry-card-num">Education {idx + 1}</span>
                                    <button
                                        className="entry-remove-btn"
                                        onClick={() => removeEducation(entry.id)}
                                        aria-label="Remove education entry"
                                    >
                                        ✕ Remove
                                    </button>
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Institution</label>
                                    <input
                                        className="input-field"
                                        placeholder="University Name"
                                        value={entry.institution}
                                        onChange={e => updateEducation(entry.id, 'institution', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Degree</label>
                                    <input
                                        className="input-field"
                                        placeholder="B.Tech in Computer Science"
                                        value={entry.degree}
                                        onChange={e => updateEducation(entry.id, 'degree', e.target.value)}
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="input-label">Start Date</label>
                                        <input
                                            className="input-field"
                                            placeholder="2018"
                                            value={entry.startDate}
                                            onChange={e => updateEducation(entry.id, 'startDate', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">End Date</label>
                                        <input
                                            className="input-field"
                                            placeholder="2022"
                                            value={entry.endDate}
                                            onChange={e => updateEducation(entry.id, 'endDate', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Description</label>
                                    <textarea
                                        className="input-field"
                                        placeholder="Relevant coursework, achievements, CGPA..."
                                        value={entry.description}
                                        onChange={e => updateEducation(entry.id, 'description', e.target.value)}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        ))}
                        <button className="add-entry-btn" onClick={addEducation} id="btn-add-education">
                            + Add Education
                        </button>
                    </div>

                    {/* ---- Section 4: Experience ---- */}
                    <div className="form-section" id="section-experience">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Experience</h3>
                            <span className="form-section-num">4</span>
                        </div>
                        {data.experience.map((entry, idx) => (
                            <div className="entry-card" key={entry.id}>
                                <div className="entry-card-header">
                                    <span className="entry-card-num">Experience {idx + 1}</span>
                                    <button
                                        className="entry-remove-btn"
                                        onClick={() => removeExperience(entry.id)}
                                        aria-label="Remove experience entry"
                                    >
                                        ✕ Remove
                                    </button>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="input-label">Company</label>
                                        <input
                                            className="input-field"
                                            placeholder="Company Name"
                                            value={entry.company}
                                            onChange={e => updateExperience(entry.id, 'company', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Role</label>
                                        <input
                                            className="input-field"
                                            placeholder="Software Engineer"
                                            value={entry.role}
                                            onChange={e => updateExperience(entry.id, 'role', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="input-label">Start Date</label>
                                        <input
                                            className="input-field"
                                            placeholder="Jul 2022"
                                            value={entry.startDate}
                                            onChange={e => updateExperience(entry.id, 'startDate', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">End Date</label>
                                        <input
                                            className="input-field"
                                            placeholder="Present"
                                            value={entry.endDate}
                                            onChange={e => updateExperience(entry.id, 'endDate', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Description</label>
                                    <textarea
                                        className="input-field"
                                        placeholder="Key responsibilities, achievements, impact metrics..."
                                        value={entry.description}
                                        onChange={e => updateExperience(entry.id, 'description', e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        ))}
                        <button className="add-entry-btn" onClick={addExperience} id="btn-add-experience">
                            + Add Experience
                        </button>
                    </div>

                    {/* ---- Section 5: Projects ---- */}
                    <div className="form-section" id="section-projects">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Projects</h3>
                            <span className="form-section-num">5</span>
                        </div>
                        {data.projects.map((entry, idx) => (
                            <div className="entry-card" key={entry.id}>
                                <div className="entry-card-header">
                                    <span className="entry-card-num">Project {idx + 1}</span>
                                    <button
                                        className="entry-remove-btn"
                                        onClick={() => removeProject(entry.id)}
                                        aria-label="Remove project entry"
                                    >
                                        ✕ Remove
                                    </button>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="input-label">Project Name</label>
                                        <input
                                            className="input-field"
                                            placeholder="My Awesome Project"
                                            value={entry.name}
                                            onChange={e => updateProject(entry.id, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Tech Stack</label>
                                        <input
                                            className="input-field"
                                            placeholder="React, Node.js, MongoDB"
                                            value={entry.tech}
                                            onChange={e => updateProject(entry.id, 'tech', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Description</label>
                                    <textarea
                                        className="input-field"
                                        placeholder="What it does, key features, impact..."
                                        value={entry.description}
                                        onChange={e => updateProject(entry.id, 'description', e.target.value)}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        ))}
                        <button className="add-entry-btn" onClick={addProject} id="btn-add-project">
                            + Add Project
                        </button>
                    </div>

                    {/* ---- Section 6: Skills ---- */}
                    <div className="form-section" id="section-skills">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Skills</h3>
                            <span className="form-section-num">6</span>
                        </div>
                        <div className="form-group">
                            <label className="input-label" htmlFor="input-skills">Skills (comma-separated)</label>
                            <input
                                className="input-field"
                                id="input-skills"
                                type="text"
                                placeholder="React, Node.js, Python, Docker, AWS..."
                                value={data.skills}
                                onChange={e => setSkills(e.target.value)}
                            />
                            <span className="input-hint">Separate each skill with a comma</span>
                        </div>
                    </div>

                    {/* ---- Section 7: Links ---- */}
                    <div className="form-section" id="section-links">
                        <div className="form-section-header">
                            <h3 className="form-section-title">Links</h3>
                            <span className="form-section-num">7</span>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="input-label" htmlFor="input-github">GitHub</label>
                                <input
                                    className="input-field"
                                    id="input-github"
                                    type="url"
                                    placeholder="https://github.com/username"
                                    value={data.links.github}
                                    onChange={e => setLink('github', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="input-label" htmlFor="input-linkedin">LinkedIn</label>
                                <input
                                    className="input-field"
                                    id="input-linkedin"
                                    type="url"
                                    placeholder="https://linkedin.com/in/username"
                                    value={data.links.linkedin}
                                    onChange={e => setLink('linkedin', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============================================
          RIGHT: Live Preview Panel
          ============================================ */}
            <div className="builder-preview-panel" id="builder-preview">
                <div className="preview-panel-header">
                    <span className="preview-panel-title">Live Preview</span>
                    <span className="preview-panel-badge">Real-time</span>
                </div>
                <ResumePreview data={data} />
            </div>
        </div>
    )
}

export default Builder
