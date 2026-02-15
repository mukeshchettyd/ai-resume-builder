import { useState, useEffect } from 'react'

const STEPS = [
    'Core Layout & UI',
    'Resume Data Management',
    'Interactive Form Panel',
    'Real-time Preview Engine',
    'Customization Engine (Templates/Color)',
    'ATS Scoring System',
    'PDF Export & Toast System',
    'Persistence & Final Polish'
]

const CHECKLIST = [
    'All form sections save to localStorage',
    'Live preview updates in real-time',
    'Template switching preserves data',
    'Color theme persists after refresh',
    'ATS score calculates correctly',
    'Score updates live on edit',
    'Export buttons work (copy/download)',
    'Empty states handled gracefully',
    'Mobile responsive layout works',
    'No console errors on any page'
]

const STORAGE_KEY = 'rb_final_submission'

function Proof() {
    const [submission, setSubmission] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : {
            steps: {},
            checklist: {},
            links: {
                lovable: '',
                github: '',
                deployed: ''
            }
        }
    })

    const [copied, setCopied] = useState(false)

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(submission))
    }, [submission])

    const toggleStep = (step) => {
        setSubmission(prev => ({
            ...prev,
            steps: { ...prev.steps, [step]: !prev.steps[step] }
        }))
    }

    const toggleChecklist = (item) => {
        setSubmission(prev => ({
            ...prev,
            checklist: { ...prev.checklist, [item]: !prev.checklist[item] }
        }))
    }

    const handleLinkChange = (key, value) => {
        setSubmission(prev => ({
            ...prev,
            links: { ...prev.links, [key]: value }
        }))
    }

    const isValidUrl = (url) => {
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    const stepsCompleted = STEPS.every(step => submission.steps[step])
    const checklistPassed = CHECKLIST.every(item => submission.checklist[item])
    const linksProvided = submission.links.lovable && submission.links.github && submission.links.deployed
    const linksValid = isValidUrl(submission.links.lovable) && isValidUrl(submission.links.github) && isValidUrl(submission.links.deployed)

    const isShipped = stepsCompleted && checklistPassed && linksProvided && linksValid

    const copySubmission = () => {
        const text = `------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${submission.links.lovable}
GitHub Repository: ${submission.links.github}
Live Deployment: ${submission.links.deployed}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------`
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="proof-page" id="proof-page">
            <header className="proof-header">
                <h1 className="proof-title">Submission Proof</h1>
                <p className="proof-subtitle">Project 3 — AI Resume Builder Artifacts</p>
            </header>

            {/* Steps Overview */}
            <section className="proof-section">
                <h2 className="proof-section-title">
                    <span>🏗️</span> Step Completion Overview
                </h2>
                <div className="proof-grid">
                    {STEPS.map(step => (
                        <label key={step} className={`status-card ${submission.steps[step] ? 'status-card--done' : ''}`}>
                            <span className="status-label">{step}</span>
                            <input
                                type="checkbox"
                                className="status-checkbox"
                                checked={!!submission.steps[step]}
                                onChange={() => toggleStep(step)}
                            />
                        </label>
                    ))}
                </div>
            </section>

            {/* Checklist */}
            <section className="proof-section">
                <h2 className="proof-section-title">
                    <span>🧪</span> Verification Checklist
                </h2>
                <div className="proof-grid">
                    {CHECKLIST.map(item => (
                        <label key={item} className={`status-card ${submission.checklist[item] ? 'status-card--done' : ''}`}>
                            <span className="status-label">{item}</span>
                            <input
                                type="checkbox"
                                className="status-checkbox"
                                checked={!!submission.checklist[item]}
                                onChange={() => toggleChecklist(item)}
                            />
                        </label>
                    ))}
                </div>
            </section>

            {/* Artifact Collection */}
            <section className="proof-section">
                <h2 className="proof-section-title">
                    <span>📦</span> Artifact Collection
                </h2>
                <div className="artifact-inputs">
                    <div className="artifact-field">
                        <label className="artifact-label">Lovable Project Link</label>
                        <input
                            type="url"
                            className={`artifact-input ${submission.links.lovable && !isValidUrl(submission.links.lovable) ? 'artifact-input--invalid' : ''}`}
                            placeholder="https://lovable.dev/projects/..."
                            value={submission.links.lovable}
                            onChange={(e) => handleLinkChange('lovable', e.target.value)}
                        />
                    </div>
                    <div className="artifact-field">
                        <label className="artifact-label">GitHub Repository Link</label>
                        <input
                            type="url"
                            className={`artifact-input ${submission.links.github && !isValidUrl(submission.links.github) ? 'artifact-input--invalid' : ''}`}
                            placeholder="https://github.com/username/repo"
                            value={submission.links.github}
                            onChange={(e) => handleLinkChange('github', e.target.value)}
                        />
                    </div>
                    <div className="artifact-field">
                        <label className="artifact-label">Deployed URL</label>
                        <input
                            type="url"
                            className={`artifact-input ${submission.links.deployed && !isValidUrl(submission.links.deployed) ? 'artifact-input--invalid' : ''}`}
                            placeholder="https://username.github.io/repo"
                            value={submission.links.deployed}
                            onChange={(e) => handleLinkChange('deployed', e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Ship Status */}
            <section className="proof-section">
                <h2 className="proof-section-title">
                    <span>🚀</span> Ship Status
                </h2>
                <div className={`ship-status-banner ${isShipped ? 'ship-status-banner--shipped' : 'ship-status-banner--progress'}`}>
                    <span className={`ship-badge ${isShipped ? 'ship-badge--shipped' : 'ship-badge--progress'}`}>
                        {isShipped ? 'Shipped' : 'In Progress'}
                    </span>
                    <p className="ship-msg">
                        {isShipped
                            ? "All requirements met. Ready for final submission."
                            : "Complete all steps, verification tests, and provide valid links to ship."}
                    </p>
                    {isShipped && (
                        <div className="ship-final-msg">Project 3 Shipped Successfully.</div>
                    )}
                </div>

                <button
                    className="btn-copy-submission"
                    onClick={copySubmission}
                    disabled={!isShipped}
                >
                    {copied ? '✓ Submission Copied!' : 'Copy Final Submission'}
                </button>
            </section>
        </div>
    )
}

export default Proof
